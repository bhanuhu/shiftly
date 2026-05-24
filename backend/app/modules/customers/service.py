import uuid

from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import AppException
from app.modules.bookings.models import Booking
from app.modules.bookings.repository import BookingRepository
from app.modules.customers.models import Customer
from app.modules.customers.repository import CustomerRepository
from app.modules.customers.schemas import BookingCreateRequest
from app.modules.matching.service import MatchingService
from app.modules.pricing.service import PricingService
from app.modules.users.models import User
from app.shared.enums import BookingStatus, UserRole


class CustomerService:
    def __init__(self, session: AsyncSession, redis: Redis):
        self.session = session
        self.redis = redis
        self.customers = CustomerRepository(session)
        self.bookings = BookingRepository(session)

    async def get_or_create_customer(self, user: User) -> Customer:
        if user.role != UserRole.CUSTOMER:
            raise AppException("ROLE_MISMATCH", "Only customer accounts can create bookings", 403)
        customer = await self.customers.get_by_user_id(user.id)
        if customer:
            return customer
        customer = await self.customers.add(Customer(user_id=user.id))
        await self.session.flush()
        return customer

    async def create_booking(self, user: User, payload: BookingCreateRequest) -> Booking:
        customer = await self.get_or_create_customer(user)
        fare, commission = PricingService().estimate(payload.pickup_lat, payload.pickup_lng, payload.drop_lat, payload.drop_lng)
        booking = await self.bookings.add(
            Booking(customer_id=customer.id, estimated_fare=fare, commission=commission, **payload.model_dump())
        )
        await self.session.commit()
        await MatchingService(self.session, self.redis).find_driver(booking)
        return booking

    async def get_booking(self, user: User, booking_id: uuid.UUID) -> Booking:
        customer = await self.get_or_create_customer(user)
        booking = await self.bookings.get_by_id(booking_id)
        if not booking or booking.customer_id != customer.id:
            raise AppException("BOOKING_NOT_FOUND", "Booking not found", 404)
        return booking

    async def list_bookings(self, user: User) -> list[Booking]:
        customer = await self.get_or_create_customer(user)
        return await self.bookings.list_by_customer(customer.id)

    async def cancel_booking(self, user: User, booking_id: uuid.UUID) -> Booking:
        booking = await self.get_booking(user, booking_id)
        if booking.status in {BookingStatus.DELIVERED, BookingStatus.CANCELLED}:
            raise AppException("BOOKING_NOT_CANCELLABLE", "Booking cannot be cancelled", 409)
        booking.status = BookingStatus.CANCELLED
        await self.session.commit()
        return booking
