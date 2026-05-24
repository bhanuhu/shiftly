from app.core.logging import get_logger

logger = get_logger(__name__)


class NotificationService:
    async def push(self, recipient_id: str, event: str, payload: dict) -> None:
        logger.info("notification_queued", recipient_id=recipient_id, event=event, payload=payload)
