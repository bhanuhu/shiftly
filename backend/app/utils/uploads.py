import uuid

import boto3

from app.core.config import get_settings
from app.core.exceptions import AppException


class UploadService:
    def __init__(self):
        self.settings = get_settings()

    def upload_document(self, content: bytes, filename: str, content_type: str) -> str:
        if self.settings.s3_bucket_name:
            return self._upload_s3(content, filename, content_type)
        return f"local://uploads/{uuid.uuid4()}-{filename}"

    def _upload_s3(self, content: bytes, filename: str, content_type: str) -> str:
        if not self.settings.aws_access_key_id or not self.settings.aws_secret_access_key:
            raise AppException("UPLOAD_NOT_CONFIGURED", "S3 credentials are not configured", 500)
        key = f"documents/{uuid.uuid4()}-{filename}"
        client = boto3.client(
            "s3",
            region_name=self.settings.aws_region,
            aws_access_key_id=self.settings.aws_access_key_id,
            aws_secret_access_key=self.settings.aws_secret_access_key.get_secret_value(),
        )
        client.put_object(Bucket=self.settings.s3_bucket_name, Key=key, Body=content, ContentType=content_type)
        return f"s3://{self.settings.s3_bucket_name}/{key}"
