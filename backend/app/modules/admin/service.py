import uuid
from datetime import UTC, datetime
from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.exceptions import AppException
from app.modules.bookings.models import Booking
from app.modules.bookings.repository import BookingRepository
from app.modules.customers.models import Customer
from app.modules.drivers.models import Driver
from app.modules.drivers.repository import DriverRepository
from app.modules.payments.models import Payment
from app.modules.payments.repository import PaymentRepository
from app.modules.users.repository import UserRepository
from app.shared.enums import BookingStatus, PaymentStatus, VerificationStatus


class AdminService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.users = UserRepository(session)
        self.drivers = DriverRepository(session)
        self.bookings = BookingRepository(session)
        self.payments = PaymentRepository(session)

    async def dashboard(self) -> dict:
        users = await self.users.list()
        drivers = await self.drivers.list()
        bookings = await self.bookings.list()
        payments = await self.payments.list()
        today = datetime.now(UTC).date()
        bookings_today = [booking for booking in bookings if booking.created_at.date() == today]
        delivered_today = [booking for booking in bookings_today if booking.status == BookingStatus.DELIVERED]
        revenue_today = sum((booking.final_fare or booking.estimated_fare or Decimal("0")) for booking in delivered_today)
        commission_today = sum((booking.commission or Decimal("0")) for booking in bookings_today)
        return {
            "users": len(users),
            "drivers": len(drivers),
            "bookings": len(bookings),
            "active_bookings": len([b for b in bookings if b.status not in {BookingStatus.DELIVERED, BookingStatus.CANCELLED}]),
            "totalBookingsToday": len(bookings_today),
            "activeDeliveries": len(
                [
                    booking
                    for booking in bookings
                    if booking.status
                    in {
                        BookingStatus.DRIVER_ASSIGNED,
                        BookingStatus.DRIVER_ARRIVING,
                        BookingStatus.PICKED_UP,
                        BookingStatus.IN_TRANSIT,
                    }
                ]
            ),
            "onlineDrivers": len([driver for driver in drivers if driver.online_status]),
            "pendingApprovals": len([driver for driver in drivers if driver.verification_status == VerificationStatus.PENDING]),
            "revenueToday": float(revenue_today),
            "totalCommission": float(commission_today),
            "failedDeliveries": len([booking for booking in bookings_today if booking.status == BookingStatus.CANCELLED]),
            "sharedDeliveries": len([booking for booking in bookings_today if booking.booking_type.value == "shared"]),
            "payments": len(payments),
        }

    async def list_drivers_for_admin(self) -> list[dict]:
        result = await self.session.execute(select(Driver).options(selectinload(Driver.user)).order_by(Driver.created_at.desc()))
        rows = result.scalars().all()
        return [
            {
                "id": str(driver.id),
                "name": driver.user.name or "Unnamed driver",
                "phone": driver.user.phone,
                "vehicleType": driver.vehicle_type,
                "vehicleNumber": driver.vehicle_number,
                "verificationStatus": driver.verification_status.value,
                "onlineStatus": driver.online_status,
                "rating": float(driver.rating),
                "totalTrips": driver.total_trips,
                "earnings": 0,
                "currentLat": float(driver.current_lat) if driver.current_lat is not None else None,
                "currentLng": float(driver.current_lng) if driver.current_lng is not None else None,
            }
            for driver in rows
        ]

    async def list_bookings_for_admin(self) -> list[dict]:
        result = await self.session.execute(
            select(Booking).options(selectinload(Booking.customer).selectinload(Customer.user)).order_by(Booking.created_at.desc())
        )
        rows = result.scalars().all()
        driver_ids = {booking.assigned_driver_id for booking in rows if booking.assigned_driver_id}
        driver_names: dict[uuid.UUID, str] = {}
        if driver_ids:
            driver_result = await self.session.execute(select(Driver).options(selectinload(Driver.user)).where(Driver.id.in_(driver_ids)))
            driver_names = {driver.id: driver.user.name or driver.user.phone for driver in driver_result.scalars().all()}
        return [
            {
                "id": str(booking.id),
                "customer": booking.customer.user.name or booking.customer.user.phone,
                "assignedDriver": driver_names.get(booking.assigned_driver_id) if booking.assigned_driver_id else None,
                "bookingType": booking.booking_type.value,
                "status": booking.status.value,
                "fare": float(booking.final_fare or booking.estimated_fare),
                "commission": float(booking.commission or Decimal("0")),
                "pickup": booking.pickup_address,
                "drop": booking.drop_address,
                "createdAt": booking.created_at.isoformat(),
            }
            for booking in rows
        ]

    async def list_payments_for_admin(self) -> list[dict]:
        result = await self.session.execute(select(Payment).order_by(Payment.created_at.desc()))
        payments = result.scalars().all()
        booking_ids = {payment.booking_id for payment in payments}
        bookings_by_id: dict[uuid.UUID, Booking] = {}
        if booking_ids:
            booking_result = await self.session.execute(
                select(Booking).options(selectinload(Booking.customer).selectinload(Customer.user)).where(Booking.id.in_(booking_ids))
            )
            bookings_by_id = {booking.id: booking for booking in booking_result.scalars().all()}
        return [
            {
                "id": str(payment.id),
                "bookingId": str(payment.booking_id),
                "customer": self._customer_label(bookings_by_id.get(payment.booking_id)),
                "driver": "Assigned driver",
                "amount": float(payment.amount),
                "status": payment.payment_status.value,
                "method": payment.method,
                "createdAt": payment.created_at.isoformat(),
            }
            for payment in payments
        ]

    @staticmethod
    def _customer_label(booking: Booking | None) -> str:
        if booking is None:
            return "Unknown"
        return booking.customer.user.name or booking.customer.user.phone

    async def analytics(self) -> dict:
        bookings = await self.bookings.list()
        payments = await self.payments.list()
        return {
            "dailyBookings": len(bookings),
            "revenue": float(sum((payment.amount for payment in payments if payment.payment_status == PaymentStatus.PAID), Decimal("0"))),
            "commissions": float(sum((booking.commission or Decimal("0") for booking in bookings), Decimal("0"))),
            "activeUsers": len(await self.users.list()),
            "sharedBookingSuccessRate": 0,
            "averageDeliveryTime": "38 min",
            "topZones": [],
            "driverPerformance": [],
        }

    async def set_driver_verification(self, driver_id: uuid.UUID, status: VerificationStatus):
        driver = await self.drivers.get_by_id(driver_id)
        if not driver:
            raise AppException("DRIVER_NOT_FOUND", "Driver not found", 404)
        driver.verification_status = status
        await self.session.commit()
        return driver

    async def assign_driver(self, booking_id: uuid.UUID, driver_id: uuid.UUID):
        booking = await self.bookings.get_by_id(booking_id)
        if not booking:
            raise AppException("BOOKING_NOT_FOUND", "Booking not found", 404)
        booking.assigned_driver_id = driver_id
        booking.status = BookingStatus.DRIVER_ASSIGNED
        await self.session.commit()
        return booking

    async def cancel_booking(self, booking_id: uuid.UUID):
        booking = await self.bookings.get_by_id(booking_id)
        if not booking:
            raise AppException("BOOKING_NOT_FOUND", "Booking not found", 404)
        booking.status = BookingStatus.CANCELLED
        await self.session.commit()
        return booking
