from fastapi import APIRouter, Depends
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.core.redis import get_redis
from app.modules.auth.schemas import AdminLoginRequest, RefreshTokenRequest, SendOtpRequest, TokenPair, VerifyOtpRequest
from app.modules.auth.service import AuthService
from app.shared.schemas import ApiResponse

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/send-otp", response_model=ApiResponse[dict])
async def send_otp(payload: SendOtpRequest, db: AsyncSession = Depends(get_db_session), redis: Redis = Depends(get_redis)):
    otp = await AuthService(db, redis).send_otp(payload.phone)
    data = {"dev_otp": otp}
    return ApiResponse(message="OTP sent", data=data)


@router.post("/verify-otp", response_model=ApiResponse[TokenPair])
async def verify_otp(payload: VerifyOtpRequest, db: AsyncSession = Depends(get_db_session), redis: Redis = Depends(get_redis)):
    tokens = await AuthService(db, redis).verify_otp(payload.phone, payload.otp, payload.role, payload.name)
    return ApiResponse(message="Login successful", data=tokens)


@router.post("/admin-login", response_model=ApiResponse[TokenPair])
async def admin_login(
    payload: AdminLoginRequest, db: AsyncSession = Depends(get_db_session), redis: Redis = Depends(get_redis)
):
    tokens = await AuthService(db, redis).admin_login(payload.phone_or_email, payload.password)
    return ApiResponse(message="Admin login successful", data=tokens)


@router.post("/refresh-token", response_model=ApiResponse[TokenPair])
async def refresh_token(payload: RefreshTokenRequest, db: AsyncSession = Depends(get_db_session), redis: Redis = Depends(get_redis)):
    tokens = await AuthService(db, redis).refresh(payload.refresh_token)
    return ApiResponse(message="Token refreshed", data=tokens)


@router.post("/logout", response_model=ApiResponse[dict])
async def logout(payload: RefreshTokenRequest, db: AsyncSession = Depends(get_db_session), redis: Redis = Depends(get_redis)):
    await AuthService(db, redis).logout(payload.refresh_token)
    return ApiResponse(message="Logged out", data={})
