# app/services/auth_service.py
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.member_repo import MemberRepository
from app.core.security import hash_pin, verify_pin, create_access_token
from app.utils.exceptions import bad_request, unauthorized

class AuthService:
    def __init__(self, session: AsyncSession):
        self.members = MemberRepository(session)
        self.session = session

    async def register(self, full_name: str, life_no: str, mobile: str, pin: str):
        if await self.members.life_no_exists(life_no):
            bad_request("LIFE_NO_TAKEN", "Life membership number already registered")
        if await self.members.mobile_exists(mobile):
            bad_request("MOBILE_TAKEN", "Mobile already registered")
        m = await self.members.create(full_name, life_no, mobile, hash_pin(pin))
        await self.session.commit()
        return m

    async def login(self, life_no: str, pin: str):
        m = await self.members.get_by_life_no(life_no)
        if not m or not verify_pin(pin, m.pin_hash):
            unauthorized("Invalid credentials")
        token = create_access_token(str(m.id))
        return token, m
