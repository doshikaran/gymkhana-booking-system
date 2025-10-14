# app/api/deps.py
from typing import Annotated
from fastapi import Depends, Header
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.db import get_session
from app.core.security import decode_token
from app.utils.exceptions import unauthorized
from app.repositories.member_repo import MemberRepository

SessionDep = Annotated[AsyncSession, Depends(get_session)]

async def get_current_member(session: SessionDep, authorization: str = Header(None)):
    if not authorization or not authorization.lower().startswith("bearer "):
        unauthorized("Missing bearer token")
    token = authorization.split(" ", 1)[1]
    payload = decode_token(token)
    if not payload or "sub" not in payload:
        unauthorized("Invalid token")
    member = await MemberRepository(session).get_by_id(payload["sub"])
    if not member:
        unauthorized("Member not found")
    return member
