# app/utils/exceptions.py
from fastapi import HTTPException, status

def bad_request(code: str, detail: str):
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"code": code, "message": detail})

def unauthorized(detail: str = "Unauthorized"):
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail={"code": "UNAUTHORIZED", "message": detail})

def conflict(code: str, detail: str):
    raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={"code": code, "message": detail})

def not_found(code: str, detail: str):
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"code": code, "message": detail})
