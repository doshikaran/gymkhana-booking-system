# app/api/v1/meta.py
from fastapi import APIRouter
router = APIRouter()

@router.get("/club/info")
async def club_info():
    # placeholder; later move to DB or CMS
    return {
        "hours": {"open": "06:00", "close": "22:00", "tz": "Asia/Kolkata"},
        "faqs": [
            {"q": "How far in advance can I book?", "a": "Today within 5 hours, or any slot tomorrow."},
            {"q": "How many players per booking?", "a": "Exactly 4 members (you + 3)."},
        ],
        "gallery": [],
    }
