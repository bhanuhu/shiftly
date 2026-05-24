import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import AppException
from app.modules.bookings.repository import BookingRepository
from app.modules.customers.repository import CustomerRepository
from app.modules.payments.models import Payment
from app.modules.payments.repository import PaymentRepository
from app.modules.users.models import User
from app.shared.enums import PaymentStatus


class PaymentService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.payments = PaymentRepository(session)
        self.bookings = BookingRepository(session)
        self.customers = CustomerRepository(session)

    async def create_order(self, booking_id: uuid.UUID, method: str) -> Payment:
        booking = await self.bookings.get_by_id(booking_id)
        if not booking:
            raise AppException("BOOKING_NOT_FOUND", "Booking not found", 404)
        payment = await self.payments.add(
            Payment(
                booking_id=booking.id,
                amount=booking.final_fare or booking.estimated_fare,
                method=method,
                provider_order_id=f"shiftly_{uuid.uuid4().hex}",
            )
        )
        await self.session.commit()
        return payment

    async def verify(self, provider_order_id: str, provider_payment_id: str) -> Payment:
        payment = await self.payments.get_by_order_id(provider_order_id)
        if not payment:
            raise AppException("PAYMENT_NOT_FOUND", "Payment order not found", 404)
        payment.provider_payment_id = provider_payment_id
        payment.payment_status = PaymentStatus.PAID
        await self.session.commit()
        return payment

    async def history(self, user: User) -> list[Payment]:
        customer = await self.customers.get_by_user_id(user.id)
        if not customer:
            return []
        bookings = await self.bookings.list_by_customer(customer.id)
        return await self.payments.list_for_bookings([b.id for b in bookings])
