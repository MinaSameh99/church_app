# backend/app/models/team.py
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.db.base import Base

class MemberRole(str, enum.Enum):
    CAPTAIN = "CAPTAIN"
    VICE_CAPTAIN = "VICE_CAPTAIN"
    MEMBER = "MEMBER"

class Team(Base):
    __tablename__ = "teams"

    id          = Column(Integer, primary_key=True, index=True)
    name        = Column(String(255), nullable=False)
    name_ar     = Column(String(255), nullable=True)
    emoji       = Column(String(10), nullable=True)
    color       = Column(String(7), default="#f5b800")
    slogan      = Column(String(500), nullable=True)
    bible_verse = Column(String(500), nullable=True)
    points      = Column(Integer, default=0, index=True)
    coins       = Column(Integer, default=0)
    leader_id   = Column(Integer, ForeignKey("users.id"), nullable=True)
    is_active   = Column(Boolean, default=True)
    created_by  = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at  = Column(DateTime, default=datetime.utcnow)
    updated_at  = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    memberships  = relationship("TeamMembership", back_populates="team", cascade="all, delete-orphan")
    point_logs   = relationship("PointLog", back_populates="team")
    achievements = relationship("TeamAchievement", back_populates="team")
    notifications= relationship("Notification", back_populates="team")

class TeamMembership(Base):
    __tablename__ = "team_memberships"

    id        = Column(Integer, primary_key=True, index=True)
    team_id   = Column(Integer, ForeignKey("teams.id", ondelete="CASCADE"), nullable=False)
    user_id   = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    role      = Column(Enum(MemberRole), default=MemberRole.MEMBER)
    joined_at = Column(DateTime, default=datetime.utcnow)

    team = relationship("Team", back_populates="memberships")
    user = relationship("User", back_populates="memberships")