# backend/app/api/routes/auth.py
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse, RefreshRequest
from app.services.auth_service import AuthService
from app.api.deps import get_current_user, require_admin
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest, db: AsyncSession = Depends(get_db)):
    """Login with email and password. Returns JWT tokens."""
    service = AuthService(db)
    return await service.login(data)

@router.post("/register", status_code=201)
async def register(
    data: RegisterRequest,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),  # Only admin can create accounts
):
    """Register a new servant account (admin only)."""
    service = AuthService(db)
    user = await service.register(data)
    return {"message": "تم إنشاء الحساب بنجاح", "user_id": user.id}

@router.post("/refresh", response_model=TokenResponse)
async def refresh(data: RefreshRequest, db: AsyncSession = Depends(get_db)):
    """Get new access token using refresh token."""
    service = AuthService(db)
    return await service.refresh_tokens(data.refresh_token)

@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current logged-in user info."""
    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "role": current_user.role.value,
    }