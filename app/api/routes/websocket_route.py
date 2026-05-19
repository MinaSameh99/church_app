# backend/app/api/routes/websocket_route.py
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from app.websocket.manager import ws_manager
from app.core.security import verify_token
import logging

logger = logging.getLogger(__name__)
router = APIRouter(tags=["WebSocket"])

@router.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    token: str = Query(...),
    room: str = Query(default="global"),
):
    """
    WebSocket endpoint.
    Connect with: ws://localhost:8000/ws?token=YOUR_JWT&room=global
    """
    # Verify the JWT token
    payload = verify_token(token)
    if not payload:
        await websocket.close(code=4001, reason="توكن غير صالح")
        return

    user_id = int(payload.get("sub"))

    await ws_manager.connect(websocket, user_id, room)

    # Tell the client they're connected
    await ws_manager.send_personal(websocket, {
        "type": "CONNECTED",
        "payload": {
            "message": "تم الاتصال بنجاح",
            "user_id": user_id,
            "room": room,
            "connected_count": ws_manager.get_connected_count(),
        }
    })

    try:
        while True:
            # Keep connection alive and handle incoming messages
            data = await websocket.receive_json()

            # Handle ping/pong heartbeat
            if data.get("type") == "PING":
                await ws_manager.send_personal(websocket, {"type": "PONG"})

    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
        logger.info(f"User {user_id} disconnected from WebSocket")