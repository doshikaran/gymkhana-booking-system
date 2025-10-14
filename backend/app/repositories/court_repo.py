# app/repositories/court_repo.py
from typing import Optional, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.court import Court

class CourtRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def list_active(self) -> List[Court]:
        res = await self.session.execute(select(Court).where(Court.is_active == True).order_by(Court.id))
        return list(res.scalars().all())

    async def get(self, court_id: int) -> Optional[Court]:
        res = await self.session.execute(select(Court).where(Court.id == court_id, Court.is_active == True))
        return res.scalar_one_or_none()
