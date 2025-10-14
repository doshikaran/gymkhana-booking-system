# app/schemas/auth_schema.py

from pydantic import BaseModel, Field

class LoginRequest(BaseModel):
    life_membership_no: str = Field(..., min_length=4, max_length=4)
    pin: str = Field(..., min_length=6, max_length=6)

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
