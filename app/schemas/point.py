# backend/app/schemas/point.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AddPointsRequest(BaseModel):
    team_id: int
    metric_id: Optional[int] = None
    points: Optional[int] = None   # override metric points if needed
    reason: Optional[str] = None
    week_number: Optional[int] = None
    season: Optional[str] = None

class PointLogResponse(BaseModel):
    id: int
    team_id: int
    metric_id: Optional[int]
    points: int
    reason: Optional[str]
    performed_by: int
    performed_at: datetime
    week_number: Optional[int]
    season: Optional[str]
    team_name: Optional[str] = None
    performer_name: Optional[str] = None
    metric_title: Optional[str] = None

    class Config:
        from_attributes = True