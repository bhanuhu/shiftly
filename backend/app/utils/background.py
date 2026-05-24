from app.core.logging import get_logger

logger = get_logger(__name__)


async def cleanup_stale_bookings() -> None:
    logger.info("cleanup_stale_bookings_started")


async def process_payouts() -> None:
    logger.info("payout_processing_started")


async def notify_next_driver(booking_id: str) -> None:
    logger.info("notify_next_driver_started", booking_id=booking_id)
