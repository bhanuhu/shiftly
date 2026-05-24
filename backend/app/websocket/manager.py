from collections import defaultdict
from typing import Any

from fastapi import WebSocket


class WebSocketManager:
    def __init__(self) -> None:
        self.drivers: dict[str, WebSocket] = {}
        self.customers: dict[str, WebSocket] = {}
        self.booking_subscriptions: dict[str, set[tuple[str, str]]] = defaultdict(set)

    async def connect_driver(self, driver_id: str, websocket: WebSocket) -> None:
        await websocket.accept()
        self.drivers[driver_id] = websocket

    async def connect_customer(self, customer_id: str, websocket: WebSocket) -> None:
        await websocket.accept()
        self.customers[customer_id] = websocket

    def disconnect_driver(self, driver_id: str) -> None:
        self.drivers.pop(driver_id, None)

    def disconnect_customer(self, customer_id: str) -> None:
        self.customers.pop(customer_id, None)

    async def send_to_driver(self, driver_id: str, payload: dict[str, Any]) -> None:
        websocket = self.drivers.get(driver_id)
        if websocket:
            await websocket.send_json(payload)

    async def send_to_customer(self, customer_id: str, payload: dict[str, Any]) -> None:
        websocket = self.customers.get(customer_id)
        if websocket:
            await websocket.send_json(payload)

    async def broadcast_booking(self, booking_id: str, payload: dict[str, Any]) -> None:
        for kind, entity_id in self.booking_subscriptions.get(booking_id, set()):
            if kind == "driver":
                await self.send_to_driver(entity_id, payload)
            if kind == "customer":
                await self.send_to_customer(entity_id, payload)


websocket_manager = WebSocketManager()
