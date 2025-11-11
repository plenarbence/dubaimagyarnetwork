# backend/schemas/content_schema.py

from pydantic import BaseModel

# ✅ csak a value mezőt várjuk frissítéskor
class ContentUpdate(BaseModel):
    value: str
