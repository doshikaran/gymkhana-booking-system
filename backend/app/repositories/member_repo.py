# app/repositories/member_repo.py
from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.member import Member

class MemberRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, member_id: str) -> Optional[Member]:
        res = await self.session.execute(select(Member).where(Member.id == member_id))
        return res.scalar_one_or_none()

    async def get_by_life_no(self, life_no: str) -> Optional[Member]:
        res = await self.session.execute(select(Member).where(Member.life_membership_no == life_no))
        return res.scalar_one_or_none()

    async def get_many_by_life_nos(self, life_nos: list[str]) -> list[Member]:
        if not life_nos:
            return []
        res = await self.session.execute(select(Member).where(Member.life_membership_no.in_(life_nos)))
        return list(res.scalars().all())

    async def create(self, full_name: str, life_no: str, mobile: str, pin_hash: str) -> Member:
        m = Member(full_name=full_name, life_membership_no=life_no, mobile=mobile, pin_hash=pin_hash)
        self.session.add(m)
        await self.session.flush()
        return m

    async def life_no_exists(self, life_no: str) -> bool:
        return await self.get_by_life_no(life_no) is not None

    async def mobile_exists(self, mobile: str) -> bool:
        res = await self.session.execute(select(Member).where(Member.mobile == mobile))
        return res.scalar_one_or_none() is not None
