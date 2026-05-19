# backend/app/services/point_service.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from fastapi import HTTPException, status
from app.models.team import Team
from app.models.metric import Metric
from app.models.point_log import PointLog
from app.schemas.point import AddPointsRequest
from app.services.audit_service import AuditService

class PointService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def add_points(self, data: AddPointsRequest, performed_by: int) -> PointLog:
        # Get the team
        team_result = await self.db.execute(select(Team).where(Team.id == data.team_id))
        team = team_result.scalar_one_or_none()
        if not team:
            raise HTTPException(status_code=404, detail="الفريق غير موجود")

        # Determine points amount
        points_amount = data.points

        if data.metric_id:
            metric_result = await self.db.execute(select(Metric).where(Metric.id == data.metric_id, Metric.is_active == True))
            metric = metric_result.scalar_one_or_none()
            if not metric:
                raise HTTPException(status_code=404, detail="المعيار غير موجود أو غير نشط")
            if points_amount is None:
                points_amount = metric.points if metric.is_positive else -metric.points

        if points_amount is None:
            raise HTTPException(status_code=400, detail="يجب تحديد عدد النقاط")

        old_points = team.points

        # Update team points (never go below 0)
        new_points = max(0, team.points + points_amount)
        new_coins  = max(0, team.coins + max(0, points_amount // 10))

        await self.db.execute(
            update(Team).where(Team.id == data.team_id).values(
                points=new_points, coins=new_coins
            )
        )

        # Create log entry
        log = PointLog(
            team_id=data.team_id,
            metric_id=data.metric_id,
            points=points_amount,
            reason=data.reason,
            performed_by=performed_by,
            week_number=data.week_number,
            season=data.season,
        )
        self.db.add(log)
        await self.db.commit()
        await self.db.refresh(log)

        # Write audit log
        audit = AuditService(self.db)
        await audit.log(
            user_id=performed_by,
            action="ADD_POINTS",
            entity_type="team",
            entity_id=data.team_id,
            previous_value={"points": old_points},
            new_value={"points": new_points, "added": points_amount},
        )

        return log