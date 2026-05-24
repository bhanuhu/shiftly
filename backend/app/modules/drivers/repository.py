import uuid

from sqlalchemy import select

from app.modules.drivers.models import Driver, DriverEarning, DriverLocationHistory
from app.shared.repository import BaseRepository


class DriverRepository(BaseRepository[Driver]):
    model = Driver

    async def get_by_user_id(self, user_id: uuid.UUID) -> Driver | None:
        result = await self.session.execute(select(Driver).where(Driver.user_id == user_id))
        return result.scalar_one_or_none()

    async def list_online(self) -> list[Driver]:
        result = await self.session.execute(select(Driver).where(Driver.online_status.is_(True)))
        return list(result.scalars().all())


class DriverLocationRepository(BaseRepository[DriverLocationHistory]):
    model = DriverLocationHistory


class DriverEarningRepository(BaseRepository[DriverEarning]):
    model = DriverEarning

    async def list_by_driver(self, driver_id: uuid.UUID) -> list[DriverEarning]:
        result = await self.session.execute(select(DriverEarning).where(DriverEarning.driver_id == driver_id))
        return list(result.scalars().all())
