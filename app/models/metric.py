# backend/app/models/metric.py
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base

class MetricCategory(Base):
    __tablename__ = "metric_categories"

    id       = Column(Integer, primary_key=True, index=True)
    name     = Column(String(255), nullable=False)
    name_ar  = Column(String(255), nullable=True)
    color    = Column(String(7), default="#f5b800")
    created_at = Column(DateTime, default=datetime.utcnow)

    metrics = relationship("Metric", back_populates="category")

class Metric(Base):
    __tablename__ = "metrics"

    id            = Column(Integer, primary_key=True, index=True)
    title         = Column(String(255), nullable=False)
    title_ar      = Column(String(255), nullable=True)
    description   = Column(Text, nullable=True)
    category_id   = Column(Integer, ForeignKey("metric_categories.id"), nullable=True)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    points        = Column(Integer, nullable=False)
    is_positive   = Column(Boolean, default=True)
    is_repeatable = Column(Boolean, default=True)
    is_active     = Column(Boolean, default=True)
    created_by    = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at    = Column(DateTime, default=datetime.utcnow)
    updated_at    = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    category   = relationship("MetricCategory", back_populates="metrics")
    department = relationship("Department", back_populates="metrics")
    point_logs = relationship("PointLog", back_populates="metric")