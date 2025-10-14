# app/repositories/booking_repo.py
from typing import List, Optional
from sqlalchemy import select, and_, func, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.models.booking import Booking, BookingStatus
from app.models.booking_member import BookingMember
from datetime import date, datetime, timezone

from app.models.court import Court
from app.models.sports import Sport


class BookingRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_court_and_start(self, court_id: int, target_date: date, sport_id: int) -> Optional[Booking]:
        result = await self.session.execute(
            select(Booking)
            .options(selectinload(Booking.members))
            .where(
                and_(
                    Booking.court_id == court_id,
                    func.date(Booking.start_time) == target_date,
                    Booking.sport_id == sport_id,
                    Booking.status == BookingStatus.UPCOMING
                )
            )
            .order_by(Booking.start_time)
        )
        return list(result.scalars().all())
    
    async def delete(self, booking_id: str):
      await self.session.execute(
          delete(Booking).where(Booking.id == booking_id)
      )

    async def get_by_id(self, booking_id: str) -> Booking | None:
      result = await self.session.execute(
          select(Booking).where(Booking.id == booking_id)
      )
      return result.scalar_one_or_none()
    async def member_has_booking_at(self, member_ids: list, start: datetime, sport_id: int) -> bool:
        if not member_ids:
            return False
        q = (
            select(Booking)
            .join(BookingMember, BookingMember.booking_id == Booking.id)
            .where(
                BookingMember.member_id.in_(member_ids),
                Booking.start_time == start,
                Booking.sport_id == sport_id,
                Booking.status != BookingStatus.CANCELLED,
            )
            .limit(1)
        )
        res = await self.session.execute(q)
        return res.scalar_one_or_none() is not None

    async def create(self, court_id: int, created_by_member_id: str, sport_id: int, created_by_life_no: str,
    other_member_life_nos: list[str], start: datetime, end: datetime) -> Booking:
        b = Booking(
            court_id=court_id,
            sport_id=sport_id,
        created_by_member_id=created_by_member_id,
        created_by_life_no=created_by_life_no,
        other_member_life_nos=other_member_life_nos,
        start_time=start,
        end_time=end,
        status=BookingStatus.UPCOMING,
            )
        self.session.add(b)
        await self.session.flush()
        return b

    async def add_booking_members(self, booking_id: str, member_roles: list[tuple[str, str]]):
        for member_id, role in member_roles:
            self.session.add(BookingMember(booking_id=booking_id, member_id=member_id, role=role))
        await self.session.flush()

    async def list_for_member(self, member_id: str, sport: str, upcoming: bool, limit: int) -> List[Booking]:
        q = (
            select(Booking)
            .options(
            selectinload(Booking.members),
            selectinload(Booking.sport),   
            )
            .join(Sport, Booking.sport_id == Sport.id)  
            .where(Booking.status != BookingStatus.CANCELLED)
            .where(Sport.name.ilike(sport.lower()))     
            .join(BookingMember, BookingMember.booking_id == Booking.id)
            .where(BookingMember.member_id == member_id)
            .order_by(Booking.start_time.desc())
            .limit(limit)
            )

        res = await self.session.execute(q)
        bookings = list(res.scalars().unique().all())
        now = datetime.now(timezone.utc)
        return [b for b in bookings if (b.start_time >= now) == upcoming]
