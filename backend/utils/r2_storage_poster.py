# backend/utils/r2_storage_poster.py

import uuid
from io import BytesIO
from typing import Tuple

import boto3
from botocore.config import Config
from PIL import Image, ImageOps

from backend.config import (
    R2_BUCKET,
    R2_PUBLIC_BASE,
    IMAGE_PREFIX,
    R2_ENDPOINT,
    R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY,
)


class R2PosterStorage:
    """
    Cloudflare R2 poster image storage.

    - fekvő (2:1) képekhez
    - feldolgozás + JPEG export
    - feltöltés R2-be
    - visszaad: (cdn_key, url)

    FONTOS: IMAGE_PREFIX bent marad (dev/prod elkülönítés).
    """

    def __init__(self):
        self.bucket = R2_BUCKET.strip()
        self.endpoint = R2_ENDPOINT.strip()
        self.access_key = R2_ACCESS_KEY_ID.strip()
        self.secret_key = R2_SECRET_ACCESS_KEY.strip()
        self.public_base = R2_PUBLIC_BASE.rstrip("/")
        self.prefix = IMAGE_PREFIX.strip().strip("/")

        self.client = boto3.client(
            "s3",
            endpoint_url=self.endpoint,
            aws_access_key_id=self.access_key,
            aws_secret_access_key=self.secret_key,
            config=Config(signature_version="s3v4"),
            region_name="auto",
        )

    def save_poster(
        self,
        file_obj,
        *,
        canvas_size: Tuple[int, int] = (1800, 900),  # 2:1 fekvő
        quality: int = 90,
    ) -> Tuple[str, str]:
        """
        Poster kép feltöltése R2-be.
        file_obj: UploadFile.file (file-like)
        """
        jpeg_bytes = self._process_to_jpeg_bytes(
            file_obj,
            canvas_size=canvas_size,
            quality=quality,
        )

        # kulcs: <prefix>/posters/<uuid>.jpg  (dev/prod szétválasztás megmarad)
        cdn_key = f"{self.prefix}/posters/{uuid.uuid4().hex}.jpg"
        url = f"{self.public_base}/{cdn_key}"

        self.client.put_object(
            Bucket=self.bucket,
            Key=cdn_key,
            Body=jpeg_bytes,
            ContentType="image/jpeg",
            CacheControl="public, max-age=31536000, immutable",
        )

        return cdn_key, url

    def delete_poster(self, cdn_key: str) -> None:
        """
        Poster törlése R2-ből cdn_key alapján.
        """
        if not cdn_key:
            return

        self.client.delete_object(
            Bucket=self.bucket,
            Key=cdn_key,
        )

    @staticmethod
    def _process_to_jpeg_bytes(
        file_obj,
        *,
        canvas_size: Tuple[int, int],
        quality: int,
        bg_color: Tuple[int, int, int] = (245, 245, 245),
    ) -> bytes:
        """
        Kép feldolgozás:
        - EXIF orient fix
        - RGBA
        - aránytartó resize a canvas-ba
        - fix háttér
        - középre igazítás
        - JPEG export
        """
        file_obj.seek(0)
        img = Image.open(file_obj)
        img = ImageOps.exif_transpose(img).convert("RGBA")

        img.thumbnail(canvas_size, Image.Resampling.LANCZOS)

        bg = Image.new("RGBA", canvas_size, (*bg_color, 255))
        x = (bg.width - img.width) // 2
        y = (bg.height - img.height) // 2
        bg.paste(img, (x, y), img)

        out = BytesIO()
        bg.convert("RGB").save(out, format="JPEG", quality=int(quality), optimize=True)
        return out.getvalue()
