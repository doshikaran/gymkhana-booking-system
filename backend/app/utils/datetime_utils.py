# app/utils/datetime_utils.py
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

IST = ZoneInfo("Asia/Kolkata")

def now_ist() -> datetime:
    return datetime.now(IST)

def to_ist(dt: datetime) -> datetime:
    return dt.astimezone(IST) if dt.tzinfo else dt.replace(tzinfo=IST)

def is_today_or_tomorrow_ist(dt: datetime) -> bool:
    n = now_ist().date()
    d = to_ist(dt).date()
    return d == n or d == (n + timedelta(days=1))

def within_5_hours_if_today(start_dt: datetime) -> bool:
    start = to_ist(start_dt)
    now = now_ist()
    if start.date() != now.date():
        return True  # tomorrow allowed
    return (start - now) <= timedelta(hours=5)

def aligns_to_slot_grid(start_dt: datetime, end_dt: datetime, minutes: int = 60) -> bool:
    s, e = to_ist(start_dt), to_ist(end_dt)
    if (e - s).total_seconds() != minutes * 60:
        return False
    return s.minute % minutes == 0 and e.minute % minutes == 0 and s < e
