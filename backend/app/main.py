# app/main.py (add the highlighted lines)
from fastapi import FastAPI
from sqlalchemy import select
from fastapi.middleware.cors import CORSMiddleware
from app.core.db import init_db
from app.api.router import api_router
from app.models.court import Court 

app = FastAPI(title="Badminton Court Booking System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:3000"] if you want to restrict
    allow_credentials=True,
    allow_methods=["*"],  # allows OPTIONS, GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],  # allows all custom headers
)

@app.on_event("startup")
async def on_startup():
    await init_db()


@app.get("/")
async def root():
    return {"message": "Welcome to the Badminton Court Booking API!"}

app.include_router(api_router)  
