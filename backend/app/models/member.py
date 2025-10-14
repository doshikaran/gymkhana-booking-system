# app/models/member.py
from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
import datetime
from app.models.base import Base

class Member(Base):
    __tablename__ = "members"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    full_name = Column(String(100), nullable=False)
    life_membership_no = Column(String(4), unique=True, nullable=False, index=True)
    mobile = Column(String(15), unique=True, nullable=False)
    pin_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.datetime.now)

    # Relationships
    bookings_created = relationship("Booking", back_populates="created_by_member")
    booking_memberships = relationship("BookingMember", back_populates="member")
