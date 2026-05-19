# backend/app/api/routes/teams.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List
from app.db.session import get_db
from app.models.team import Team, TeamMembership
from app.schemas.team import TeamCreate, TeamUpdate, TeamResponse, AddMemberRequest
from app.api.deps import get_current_user, require_leader_or_above
from app.models.user import User

router = APIRouter(prefix="/teams", tags=["Teams"])

@router.get("/", response_model=List[TeamResponse])
async def get_teams(db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)):
    """Get all teams sorted by points (ranking)."""
    result = await db.execute(
        select(Team, func.count(TeamMembership.id).label("member_count"))
        .outerjoin(TeamMembership, Team.id == TeamMembership.team_id)
        .where(Team.is_active == True)
        .group_by(Team.id)
        .order_by(Team.points.desc())
    )
    rows = result.all()

    teams = []
    for rank, (team, member_count) in enumerate(rows, 1):
        t = TeamResponse.model_validate(team)
        t.member_count = member_count
        t.rank = rank
        teams.append(t)

    return teams

@router.post("/", status_code=201)
async def create_team(
    data: TeamCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_leader_or_above),
):
    """Create a new team."""
    team = Team(**data.model_dump(), created_by=current_user.id)
    db.add(team)
    await db.commit()
    await db.refresh(team)
    return {"message": "تم إنشاء الفريق", "team_id": team.id}

@router.put("/{team_id}")
async def update_team(
    team_id: int,
    data: TeamUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_leader_or_above),
):
    """Update team information."""
    result = await db.execute(select(Team).where(Team.id == team_id))
    team = result.scalar_one_or_none()
    if not team:
        raise HTTPException(status_code=404, detail="الفريق غير موجود")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(team, field, value)

    await db.commit()
    return {"message": "تم تحديث الفريق"}

@router.delete("/{team_id}")
async def delete_team(
    team_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_leader_or_above),
):
    """Soft delete a team."""
    result = await db.execute(select(Team).where(Team.id == team_id))
    team = result.scalar_one_or_none()
    if not team:
        raise HTTPException(status_code=404, detail="الفريق غير موجود")

    team.is_active = False
    await db.commit()
    return {"message": "تم حذف الفريق"}

@router.post("/{team_id}/members")
async def add_member(
    team_id: int,
    data: AddMemberRequest,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_leader_or_above),
):
    """Add a member to a team."""
    membership = TeamMembership(
        team_id=team_id, user_id=data.user_id, role=data.role
    )
    db.add(membership)
    await db.commit()
    return {"message": "تم إضافة العضو"}