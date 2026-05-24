from fastapi import APIRouter, Depends
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.core.dependencies import require_roles
from app.core.redis import get_redis
from app.modules.drivers.schemas import DriverLocationRequest, DriverRegisterRequest, DriverResponse, DriverStatusRequest
from app.modules.drivers.service import DriverService
from app.modules.users.models import User
from app.shared.enums import UserRole
from app.shared.schemas import ApiResponse

router = APIRouter(prefix="/drivers", tags=["drivers"])


@router.post("/register", response_model=ApiResponse[DriverResponse])
async def register_driver(
    payload: DriverRegisterRequest,
    user: User = Depends(require_roles(UserRole.DRIVER)),
    db: AsyncSession = Depends(get_db_session),
    redis: Redis = Depends(get_redis),
):
    driver = await DriverService(db, redis).register(user, payload)
    return ApiResponse(message="Driver registered", data=DriverResponse.model_validate(driver))


@router.get("/me", response_model=ApiResponse[DriverResponse])
async def get_driver_me(
    user: User = Depends(require_roles(UserRole.DRIVER)), db: AsyncSession = Depends(get_db_session), redis: Redis = Depends(get_redis)
):
    driver = await DriverService(db, redis).get_me(user)
    return ApiResponse(message="Driver profile fetched", data=DriverResponse.model_validate(driver))


@router.patch("/status", response_model=ApiResponse[DriverResponse])
async def update_driver_status(
    payload: DriverStatusRequest,
    user: User = Depends(require_roles(UserRole.DRIVER)),
    db: AsyncSession = Depends(get_db_session),
    redis: Redis = Depends(get_redis),
):
    driver = await DriverService(db, redis).set_status(user, payload.online_status)
    return ApiResponse(message="Driver status updated", data=DriverResponse.model_validate(driver))


@router.patch("/location", response_model=ApiResponse[DriverResponse])
async def update_driver_location(
    payload: DriverLocationRequest,
    user: User = Depends(require_roles(UserRole.DRIVER)),
    db: AsyncSession = Depends(get_db_session),
    redis: Redis = Depends(get_redis),
):
    driver = await DriverService(db, redis).update_location(user, payload.lat, payload.lng, payload.booking_id)
    return ApiResponse(message="Driver location updated", data=DriverResponse.model_validate(driver))


@router.get("/earnings", response_model=ApiResponse[list[dict]])
async def get_earnings(
    user: User = Depends(require_roles(UserRole.DRIVER)), db: AsyncSession = Depends(get_db_session), redis: Redis = Depends(get_redis)
):
    earnings = await DriverService(db, redis).list_earnings(user)
    return ApiResponse(
        message="Driver earnings fetched",
        data=[{"id": str(e.id), "amount": str(e.amount), "payout_status": e.payout_status} for e in earnings],
    )


@router.get("/trips/history", response_model=ApiResponse[list[dict]])
async def trip_history():
    return ApiResponse(message="Trip history fetched", data=[])
