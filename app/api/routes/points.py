# backend/app/api/routes/points.py
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.db.session import get_db
from app.schemas.point import AddPointsRequest, PointLogResponse
from app.services.point_service import PointService
from app.api.deps import get_current_user, require_servant_or_above
from app.models.user import User
from app.models.point_log import PointLog
from app.models.team import Team
from app.websocket.handlers import broadcast_points_update, broadcast_ranking_update

router = APIRouter(prefix="/points", tags=["Points"])

@router.post("/add")
async def add_points(
    data: AddPointsRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_servant_or_above),
):
    """Add or subtract points from a team. Triggers real-time broadcast."""
    service = PointService(db)
    log = await service.add_points(data, performed_by=current_user.id)

    # Get updated team info
    team_result = await db.execute(select(Team).where(Team.id == data.team_id))
    team = team_result.scalar_one()

    # Get all teams for updated rankings
    all_teams_result = await db.execute(
        select(Team).where(Team.is_active == True).order_by(Team.points.desc())
    )
    all_teams = all_teams_result.scalars().all()
    rankings = [
        {"rank": i+1, "team_id": t.id, "name": t.name, "points": t.points}
        for i, t in enumerate(all_teams)
    ]

    # 🔴 REAL-TIME: broadcast to all connected clients
    await broadcast_points_update(
        team_id=team.id,
        team_name=team.name,
        points_added=log.points,
        new_total=team.points,
        performed_by_name=current_user.full_name,
        reason=data.reason,
    )
    await broadcast_ranking_update(rankings)

    return {"message": f"تم إضافة {log.points} نقطة", "log_id": log.id}

@router.get("/logs", response_model=List[PointLogResponse])
async def get_point_logs(
    team_id: int = None,
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    """Get recent point activity log."""
    query = select(PointLog).order_by(PointLog.performed_at.desc()).limit(limit)
    if team_id:
        query = query.where(PointLog.team_id == team_id)

    result = await db.execute(query)
    return result.scalars().all()