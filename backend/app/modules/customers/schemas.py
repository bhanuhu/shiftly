import uuid
from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, Field

from app.shared.enums import BookingStatus, BookingType
from app.shared.schemas import ORMModel


class CustomerResponse(ORMModel):
    id: uuid.UUID
    user_id: uuid.UUID
    default_address: str | None


class BookingCreateRequest(BaseModel):
    booking_type: BookingType = BookingType.EXPRESS
    pickup_address: str = Field(min_length=3)
    pickup_lat: Decimal = Field(ge=-90, le=90)
    pickup_lng: Decimal = Field(ge=-180, le=180)
    drop_address: str = Field(min_length=3)
    drop_lat: Decimal = Field(ge=-90, le=90)
    drop_lng: Decimal = Field(ge=-180, le=180)
    item_type: str = Field(max_length=80)


class BookingResponse(ORMModel):
    id: uuid.UUID
    customer_id: uuid.UUID
    assigned_driver_id: uuid.UUID | None
    booking_type: BookingType
    status: BookingStatus
    pickup_address: str
    pickup_lat: Decimal
    pickup_lng: Decimal
    drop_address: str
    drop_lat: Decimal
    drop_lng: Decimal
    item_type: str
    estimated_fare: Decimal
    final_fare: Decimal | None
    commission: Decimal | None
    created_at: datetime
