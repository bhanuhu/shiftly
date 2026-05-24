import uuid
from decimal import Decimal

from sqlalchemy import Enum, ForeignKey, Numeric, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.shared.enums import BookingStatus, BookingType
from app.shared.models import TimestampMixin, UUIDPrimaryKeyMixin


class Booking(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "bookings"

    customer_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("customers.id"), index=True)
    assigned_driver_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("drivers.id"), index=True)
    booking_type: Mapped[BookingType] = mapped_column(Enum(BookingType, name="booking_type"), default=BookingType.EXPRESS)
    status: Mapped[BookingStatus] = mapped_column(Enum(BookingStatus, name="booking_status"), default=BookingStatus.PENDING)
    pickup_address: Mapped[str] = mapped_column(Text)
    pickup_lat: Mapped[Decimal] = mapped_column(Numeric(9, 6))
    pickup_lng: Mapped[Decimal] = mapped_column(Numeric(9, 6))
    drop_address: Mapped[str] = mapped_column(Text)
    drop_lat: Mapped[Decimal] = mapped_column(Numeric(9, 6))
    drop_lng: Mapped[Decimal] = mapped_column(Numeric(9, 6))
    item_type: Mapped[str] = mapped_column(String(80))
    estimated_fare: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    final_fare: Mapped[Decimal | None] = mapped_column(Numeric(12, 2))
    commission: Mapped[Decimal | None] = mapped_column(Numeric(12, 2))

    customer: Mapped["Customer"] = relationship(back_populates="bookings")  # noqa: F821
