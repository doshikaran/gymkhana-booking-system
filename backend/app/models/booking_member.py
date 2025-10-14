# app/models/booking_member.py
from sqlalchemy import Column, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import enum
from app.models.base import Base

class MemberRole(str, enum.Enum):
    PRIMARY = "PRIMARY"
    SECONDARY = "SECONDARY"

class BookingMember(Base):
    __tablename__ = "booking_members"

    booking_id = Column(UUID(as_uuid=True), ForeignKey("bookings.id", ondelete="CASCADE"), primary_key=True)
    member_id = Column(UUID(as_uuid=True), ForeignKey("members.id", ondelete="CASCADE"), primary_key=True)
    role = Column(Enum(MemberRole), nullable=False, default=MemberRole.SECONDARY)

    booking = relationship("Booking", back_populates="members")
    member = relationship("Member", back_populates="booking_memberships")
