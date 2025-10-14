# app/schemas/booking_schema.py

from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional
from app.models.booking import BookingStatus

class BookingMemberSchema(BaseModel):
    member_id: str
    role: str

class BookingBase(BaseModel):
    court_id: int
    start_time: datetime
    end_time: datetime
    duration: int
    sport: str
    member_nos: List[str] = Field(..., min_items=1, max_items=7)

class BookingCreate(BookingBase):
    pass

class BookingResponse(BaseModel):
    id: str
    court_id: int
    start_time: datetime
    created_by_life_no: str                   
    other_member_life_nos: list[str]     
    end_time: datetime
    duration: int
    sport: Optional[str] = None
    status: BookingStatus
    members: List[BookingMemberSchema]

    class Config:
        orm_mode = True
