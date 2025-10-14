# app/api/v1/auth.py
from fastapi import APIRouter, Depends
from app.api.deps import SessionDep
from app.services.auth_service import AuthService
from app.schemas.member_schema import MemberResponse, MemberCreate
from app.schemas.auth_schema import LoginRequest, TokenResponse

router = APIRouter()

@router.post("/auth/register", response_model=MemberResponse)
async def register(payload: MemberCreate, session: SessionDep):
    svc = AuthService(session)
    m = await svc.register(payload.full_name, payload.life_membership_no, payload.mobile, payload.pin)
    return MemberResponse(id=str(m.id), full_name=m.full_name, life_membership_no=m.life_membership_no, mobile=m.mobile)

@router.post("/auth/login", response_model=TokenResponse)
async def login(payload: LoginRequest, session: SessionDep):
    svc = AuthService(session)
    token, m = await svc.login(payload.life_membership_no, payload.pin)
    return TokenResponse(access_token=token)
