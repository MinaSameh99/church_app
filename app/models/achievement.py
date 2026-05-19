from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base

class Achievement(Base):
    __tablename__ = "achievements"

    id              = Column(Integer, primary_key=True, index=True)
    name            = Column(String(255), nullable=False)
    name_ar         = Column(String(255), nullable=True)
    description     = Column(Text, nullable=True)
    icon            = Column(String(50), nullable=True)
    points_reward   = Column(Integer, default=0)
    condition_type  = Column(String(100), nullable=True)
    condition_value = Column(Integer, nullable=True)
    created_at      = Column(DateTime, default=datetime.utcnow)

    team_achievements = relationship("TeamAchievement", back_populates="achievement")

class TeamAchievement(Base):
    __tablename__ = "team_achievements"

    id             = Column(Integer, primary_key=True, index=True)
    team_id        = Column(Integer, ForeignKey("teams.id", ondelete="CASCADE"), nullable=False)
    achievement_id = Column(Integer, ForeignKey("achievements.id", ondelete="CASCADE"), nullable=False)
    earned_at      = Column(DateTime, default=datetime.utcnow)

    team        = relationship("Team", back_populates="achievements")
    achievement = relationship("Achievement", back_populates="team_achievements")