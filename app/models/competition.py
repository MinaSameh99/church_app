from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from datetime import datetime
from app.db.base import Base

class Competition(Base):
    __tablename__ = "competitions"

    id          = Column(Integer, primary_key=True, index=True)
    name        = Column(String(255), nullable=False)
    name_ar     = Column(String(255), nullable=True)
    season      = Column(String(50), nullable=True)
    week_number = Column(Integer, default=1)
    total_weeks = Column(Integer, default=8)
    is_active   = Column(Boolean, default=True)
    started_at  = Column(DateTime, nullable=True)
    ends_at     = Column(DateTime, nullable=True)
    created_by  = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at  = Column(DateTime, default=datetime.utcnow)