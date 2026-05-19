# backend/app/websocket/handlers.py
from app.websocket.manager import ws_manager
from datetime import datetime

async def broadcast_points_update(
    team_id: int,
    team_name: str,
    points_added: int,
    new_total: int,
    performed_by_name: str,
    reason: str = None,
):
    """Broadcast when a team's points change."""
    await ws_manager.broadcast_to_all({
        "type": "POINTS_UPDATE",
        "payload": {
            "team_id": team_id,
            "team_name": team_name,
            "points_added": points_added,
            "new_total": new_total,
            "performed_by": performed_by_name,
            "reason": reason,
            "timestamp": datetime.utcnow().isoformat(),
        }
    })

async def broadcast_ranking_update(rankings: list):
    """Broadcast updated rankings to all clients."""
    await ws_manager.broadcast_to_all({
        "type": "RANKING_UPDATE",
        "payload": {
            "rankings": rankings,
            "timestamp": datetime.utcnow().isoformat(),
        }
    })

async def broadcast_notification(title: str, message: str, notif_type: str, team_id: int = None):
    """Broadcast a notification."""
    await ws_manager.broadcast_to_all({
        "type": "NOTIFICATION",
        "payload": {
            "title": title,
            "message": message,
            "notif_type": notif_type,
            "team_id": team_id,
            "timestamp": datetime.utcnow().isoformat(),
        }
    })