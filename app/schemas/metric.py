# backend/app/schemas/metric.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MetricCreate(BaseModel):
    title: str
    title_ar: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    department_id: Optional[int] = None
    points: int
    is_positive: bool = True
    is_repeatable: bool = True

class MetricUpdate(BaseModel):
    title: Optional[str] = None
    title_ar: Optional[str] = None
    description: Optional[str] = None
    points: Optional[int] = None
    is_positive: Optional[bool] = None
    is_repeatable: Optional[bool] = None
    is_active: Optional[bool] = None

class MetricResponse(BaseModel):
    id: int
    title: str
    title_ar: Optional[str]
    points: int
    is_positive: bool
    is_repeatable: bool
    is_active: bool
    category_id: Optional[int]
    department_id: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True