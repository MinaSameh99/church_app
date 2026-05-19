# backend/app/api/routes/metrics.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.db.session import get_db
from app.models.metric import Metric
from app.schemas.metric import MetricCreate, MetricUpdate, MetricResponse
from app.api.deps import get_current_user, require_leader_or_above
from app.models.user import User

router = APIRouter(prefix="/metrics", tags=["Metrics"])

@router.get("/", response_model=List[MetricResponse])
async def get_metrics(
    active_only: bool = True,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    """Get all metrics (point rules)."""
    query = select(Metric)
    if active_only:
        query = query.where(Metric.is_active == True)
    result = await db.execute(query.order_by(Metric.is_positive.desc(), Metric.points.desc()))
    return result.scalars().all()

@router.post("/", status_code=201)
async def create_metric(
    data: MetricCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_leader_or_above),
):
    """Create a new metric (dynamic point rule)."""
    metric = Metric(**data.model_dump(), created_by=current_user.id)
    db.add(metric)
    await db.commit()
    await db.refresh(metric)
    return {"message": "تم إنشاء المعيار", "metric_id": metric.id}

@router.put("/{metric_id}")
async def update_metric(
    metric_id: int,
    data: MetricUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_leader_or_above),
):
    """Update a metric."""
    result = await db.execute(select(Metric).where(Metric.id == metric_id))
    metric = result.scalar_one_or_none()
    if not metric:
        raise HTTPException(status_code=404, detail="المعيار غير موجود")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(metric, field, value)

    await db.commit()
    return {"message": "تم تحديث المعيار"}

@router.delete("/{metric_id}")
async def delete_metric(
    metric_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_leader_or_above),
):
    """Deactivate a metric."""
    result = await db.execute(select(Metric).where(Metric.id == metric_id))
    metric = result.scalar_one_or_none()
    if not metric:
        raise HTTPException(status_code=404, detail="المعيار غير موجود")
    metric.is_active = False
    await db.commit()
    return {"message": "تم تعطيل المعيار"}