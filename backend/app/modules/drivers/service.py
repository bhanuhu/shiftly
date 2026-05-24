from decimal import Decimal

from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import AppException
from app.modules.drivers.models import Driver, DriverLocationHistory
from app.modules.drivers.repository import DriverEarningRepository, DriverLocationRepository, DriverRepository
from app.modules.drivers.schemas import DriverRegisterRequest
from app.modules.users.models import User
from app.shared.enums import UserRole


class DriverService:
    def __init__(self, session: AsyncSession, redis: Redis):
        self.session = session
        self.redis = redis
        self.drivers = DriverRepository(session)
        self.locations = DriverLocationRepository(session)
        self.earnings = DriverEarningRepository(session)

    async def register(self, user: User, payload: DriverRegisterRequest) -> Driver:
        if user.role != UserRole.DRIVER:
            raise AppException("ROLE_MISMATCH", "Only driver accounts can register driver profiles", 403)
        existing = await self.drivers.get_by_user_id(user.id)
        if existing:
            return existing
        data = payload.model_dump()
        full_name = data.pop("full_name", None)
        if full_name:
            user.name = full_name
        driver = await self.drivers.add(Driver(user_id=user.id, **data))
        await self.session.commit()
        return driver

    async def get_me(self, user: User) -> Driver:
        driver = await self.drivers.get_by_user_id(user.id)
        if not driver:
            raise AppException("DRIVER_NOT_FOUND", "Driver profile not found", 404)
        return driver

    async def set_status(self, user: User, online: bool) -> Driver:
        driver = await self.get_me(user)
        driver.online_status = online
        if not online:
            await self.redis.delete(f"driver:online:{driver.id}")
            await self.redis.zrem("geo:drivers", str(driver.id))
        else:
            await self.redis.set(f"driver:online:{driver.id}", "1")
            if driver.current_lat is not None and driver.current_lng is not None:
                await self.redis.geoadd("geo:drivers", [float(driver.current_lng), float(driver.current_lat), str(driver.id)])
        await self.session.commit()
        return driver

    async def update_location(self, user: User, lat: Decimal, lng: Decimal, booking_id=None) -> Driver:
        driver = await self.get_me(user)
        driver.current_lat = lat
        driver.current_lng = lng
        await self.locations.add(DriverLocationHistory(driver_id=driver.id, booking_id=booking_id, lat=lat, lng=lng))
        if driver.online_status:
            await self.redis.geoadd("geo:drivers", [float(lng), float(lat), str(driver.id)])
            await self.redis.set(f"driver:online:{driver.id}", "1")
        await self.session.commit()
        return driver

    async def list_earnings(self, user: User):
        driver = await self.get_me(user)
        return await self.earnings.list_by_driver(driver.id)
