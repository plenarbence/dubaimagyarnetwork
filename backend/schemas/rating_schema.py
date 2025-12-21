from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class RatingResponse(BaseModel):
    id: int
    user_id: int
    listing_id: int

    rating: int                    # 1–5
    text: Optional[str] = None     # max 200
    owner_response: Optional[str] = None

    created_at: datetime

    class Config:
        from_attributes = True
