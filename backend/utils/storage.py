# backend/utils/storage.py

import os
from typing import Protocol, runtime_checkable
from PIL import Image
from datetime import datetime
from os import getenv


@runtime_checkable
class StorageDriver(Protocol):
    """
    Egységes interfész a storage-hoz.
    Minden storage driver (LocalStorage, CDNStorage, stb.)
    ezekkel a metódusokkal kell, hogy rendelkezzen.
    """

    def driver_name(self) -> str:
        """Visszaadja az aktív driver nevét, pl. 'local' vagy 'cdn'."""
        ...

    def save_image(self, file_obj, suggested_filename: str, is_main: bool = False) -> str:
        """
        Feltölt egy képet és visszaadja az elérési URL-t.
        - file_obj: az UploadFile.file objektum (vagy fájl-stream)
        - suggested_filename: az eredeti fájlnév vagy generált név
        - is_main: opcionális flag, csak az adatbázis logikához (nem minden driver használja)
        """
        ...

    def build_public_url(self, identifier: str) -> str:
        """
        Azonosító (fájlnév vagy CDN image_id) alapján visszaadja a publikus elérési linket.
        Példa:
          Local → /uploads/filename.jpg
          CDN   → https://imagedelivery.net/XYZ/abc123/public
        """
        ...

    def delete_image(self, identifier: str) -> None:
        """
        Törli a képet a storage-ból.
        Nem minden driver implementálja ténylegesen (CDN-nél gyakran opcionális).
        """
        ...





class LocalStorage:
    def __init__(self, upload_dir: str):
        self.upload_dir = upload_dir
        os.makedirs(self.upload_dir, exist_ok=True)

    def driver_name(self) -> str:
        return "local"

    def save_image(self, file_obj, suggested_filename: str, is_main: bool = False) -> str:
        """
        Feltöltés és feldolgozás lokális módban:
        - átméretezés aránytartással
        - háttér kitöltése homogén színnel
        - mentés JPEG-be
        - elérési URL visszaadása
        """
        # 1️⃣ fájlnév előkészítése
        safe_name = suggested_filename
        file_path = os.path.join(self.upload_dir, safe_name)

        # 2️⃣ kép megnyitása
        img = Image.open(file_obj).convert("RGBA")

        # 3️⃣ max méret
        max_size = (900, 1200)
        img.thumbnail(max_size, Image.Resampling.LANCZOS)

        # 4️⃣ háttér (világosszürke, pl. #f5f5f5)
        bg_color = (245, 245, 245, 255)
        bg = Image.new("RGBA", max_size, bg_color)

        # 5️⃣ középre igazítás
        x = (bg.width - img.width) // 2
        y = (bg.height - img.height) // 2
        bg.paste(img, (x, y), img)

        # 6️⃣ mentés (JPEG)
        bg.convert("RGB").save(file_path, "JPEG", quality=90)

        # 7️⃣ URL build (local)
        url = f"/{self.upload_dir}/{safe_name}"

        return url
    

    def build_public_url(self, identifier: str) -> str:
        """
        Lokális fájlhoz abszolút URL építése.
        Megoldja a dupla /uploads/ hibát is.
        """
        base = getenv("API_BASE_URL", "http://127.0.0.1:8000").rstrip("/")
        clean_id = identifier.replace("\\", "/").lstrip("/")
        
        # ha már tartalmaz 'uploads', ne ismételd
        if clean_id.startswith(self.upload_dir.strip("/")):
            return f"{base}/{clean_id}"
        else:
            return f"{base}/{self.upload_dir.strip('/')}/{clean_id}"

    

    def delete_image(self, identifier: str) -> None:
        """
        Megpróbálja törölni a megadott képfájlt a lokális storage-ból.
        Az 'identifier' lehet fájlnév vagy relatív path (pl. 'uploads/abc.jpg').
        """

        if not identifier:
            print("[WARN] Nincs identifier megadva a fájltörléshez.")
            return

        # 🔹 Tisztítás: vágd le az URL részeket, ha vannak
        filename = os.path.basename(identifier)
        upload_dir = os.path.abspath(self.upload_dir)

        # 🔹 Végső path: mindig az uploads mappába mutasson
        file_path = os.path.join(upload_dir, filename)
        abs_file_path = os.path.abspath(file_path)

        # 🔹 Biztonsági check
        if not abs_file_path.startswith(upload_dir):
            print(f"[SECURITY] Érvénytelen path: {abs_file_path}")
            return

        # 🔹 Törlés
        if os.path.exists(abs_file_path):
            try:
                os.remove(abs_file_path)
                print(f"[INFO] ✅ Kép törölve: {abs_file_path}")
            except Exception as e:
                print(f"[ERROR] ❌ Nem sikerült törölni a képet: {abs_file_path} ({e})")
        else:
            print(f"[WARN] ⚠️ A fájl nem létezik: {abs_file_path}")






class CDNStorage:
    def __init__(self, upload_url: str, delivery_base: str, api_key: str):
        self.upload_url = upload_url
        self.delivery_base = delivery_base.rstrip("/") + "/"
        self.api_key = api_key

    def driver_name(self) -> str:
        return "cdn"

    # A tényleges feltöltést a következő lépésben tesszük ide.
    # def save_image(...): ...
    # def build_public_url(...): ...
    # def delete_image(...): ...


def get_storage_driver() -> StorageDriver:
    """
    Factory: az .env alapján visszaadja az aktív storage drivert.
    STORAGE_BACKEND=local  → LocalStorage
    STORAGE_BACKEND=cdn    → CDNStorage
    """
    backend = os.getenv("STORAGE_BACKEND", "local").strip().lower()

    if backend == "local":
        upload_dir = os.getenv("UPLOAD_DIR", "uploads")
        return LocalStorage(upload_dir=upload_dir)

    if backend == "cdn":
        upload_url = os.getenv("CDN_UPLOAD_URL", "").strip()
        delivery_base = os.getenv("CDN_DELIVERY_BASE", "").strip()
        api_key = os.getenv("CDN_API_KEY", "").strip()

        missing = []
        if not upload_url:
            missing.append("CDN_UPLOAD_URL")
        if not delivery_base:
            missing.append("CDN_DELIVERY_BASE")
        if not api_key:
            missing.append("CDN_API_KEY")
        if missing:
            raise RuntimeError(
                f"CDN storage configured, but missing env keys: {', '.join(missing)}"
            )

        return CDNStorage(
            upload_url=upload_url,
            delivery_base=delivery_base,
            api_key=api_key,
        )

    raise RuntimeError(f"Unsupported STORAGE_BACKEND value: {backend}")
