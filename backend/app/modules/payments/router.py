from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.core.dependencies import get_current_user
from app.modules.payments.schemas import CreatePaymentOrderRequest, PaymentResponse, VerifyPaymentRequest
from app.modules.payments.service import PaymentService
from app.modules.users.models import User
from app.shared.schemas import ApiResponse

router = APIRouter(prefix="/payments", tags=["payments"])


@router.post("/create-order", response_model=ApiResponse[PaymentResponse])
async def create_order(payload: CreatePaymentOrderRequest, db: AsyncSession = Depends(get_db_session), _: User = Depends(get_current_user)):
    payment = await PaymentService(db).create_order(payload.booking_id, payload.method)
    return ApiResponse(message="Payment order created", data=PaymentResponse.model_validate(payment, from_attributes=True))


@router.post("/verify", response_model=ApiResponse[PaymentResponse])
async def verify_payment(payload: VerifyPaymentRequest, db: AsyncSession = Depends(get_db_session), _: User = Depends(get_current_user)):
    payment = await PaymentService(db).verify(payload.provider_order_id, payload.provider_payment_id)
    return ApiResponse(message="Payment verified", data=PaymentResponse.model_validate(payment, from_attributes=True))


@router.get("/history", response_model=ApiResponse[list[PaymentResponse]])
async def payment_history(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db_session)):
    payments = await PaymentService(db).history(user)
    return ApiResponse(message="Payment history fetched", data=[PaymentResponse.model_validate(p, from_attributes=True) for p in payments])
