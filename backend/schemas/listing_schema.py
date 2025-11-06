from datetime import datetime
from typing import Optional, List, Annotated
from enum import Enum
from pydantic import BaseModel, Field, StringConstraints
from schemas.image_schema import ImageResponse


# ===========================
# ✅ Enum – státuszok
# ===========================
class ListingStatus(str, Enum):
    pending_admin = "pending_admin"
    awaiting_payment = "awaiting_payment"
    active = "active"
    expired = "expired"
    rejected = "rejected"
    draft = "draft"


# ===========================
# ✅ Tag típusdefiníció (max 50 karakter)
# ===========================
TagStr = Annotated[str, StringConstraints(max_length=50)]


# ===========================
# ✅ Input schema – új listing létrehozása
# ===========================
class ListingCreate(BaseModel):
    title: str = Field(..., max_length=100)
    description: str  # hosszú rich-text leírás (limitálva frontenden)

    # opcionális elérhetőségek
    email: Optional[str] = Field(None, max_length=255)
    phone_number: Optional[str] = Field(None, max_length=50)
    website: Optional[str] = Field(None, max_length=255)
    whatsapp: Optional[str] = Field(None, max_length=100)
    instagram: Optional[str] = Field(None, max_length=255)
    tiktok: Optional[str] = Field(None, max_length=255)
    facebook: Optional[str] = Field(None, max_length=255)
    youtube: Optional[str] = Field(None, max_length=255)
    location: Optional[str] = Field(None, max_length=255)

    # új mezők
    company: Optional[str] = Field(None, max_length=255)
    tags: Optional[List[TagStr]] = Field(
        default=None,
        max_items=5,
        description="Opcionális kulcsszavak (max 5 db, max 50 karakter)"
    )

    category_id: Optional[int] = None


# ===========================
# ✅ Admin update schema – kategorizálás / jóváhagyás
# ===========================
class ListingAdminUpdate(BaseModel):
    category_id: Optional[int] = None
    status: Optional[ListingStatus] = None
    admin_comment: Optional[str] = Field(None, max_length=500)


# ===========================
# ✅ Output schema – válasz a kliensnek
# ===========================
class ListingResponse(BaseModel):
    id: int
    title: str
    description: str

    created_at: datetime
    approved_at: Optional[datetime] = None
    published_at: Optional[datetime] = None
    visibility_until: Optional[datetime] = None

    status: ListingStatus
    admin_comment: Optional[str] = Field(None, max_length=500)

    user_id: int
    category_id: Optional[int] = None

    # opcionális elérhetőségek
    email: Optional[str] = Field(None, max_length=255)
    phone_number: Optional[str] = Field(None, max_length=50)
    website: Optional[str] = Field(None, max_length=255)
    whatsapp: Optional[str] = Field(None, max_length=100)
    instagram: Optional[str] = Field(None, max_length=255)
    tiktok: Optional[str] = Field(None, max_length=255)
    facebook: Optional[str] = Field(None, max_length=255)
    youtube: Optional[str] = Field(None, max_length=255)
    location: Optional[str] = Field(None, max_length=255)

    # új mezők
    company: Optional[str] = Field(None, max_length=255)
    tags: Optional[List[str]] = None  # válasznál elég ha string lista jön vissza

    images: List[ImageResponse] = []

    class Config:
        from_attributes = True
