import uuid

from app.core.security import create_access_token, decode_token
from app.shared.enums import UserRole


def test_access_token_roundtrip():
    user_id = uuid.uuid4()
    token = create_access_token(user_id, UserRole.CUSTOMER)
    payload = decode_token(token)
    assert payload["sub"] == str(user_id)
    assert payload["role"] == UserRole.CUSTOMER
    assert payload["type"] == "access"
