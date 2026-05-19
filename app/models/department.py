from sqlalchemy import Column, Integer, String, Boolean, Enum, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.db.base import Base

class DepartmentType(str, enum.Enum):
    MANDATORY = "MANDATORY"
    OPTIONAL = "OPTIONAL"

class Department(Base):
    __tablename__ = "departments"

    id          = Column(Integer, primary_key=True, index=True)
    name        = Column(String(255), nullable=False)
    name_ar     = Column(String(255), nullable=True)
    type        = Column(Enum(DepartmentType), default=DepartmentType.OPTIONAL)
    icon        = Column(String(50), nullable=True)
    description = Column(Text, nullable=True)
    is_active   = Column(Boolean, default=True)
    created_at  = Column(DateTime, default=datetime.utcnow)

    metrics = relationship("Metric", back_populates="department")