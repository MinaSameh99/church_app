from sqlalchemy import Column, Integer, String, Boolean, Enum, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.db.base import Base

class NotificationType(str, enum.Enum):
    POINTS = "POINTS"
    PENALTY = "PENALTY"
    ACHIEVEMENT = "ACHIEVEMENT"
    SYSTEM = "SYSTEM"

class Notification(Base):
    __tablename__ = "notifications"

    id         = Column(Integer, primary_key=True, index=True)
    title      = Column(String(255), nullable=False)
    message    = Column(Text, nullable=False)
    type       = Column(Enum(NotificationType), default=NotificationType.SYSTEM)
    team_id    = Column(Integer, ForeignKey("teams.id"), nullable=True)
    is_read    = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    team = relationship("Team", back_populates="notifications")