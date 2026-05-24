import uuid
from decimal import Decimal

from pydantic import BaseModel


class CreatePaymentOrderRequest(BaseModel):
    booking_id: uuid.UUID
    method: str = "upi"


class VerifyPaymentRequest(BaseModel):
    provider_order_id: str
    provider_payment_id: str


class PaymentResponse(BaseModel):
    id: uuid.UUID
    booking_id: uuid.UUID
    amount: Decimal
    method: str
    payment_status: str
    provider_order_id: str | None
