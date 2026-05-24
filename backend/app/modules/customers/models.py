import uuid

from sqlalchemy import ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.shared.models import TimestampMixin, UUIDPrimaryKeyMixin


class Customer(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "customers"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, index=True)
    default_address: Mapped[str | None] = mapped_column(String(500))

    user: Mapped["User"] = relationship(back_populates="customer")  # noqa: F821
    bookings: Mapped[list["Booking"]] = relationship(back_populates="customer")  # noqa: F821
