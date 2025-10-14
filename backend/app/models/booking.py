# app/models/booking.py
from sqlalchemy import Column, Integer, DateTime, ForeignKey, Enum, String, ARRAY
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
import enum
import datetime
from app.models.base import Base

class BookingStatus(str, enum.Enum):
    UPCOMING = "UPCOMING"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    court_id = Column(Integer, ForeignKey("courts.id", ondelete="CASCADE"), nullable=False)
    created_by_member_id = Column(UUID(as_uuid=True), ForeignKey("members.id", ondelete="CASCADE"), nullable=False)
    sport_id = Column(Integer, ForeignKey("sports.id")) 
    created_by_life_no = Column(String(4), nullable=False)  
    other_member_life_nos = Column(ARRAY(String(4)), nullable=False, default=[]) 
    start_time = Column(DateTime(timezone=True), nullable=False, index=True)
    end_time = Column(DateTime(timezone=True), nullable=False)
    duration = Column(Integer)
    status = Column(Enum(BookingStatus), nullable=False, default=BookingStatus.UPCOMING)
    created_at = Column(DateTime(timezone=True), default=datetime.datetime.now)

    # Relationships
    court = relationship("Court", back_populates="bookings")
    created_by_member = relationship("Member", back_populates="bookings_created")
    members = relationship("BookingMember", back_populates="booking", cascade="all, delete-orphan",  lazy="selectin")
    sport = relationship("Sport", lazy="selectin")
