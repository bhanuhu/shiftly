import uuid
from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, Field

from app.shared.enums import VerificationStatus
from app.shared.schemas import ORMModel


class DriverRegisterRequest(BaseModel):
    full_name: str | None = Field(default=None, max_length=120)
    vehicle_type: str = Field(max_length=50)
    vehicle_number: str = Field(max_length=30)
    aadhaar_url: str | None = None
    license_url: str | None = None
    profile_photo: str | None = None


class DriverResponse(ORMModel):
    id: uuid.UUID
    user_id: uuid.UUID
    vehicle_type: str
    vehicle_number: str
    verification_status: VerificationStatus
    online_status: bool
    current_lat: Decimal | None
    current_lng: Decimal | None
    rating: Decimal
    total_trips: int
    created_at: datetime


class DriverStatusRequest(BaseModel):
    online_status: bool


class DriverLocationRequest(BaseModel):
    lat: Decimal = Field(ge=-90, le=90)
    lng: Decimal = Field(ge=-180, le=180)
    booking_id: uuid.UUID | None = None
