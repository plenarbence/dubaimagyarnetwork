# backend/schemas/poster_schema.py

from datetime import datetime
from pydantic import BaseModel


# =========================
# ADMIN POSTER SCHEMA
# =========================
# Ezt használja az admin oldal:
# - feltöltés után response
# - admin listázás
# - törlés / későbbi kezelés
# Tartalmaz belső mezőket is (cdn_key)
class PosterAdminSchema(BaseModel):
    id: int
    cdn_key: str
    url: str
    link: str
    created_at: datetime

    class Config:
        from_attributes = True


# =========================
# PUBLIC POSTER SCHEMA
# =========================
# Ezt használja a publikus oldal (főoldal):
# - csak megjelenítésre
# - semmi belső / infra adat
class PosterPublicSchema(BaseModel):
    id: int
    url: str
    link: str
    click_count: int
