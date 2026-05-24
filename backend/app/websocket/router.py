from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.websocket.manager import websocket_manager

router = APIRouter(tags=["websocket"])


@router.websocket("/ws/driver/{driver_id}")
async def driver_socket(websocket: WebSocket, driver_id: str):
    await websocket_manager.connect_driver(driver_id, websocket)
    try:
        while True:
            message = await websocket.receive_json()
            booking_id = message.get("booking_id")
            if booking_id:
                websocket_manager.booking_subscriptions[booking_id].add(("driver", driver_id))
    except WebSocketDisconnect:
        websocket_manager.disconnect_driver(driver_id)


@router.websocket("/ws/customer/{customer_id}")
async def customer_socket(websocket: WebSocket, customer_id: str):
    await websocket_manager.connect_customer(customer_id, websocket)
    try:
        while True:
            message = await websocket.receive_json()
            booking_id = message.get("booking_id")
            if booking_id:
                websocket_manager.booking_subscriptions[booking_id].add(("customer", customer_id))
    except WebSocketDisconnect:
        websocket_manager.disconnect_customer(customer_id)
