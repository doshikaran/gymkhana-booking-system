# app/services/booking_service.py
from datetime import datetime, timedelta, timezone
from typing import List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import selectinload
from app.models.booking import Booking
from app.models.sports import Sport
from app.repositories.booking_repo import BookingRepository
from app.repositories.member_repo import MemberRepository
from app.repositories.court_repo import CourtRepository
from app.models.booking_member import MemberRole
from app.utils.datetime_utils import is_today_or_tomorrow_ist, within_5_hours_if_today, aligns_to_slot_grid, to_ist
from app.utils.exceptions import bad_request, conflict, not_found

SLOT_MINUTES = 60
OPEN_HOUR = 6   # 06:00
CLOSE_HOUR = 22 # 22:00

SPORT_RULES = {
          "badminton": {"min_total": 4, "max_total": 8},
          "pickleball": {"min_total": 2, "max_total": 6},
          "tennis": {"min_total": 2, "max_total": 4},
          "table_tennis": {"min_total": 2, "max_total": 6},
        } 

class BookingService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.bookings = BookingRepository(session)
        self.members = MemberRepository(session)
        self.courts = CourtRepository(session)

    def _compute_end(self, start: datetime) -> datetime:
        return start + timedelta(minutes=SLOT_MINUTES)

    def _validate_hours(self, start: datetime):
        s = to_ist(start)
        if not (OPEN_HOUR <= s.hour < CLOSE_HOUR):
            bad_request("OUT_OF_HOURS", "Start time is outside operating hours (06:00–22:00 IST)")
        if s.minute not in (0,):  # grid on the hour
            bad_request("OFF_GRID", "Start time must align to slot grid")

    async def create_booking(self, *, creator_id: str, court_id: int, start_time: datetime, member_life_nos: List[str], sport: str,):
        # fetch sport_id from name
        sport_obj = await self.session.execute(select(Sport).where(Sport.name.ilike(sport.lower())))
        sport_row = sport_obj.scalar_one_or_none()
        if not sport_row:
            bad_request("SPORT_NOT_FOUND", f"Invalid sport: {sport}")
        
        rules = SPORT_RULES.get((sport or "").lower())
        if not rules:
            bad_request("INVALID_SPORT", f"Unsupported sport: {sport}")

        total_players = 1 + len(member_life_nos)
        if not (rules["min_total"] <= total_players <= rules["max_total"]):
            bad_request(
                "INVALID_PLAYER_COUNT",
                f"{sport.title()} requires between {rules['min_total']} and {rules['max_total']} total players (including you).",)

        # only today or tomorrow
        if not is_today_or_tomorrow_ist(start_time):
            bad_request("DATE_LIMIT", "Only today and tomorrow are allowed")

        # 5-hour rule for 'today'
        if not within_5_hours_if_today(start_time):
            bad_request("BOOKING_WINDOW", "If booking for today, it must be within 5 hours from now")

        # court exists & active
        court = await self.courts.get(court_id)
        if not court:
            not_found("COURT_NOT_FOUND", "Invalid court")

        # time grid & hours
        end_time = self._compute_end(start_time)
        if not aligns_to_slot_grid(start_time, end_time, SLOT_MINUTES):
            bad_request("OFF_GRID", "Slot must be exactly 60 minutes on the hour")
        self._validate_hours(start_time)

        # resolve members
        secondaries = await self.members.get_many_by_life_nos(member_life_nos)
        if len(secondaries) != len(member_life_nos):
            bad_request("MEMBER_NOT_FOUND", "One or more member numbers are invalid")

        # prepare member IDs: [creator + 3]
        member_ids = [creator_id] + [str(m.id) for m in secondaries]
        if len(set(member_ids)) != len(member_ids):
            bad_request("DUPLICATE_MEMBER", "Members must be unique")

        # no member has booking at same start time
        if await self.bookings.member_has_booking_at(member_ids, start_time, sport_row.id):
            conflict("ALREADY_BOOKED_THIS_SLOT", "One of the members has already booked this time")

        # no double-book on same court/start
        if await self.bookings.get_by_court_and_start(court_id, start_time, sport_row.id):
            conflict("SLOT_TAKEN", "This court/time is already booked")

        # transactional create
        try:
            creator = await self.members.get_by_id(creator_id)
            other_life_nos = [m.life_membership_no for m in secondaries]
            
            b = await self.bookings.create(
                court_id=court_id,
                sport_id=sport_row.id,
                created_by_member_id=creator_id,
                created_by_life_no=creator.life_membership_no,
                other_member_life_nos=other_life_nos,
                start=start_time,
                end=end_time,
            )
            roles = [(creator_id, MemberRole.PRIMARY.value)] + [(str(m.id), MemberRole.SECONDARY.value) for m in secondaries]
            await self.bookings.add_booking_members(str(b.id), roles)
            await self.session.commit()
            result = await self.session.execute(
                select(Booking)
                .options(
                    selectinload(Booking.members),
                    selectinload(Booking.sport),    
                    selectinload(Booking.court),     
                )
                .where(Booking.id == b.id)
            )
            booking_full = result.scalar_one()
            return booking_full

        except IntegrityError:
            await self.session.rollback()
            conflict("SLOT_TAKEN", "This court/time is already booked")
