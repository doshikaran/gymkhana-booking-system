# app/api/v1/courts.py
from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import joinedload
from app.api.deps import SessionDep
from app.models.court import Court
from app.models.sports import Sport
from app.services.court_service import CourtService
from app.schemas.court_schema import CourtBase

router = APIRouter()

@router.get("/courts", response_model=list[CourtBase])
async def list_courts(session: SessionDep, sport: str | None = Query(None)):
    q = select(Court).options(joinedload(Court.sport)).where(Court.is_active == True)

    if sport:
        q = q.join(Sport).where(Sport.name.ilike(sport))

    result = await session.execute(q)
    return result.scalars().all()
