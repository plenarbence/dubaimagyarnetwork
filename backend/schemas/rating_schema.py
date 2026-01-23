from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


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


# for public listings
class PublicRatingOut(BaseModel):
    id: int
    user_id: int
    created_at: datetime
    rating: int
    text: str | None

    class Config:
        from_attributes = True




# ===========================
# ✅ Input schema – create rating
# ===========================
class RatingCreateIn(BaseModel):
    listing_id: int

    rating: int = Field(
        ...,
        ge=1,
        le=5,
        description="Csillagos értékelés 1 és 5 között",
    )

    text: Optional[str] = Field(
        default=None,
        max_length=200,
        description="Szöveges értékelés (max 200 karakter)",
    )



# ===========================
# ✅ My rating
# ===========================
class MyRatingOut(BaseModel):
    rating_id: int
    text: str | None
    rating: int
    created_at: datetime

    listing_id: int
    listing_title: str
    listing_isactive: bool
