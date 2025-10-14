# app/models/court.py
from sqlalchemy import Column, ForeignKey, Integer, String, Boolean
from sqlalchemy.orm import relationship
from app.models.base import Base

class Court(Base):
    __tablename__ = "courts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    sport_id = Column(Integer, ForeignKey("sports.id"))
    is_active = Column(Boolean, default=True)

    sport = relationship("Sport", back_populates="courts")
    bookings = relationship("Booking", back_populates="court")
