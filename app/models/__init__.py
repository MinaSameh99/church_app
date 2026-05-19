# backend/app/models/__init__.py
# Import all models so Alembic can detect them
from app.models.user import User, UserRole
from app.models.team import Team, TeamMembership, MemberRole
from app.models.metric import Metric, MetricCategory
from app.models.point_log import PointLog
from app.models.audit_log import AuditLog
from app.models.department import Department
from app.models.notification import Notification
from app.models.achievement import Achievement, TeamAchievement
from app.models.competition import Competition