# backend/utils/r2_storage.py

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


class R2ImageStorage:
    """
    Cloudflare R2 (S3 kompatibilis) image storage.

    Amit csinál:
    - képet feldolgoz (átméretezés + fix canvas + háttér + JPEG export)
    - feltölti R2 bucketbe
    - visszaadja:
        - cdn_key  (objektum kulcs az R2-ben)
        - url      (teljes publikus URL, amit DB-be elmentesz)
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

    def save_image(
        self,
        file_obj,
        listing_id: int,
        *,
        canvas_size: Tuple[int, int] = (450, 600),
        quality: int = 90,
    ) -> Tuple[str, str]:
        """
        Feltölt egy képet:
        - feldolgozza (PIL) -> JPEG bytes
        - feltölti R2-be
        - visszaad (cdn_key, url)

        file_obj: UploadFile.file (file-like)
        """
        jpeg_bytes = self._process_to_jpeg_bytes(file_obj, canvas_size=canvas_size, quality=quality)

        # kulcs: <prefix>/listings/<listing_id>/<uuid>.jpg
        cdn_key = f"{self.prefix}/listings/{listing_id}/{uuid.uuid4().hex}.jpg"
        url = f"{self.public_base}/{cdn_key}"

        self.client.put_object(
            Bucket=self.bucket,
            Key=cdn_key,
            Body=jpeg_bytes,
            ContentType="image/jpeg",
            CacheControl="public, max-age=31536000, immutable",
        )

        return cdn_key, url

    def delete_image(self, cdn_key: str) -> None:
        """
        R2-ből törlés cdn_key alapján.
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
        Régi LocalStorage feldolgozási logika R2-re:
        - EXIF orientáció javítás
        - RGBA konverzió
        - thumbnail (aránytartó) a canvasba
        - fix háttér (világosszürke)
        - középre igazítás
        - JPEG export bytes-ba
        """
        # 1) load + EXIF orient fix
        file_obj.seek(0)
        img = Image.open(file_obj)
        img = ImageOps.exif_transpose(img).convert("RGBA")

        # 2) aránytartó átméretezés (a canvas_size-ba férjen bele)
        img.thumbnail(canvas_size, Image.Resampling.LANCZOS)

        # 3) fix háttér + középre igazítás
        bg = Image.new("RGBA", canvas_size, (*bg_color, 255))
        x = (bg.width - img.width) // 2
        y = (bg.height - img.height) // 2
        bg.paste(img, (x, y), img)

        # 4) JPEG bytes
        out = BytesIO()
        bg.convert("RGB").save(out, format="JPEG", quality=int(quality), optimize=True)
        return out.getvalue()
