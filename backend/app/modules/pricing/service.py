from decimal import Decimal
from math import asin, cos, radians, sin, sqrt


class PricingService:
    base_fare = Decimal("60.00")
    per_km = Decimal("18.00")
    commission_rate = Decimal("0.18")

    def estimate(self, pickup_lat, pickup_lng, drop_lat, drop_lng) -> tuple[Decimal, Decimal]:
        km = self._distance_km(float(pickup_lat), float(pickup_lng), float(drop_lat), float(drop_lng))
        fare = self.base_fare + (Decimal(str(km)) * self.per_km)
        fare = fare.quantize(Decimal("0.01"))
        return fare, (fare * self.commission_rate).quantize(Decimal("0.01"))

    @staticmethod
    def _distance_km(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
        radius = 6371
        dlat = radians(lat2 - lat1)
        dlng = radians(lng2 - lng1)
        a = sin(dlat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlng / 2) ** 2
        return 2 * radius * asin(sqrt(a))
