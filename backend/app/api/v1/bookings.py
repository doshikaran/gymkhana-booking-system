# app/api/v1/bookings.py
from fastapi import APIRouter, Depends, HTTPException, Query
from datetime import datetime, timezone
from typing import Literal

from sqlalchemy import func, select
from app.api.deps import SessionDep, get_current_member
from app.models.sports import Sport
from app.services.booking_service import BookingService
from app.schemas.booking_schema import BookingCreate, BookingResponse
from app.models.booking_member import BookingMember
from app.models.booking import Booking
from app.utils.exceptions import not_found, unauthorized
from datetime import datetime, timedelta
from app.utils.datetime_utils import to_ist


router = APIRouter()

def map_booking(b: Booking) -> BookingResponse:
    members = [
        {"member_id": str(bm.member_id), "role": bm.role.value if hasattr(bm.role, "value") else bm.role}
        for bm in b.members
    ]
    duration = int((b.end_time - b.start_time).total_seconds() // 60)
    return BookingResponse(
        id=str(b.id),
        court_id=b.court_id,
        start_time=b.start_time,
        end_time=b.end_time,
        duration=duration,     
        status=b.status,
        sport=b.sport.name if b.sport else None,
        created_by_life_no=b.created_by_life_no,
        other_member_life_nos=b.other_member_life_nos,
        members=members,
    )

@router.post("/bookings", response_model=BookingResponse)
async def create_booking(payload: BookingCreate, session: SessionDep, current=Depends(get_current_member)):
    svc = BookingService(session)
    b = await svc.create_booking(
        creator_id=str(current.id),
        court_id=payload.court_id,
        start_time=payload.start_time,
        member_life_nos=payload.member_nos,
        sport=payload.sport
    )
    return map_booking(b)

@router.get("/bookings", response_model=list[BookingResponse])
async def list_bookings(
    session: SessionDep,
    current=Depends(get_current_member),
    sport: str = Query(...), 
    filter: Literal["upcoming", "past"] = Query("upcoming"),
):
    svc = BookingService(session)
    upcoming = filter == "upcoming"
    bookings = await svc.bookings.list_for_member(str(current.id), sport=sport, upcoming=upcoming, limit=100)
    now = datetime.now(timezone.utc)
    for b in bookings:
        if b.end_time < now and b.status == "UPCOMING":
            b.status = "COMPLETED"
            session.add(b)

    await session.commit()
    if upcoming:
        filtered = [b for b in bookings if b.status == "UPCOMING" and b.end_time >= now]
    else:
        filtered = [b for b in bookings if b.status == "COMPLETED" or b.end_time < now]

    return [map_booking(b) for b in filtered]


@router.get("/bookings/availability")
async def get_availability(
    session: SessionDep,
    court_id: int = Query(...),
    date: Literal["today", "tomorrow"] = Query(...),
    sport: str = Query(...),
):
    """Get booked time slots for a specific court and date"""
    svc = BookingService(session)
    now_ist = to_ist(datetime.now(timezone.utc))
    target_date = now_ist.date()
    if date == "tomorrow":
        target_date += timedelta(days=1)
    
    result = await session.execute(
      select(Sport).where(func.lower(Sport.name) == sport.lower())
  )
    sport_obj = result.scalar_one_or_none()
    if not sport_obj:
        return []
    
    bookings = await svc.bookings.get_by_court_and_start(
        court_id=court_id,
        target_date=target_date,
        sport_id=sport_obj.id,
    )

    return [{"start_time": b.start_time.isoformat()} for b in bookings]

@router.delete("/bookings/{booking_id}")
async def delete_booking(
    booking_id: str,
    session: SessionDep,
    current=Depends(get_current_member),
):
  
    svc = BookingService(session)
    booking = await svc.bookings.get_by_id(booking_id)
    if not booking:
        not_found("BOOKING_NOT_FOUND", "The booking does not exist.")

    if str(booking.created_by_member_id) != str(current.id):
        unauthorized("You are not authorized to delete this booking.")

    await svc.bookings.delete(booking_id)
    await session.commit()
    return {"message": "Booking deleted successfully"}