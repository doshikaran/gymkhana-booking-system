# app/schemas/court_schema.py

from pydantic import BaseModel

class CourtBase(BaseModel):
    id: int
    name: str
    is_active: bool

    class Config:
        orm_mode = True
