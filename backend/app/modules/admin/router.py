import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.core.dependencies import require_roles
from app.modules.admin.service import AdminService
from app.modules.users.models import User
from app.shared.enums import UserRole, VerificationStatus
from app.shared.schemas import ApiResponse

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/dashboard", response_model=ApiResponse[dict])
async def dashboard(_: User = Depends(require_roles(UserRole.ADMIN)), db: AsyncSession = Depends(get_db_session)):
    return ApiResponse(message="Dashboard fetched", data=await AdminService(db).dashboard())


@router.get("/drivers", response_model=ApiResponse[list[dict]])
async def drivers(_: User = Depends(require_roles(UserRole.ADMIN)), db: AsyncSession = Depends(get_db_session)):
    rows = await AdminService(db).list_drivers_for_admin()
    return ApiResponse(message="Drivers fetched", data=rows)


@router.patch("/drivers/{driver_id}/approve", response_model=ApiResponse[dict])
async def approve_driver(
    driver_id: uuid.UUID, _: User = Depends(require_roles(UserRole.ADMIN)), db: AsyncSession = Depends(get_db_session)
):
    await AdminService(db).set_driver_verification(driver_id, VerificationStatus.APPROVED)
    return ApiResponse(message="Driver approved", data={"id": str(driver_id), "verificationStatus": "approved"})


@router.patch("/drivers/{driver_id}/reject", response_model=ApiResponse[dict])
async def reject_driver(driver_id: uuid.UUID, _: User = Depends(require_roles(UserRole.ADMIN)), db: AsyncSession = Depends(get_db_session)):
    await AdminService(db).set_driver_verification(driver_id, VerificationStatus.REJECTED)
    return ApiResponse(message="Driver rejected", data={"id": str(driver_id), "verificationStatus": "rejected"})


@router.patch("/drivers/{driver_id}/suspend", response_model=ApiResponse[dict])
async def suspend_driver(
    driver_id: uuid.UUID, _: User = Depends(require_roles(UserRole.ADMIN)), db: AsyncSession = Depends(get_db_session)
):
    await AdminService(db).set_driver_verification(driver_id, VerificationStatus.SUSPENDED)
    return ApiResponse(message="Driver suspended", data={"id": str(driver_id), "verificationStatus": "suspended"})


@router.get("/bookings", response_model=ApiResponse[list[dict]])
async def bookings(_: User = Depends(require_roles(UserRole.ADMIN)), db: AsyncSession = Depends(get_db_session)):
    rows = await AdminService(db).list_bookings_for_admin()
    return ApiResponse(message="Bookings fetched", data=rows)


@router.patch("/bookings/{booking_id}/assign-driver", response_model=ApiResponse[dict])
async def assign_driver(
    booking_id: uuid.UUID,
    driver_id: uuid.UUID,
    _: User = Depends(require_roles(UserRole.ADMIN)),
    db: AsyncSession = Depends(get_db_session),
):
    await AdminService(db).assign_driver(booking_id, driver_id)
    return ApiResponse(message="Driver assigned", data={"id": str(booking_id), "assignedDriverId": str(driver_id)})


@router.patch("/bookings/{booking_id}/cancel", response_model=ApiResponse[dict])
async def cancel_booking(
    booking_id: uuid.UUID, _: User = Depends(require_roles(UserRole.ADMIN)), db: AsyncSession = Depends(get_db_session)
):
    await AdminService(db).cancel_booking(booking_id)
    return ApiResponse(message="Booking cancelled", data={"id": str(booking_id), "status": "cancelled"})


@router.get("/payments", response_model=ApiResponse[list[dict]])
async def payments(_: User = Depends(require_roles(UserRole.ADMIN)), db: AsyncSession = Depends(get_db_session)):
    rows = await AdminService(db).list_payments_for_admin()
    return ApiResponse(message="Payments fetched", data=rows)


@router.get("/analytics", response_model=ApiResponse[dict])
async def analytics(_: User = Depends(require_roles(UserRole.ADMIN)), db: AsyncSession = Depends(get_db_session)):
    return ApiResponse(message="Analytics fetched", data=await AdminService(db).analytics())
