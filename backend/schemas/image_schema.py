from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ImageBase(BaseModel):
    url: str
    filename: Optional[str] = None
    is_main: Optional[bool] = False   # 👈 új mező

class ImageCreate(BaseModel):
    listing_id: int
    url: str
    filename: Optional[str] = None
    is_main: Optional[bool] = False   # 👈 új mező

class ImageResponse(ImageBase):
    id: int
    listing_id: int
    uploaded_at: datetime

    class Config:
        orm_mode = True
