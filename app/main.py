# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.db.session import engine
from app.db.base import Base

# Import all routers
from app.api.routes import auth, teams, points, metrics
from app.api.routes.websocket_route import router as ws_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Run on startup and shutdown."""
    # Create tables if they don't exist (Alembic handles migrations in production)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("✅ Database tables ready")
    yield
    await engine.dispose()
    print("🔴 Database connection closed")

app = FastAPI(
    title=settings.APP_NAME,
    description="منصة إدارة مسابقات الكنيسة",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — allows your React frontend to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routes
app.include_router(auth.router,    prefix="/api/v1")
app.include_router(teams.router,   prefix="/api/v1")
app.include_router(points.router,  prefix="/api/v1")
app.include_router(metrics.router, prefix="/api/v1")
app.include_router(ws_router)  # WebSocket at /ws

@app.get("/")
async def root():
    return {"message": "🏆 Church Competition API is running!", "version": "1.0.0"}

@app.get("/health")
async def health():
    return {"status": "ok"}