from enum import StrEnum


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
