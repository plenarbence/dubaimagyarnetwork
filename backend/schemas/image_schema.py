from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class ImageResponse(BaseModel):
    id: int
    listing_id: int

    cdn_key: str
    url: Optional[str] = None
    filename: str

    uploaded_at: datetime
    is_main: bool

    class Config:
        from_attributes = True
