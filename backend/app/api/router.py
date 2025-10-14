# app/api/router.py
from fastapi import APIRouter
from app.api.v1 import auth, bookings, courts, members, meta

api_router = APIRouter(prefix="/api")
v1 = APIRouter(prefix="/v1")

v1.include_router(auth.router, tags=["auth"])
v1.include_router(courts.router, tags=["courts"])
v1.include_router(bookings.router, tags=["bookings"])
v1.include_router(members.router, tags=["members"])
v1.include_router(meta.router, tags=["meta"])

api_router.include_router(v1)
