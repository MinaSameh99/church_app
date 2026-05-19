# backend/app/models/point_log.py
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base

class PointLog(Base):
    __tablename__ = "point_logs"

    id           = Column(Integer, primary_key=True, index=True)
    team_id      = Column(Integer, ForeignKey("teams.id", ondelete="CASCADE"), nullable=False)
    metric_id    = Column(Integer, ForeignKey("metrics.id"), nullable=True)
    points       = Column(Integer, nullable=False)
    reason       = Column(String(500), nullable=True)
    performed_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    performed_at = Column(DateTime, default=datetime.utcnow, index=True)
    week_number  = Column(Integer, nullable=True)
    season       = Column(String(50), nullable=True)

    team      = relationship("Team", back_populates="point_logs")
    metric    = relationship("Metric", back_populates="point_logs")
    performer = relationship("User", back_populates="point_logs", foreign_keys=[performed_by])