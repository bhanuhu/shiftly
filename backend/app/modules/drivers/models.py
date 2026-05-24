import uuid
from datetime import datetime
from decimal import Decimal

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, Integer, Numeric, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.shared.enums import PayoutStatus, VerificationStatus
from app.shared.models import TimestampMixin, UUIDPrimaryKeyMixin


class Driver(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "drivers"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, index=True)
    vehicle_type: Mapped[str] = mapped_column(String(50))
    vehicle_number: Mapped[str] = mapped_column(String(30), unique=True)
    aadhaar_url: Mapped[str | None] = mapped_column(String(500))
    license_url: Mapped[str | None] = mapped_column(String(500))
    profile_photo: Mapped[str | None] = mapped_column(String(500))
    verification_status: Mapped[VerificationStatus] = mapped_column(
        Enum(VerificationStatus, name="verification_status"), default=VerificationStatus.PENDING
    )
    online_status: Mapped[bool] = mapped_column(Boolean, default=False)
    current_lat: Mapped[Decimal | None] = mapped_column(Numeric(9, 6))
    current_lng: Mapped[Decimal | None] = mapped_column(Numeric(9, 6))
    rating: Mapped[Decimal] = mapped_column(Numeric(3, 2), default=5)
    total_trips: Mapped[int] = mapped_column(Integer, default=0)

    user: Mapped["User"] = relationship(back_populates="driver")  # noqa: F821
    earnings: Mapped[list["DriverEarning"]] = relationship(back_populates="driver")


class DriverLocationHistory(Base, UUIDPrimaryKeyMixin):
    __tablename__ = "driver_location_history"

    driver_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("drivers.id"), index=True)
    booking_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("bookings.id"), index=True)
    lat: Mapped[Decimal] = mapped_column(Numeric(9, 6))
    lng: Mapped[Decimal] = mapped_column(Numeric(9, 6))
    recorded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)


class DriverEarning(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "driver_earnings"

    driver_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("drivers.id"), index=True)
    booking_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("bookings.id"), index=True)
    amount: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    payout_status: Mapped[PayoutStatus] = mapped_column(Enum(PayoutStatus, name="payout_status"), default=PayoutStatus.PENDING)

    driver: Mapped[Driver] = relationship(back_populates="earnings")
