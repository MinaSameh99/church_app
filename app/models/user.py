# backend/app/models/user.py
from sqlalchemy import Column, Integer, String, Boolean, Enum, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.db.base import Base

class UserRole(str, enum.Enum):
    SUPER_ADMIN = "SUPER_ADMIN"
    LEADER = "LEADER"
    SERVANT = "SERVANT"
    VIEWER = "VIEWER"

class User(Base):
    __tablename__ = "users"

    id              = Column(Integer, primary_key=True, index=True)
    email           = Column(String(255), unique=True, nullable=False, index=True)
    full_name       = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role            = Column(Enum(UserRole), default=UserRole.SERVANT)
    is_active       = Column(Boolean, default=True)
    avatar_url      = Column(String(500), nullable=True)
    created_at      = Column(DateTime, default=datetime.utcnow)
    updated_at      = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    point_logs  = relationship("PointLog", back_populates="performer", foreign_keys="PointLog.performed_by")
    memberships = relationship("TeamMembership", back_populates="user")
    audit_logs  = relationship("AuditLog", back_populates="user")