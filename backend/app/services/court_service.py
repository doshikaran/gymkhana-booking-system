# app/services/court_service.py
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.court_repo import CourtRepository

class CourtService:
    def __init__(self, session: AsyncSession):
        self.courts = CourtRepository(session)

    async def list_active(self):
        return await self.courts.list_active()
