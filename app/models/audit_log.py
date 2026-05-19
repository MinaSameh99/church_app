# backend/app/models/audit_log.py
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id             = Column(Integer, primary_key=True, index=True)
    user_id        = Column(Integer, ForeignKey("users.id"), nullable=True)
    action         = Column(String(255), nullable=False)
    entity_type    = Column(String(100), nullable=True)
    entity_id      = Column(Integer, nullable=True)
    previous_value = Column(JSON, nullable=True)
    new_value      = Column(JSON, nullable=True)
    ip_address     = Column(String(45), nullable=True)
    created_at     = Column(DateTime, default=datetime.utcnow, index=True)

    user = relationship("User", back_populates="audit_logs")