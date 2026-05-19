# backend/app/schemas/team.py
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class TeamCreate(BaseModel):
    name: str
    name_ar: Optional[str] = None
    emoji: Optional[str] = "⚡"
    color: Optional[str] = "#f5b800"
    slogan: Optional[str] = None
    bible_verse: Optional[str] = None

class TeamUpdate(BaseModel):
    name: Optional[str] = None
    name_ar: Optional[str] = None
    emoji: Optional[str] = None
    color: Optional[str] = None
    slogan: Optional[str] = None
    bible_verse: Optional[str] = None
    leader_id: Optional[int] = None

class TeamResponse(BaseModel):
    id: int
    name: str
    name_ar: Optional[str]
    emoji: Optional[str]
    color: str
    slogan: Optional[str]
    bible_verse: Optional[str]
    points: int
    coins: int
    leader_id: Optional[int]
    is_active: bool
    created_at: datetime
    member_count: Optional[int] = 0
    rank: Optional[int] = None

    class Config:
        from_attributes = True

class AddMemberRequest(BaseModel):
    user_id: int
    role: str = "MEMBER"