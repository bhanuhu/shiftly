from enum import StrEnum
from typing import TypeVar

EnumT = TypeVar("EnumT", bound=StrEnum)


def enum_values(enum_class: type[EnumT]) -> list[str]:
    return [member.value for member in enum_class]


class UserRole(StrEnum):
    DRIVER = "driver"
    CUSTOMER = "customer"
    ADMIN = "admin"


class VerificationStatus(StrEnum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    SUSPENDED = "suspended"


class BookingStatus(StrEnum):
    PENDING = "pending"
    SEARCHING_DRIVER = "searching_driver"
    DRIVER_ASSIGNED = "driver_assigned"
    DRIVER_ARRIVING = "driver_arriving"
    PICKED_UP = "picked_up"
    IN_TRANSIT = "in_transit"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


class BookingType(StrEnum):
    EXPRESS = "express"
    SHARED = "shared"


class PaymentStatus(StrEnum):
    PENDING = "pending"
    PAID = "paid"
    FAILED = "failed"
    REFUNDED = "refunded"


class PayoutStatus(StrEnum):
    PENDING = "pending"
    PROCESSING = "processing"
    PAID = "paid"
    FAILED = "failed"
