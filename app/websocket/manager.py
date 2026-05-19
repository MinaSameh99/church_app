# backend/app/websocket/manager.py
from fastapi import WebSocket
from typing import Dict, List, Set
import json
import logging

logger = logging.getLogger(__name__)

class ConnectionManager:
    """
    Manages all active WebSocket connections.
    Supports broadcasting to all clients or specific rooms.
    """
    def __init__(self):
        # All active connections: {websocket: user_id}
        self.active_connections: Dict[WebSocket, int] = {}
        # Room connections: {room_name: set of websockets}
        self.rooms: Dict[str, Set[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, user_id: int, room: str = "global"):
        """Accept a new WebSocket connection."""
        await websocket.accept()
        self.active_connections[websocket] = user_id

        if room not in self.rooms:
            self.rooms[room] = set()
        self.rooms[room].add(websocket)

        logger.info(f"User {user_id} connected to room '{room}'. Total: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        """Remove a WebSocket connection."""
        user_id = self.active_connections.pop(websocket, None)

        for room_sockets in self.rooms.values():
            room_sockets.discard(websocket)

        logger.info(f"User {user_id} disconnected. Total: {len(self.active_connections)}")

    async def broadcast(self, message: dict, room: str = "global"):
        """Send a message to all clients in a room."""
        if room not in self.rooms:
            return

        dead_connections = []
        for websocket in self.rooms[room].copy():
            try:
                await websocket.send_json(message)
            except Exception:
                dead_connections.append(websocket)

        for ws in dead_connections:
            self.disconnect(ws)

    async def broadcast_to_all(self, message: dict):
        """Send a message to every connected client."""
        dead_connections = []
        for websocket in list(self.active_connections.keys()):
            try:
                await websocket.send_json(message)
            except Exception:
                dead_connections.append(websocket)

        for ws in dead_connections:
            self.disconnect(ws)

    async def send_personal(self, websocket: WebSocket, message: dict):
        """Send to one specific client."""
        try:
            await websocket.send_json(message)
        except Exception:
            self.disconnect(websocket)

    def get_connected_count(self) -> int:
        return len(self.active_connections)


# Global singleton instance — import this everywhere
ws_manager = ConnectionManager()