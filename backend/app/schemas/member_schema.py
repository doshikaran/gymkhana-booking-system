# app/schemas/member_schema.py
from pydantic import BaseModel, Field

class MemberBase(BaseModel):
    full_name: str
    life_membership_no: str = Field(..., min_length=4, max_length=4)
    mobile: str

class MemberCreate(MemberBase):
    pin: str = Field(..., min_length=6, max_length=6)

class MemberResponse(MemberBase):
    id: str

    class Config:
        orm_mode = True
