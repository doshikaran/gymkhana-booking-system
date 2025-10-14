# app/api/v1/members.py
from fastapi import APIRouter, Depends
from app.api.deps import SessionDep, get_current_member
from app.schemas.member_schema import MemberResponse

router = APIRouter()

@router.get("/me", response_model=MemberResponse)
async def me(current=Depends(get_current_member)):
    return MemberResponse(id=str(current.id), full_name=current.full_name, life_membership_no=current.life_membership_no, mobile=current.mobile)
