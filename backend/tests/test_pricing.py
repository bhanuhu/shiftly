from decimal import Decimal

from app.modules.pricing.service import PricingService


def test_pricing_estimate_returns_fare_and_commission():
    fare, commission = PricingService().estimate(Decimal("12.9716"), Decimal("77.5946"), Decimal("12.9352"), Decimal("77.6245"))
    assert fare > Decimal("60.00")
    assert commission == (fare * Decimal("0.18")).quantize(Decimal("0.01"))
