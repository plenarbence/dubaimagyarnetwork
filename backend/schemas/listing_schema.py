from datetime import datetime
from pydantic import BaseModel
from typing import Optional
from enum import Enum


# ===========================
# ✅ Enum – státuszok
# (ugyanazok, mint a Listing modellben)
# ===========================
class ListingStatus(str, Enum):
    pending_admin = "pending_admin"
    awaiting_payment = "awaiting_payment"
    active = "active"
    expired = "expired"
    rejected = "rejected"


# ===========================
# ✅ Input schema – új listing létrehozása
# ===========================
class ListingCreate(BaseModel):
    title: str
    description: str


# ===========================
# ✅ Admin update schema – kategorizálás / jóváhagyás
# ===========================
class ListingAdminUpdate(BaseModel):
    category_id: Optional[int] = None
    status: Optional[ListingStatus] = None
    admin_comment: Optional[str] = None


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
    admin_comment: Optional[str] = None

    user_id: int
    category_id: Optional[int] = None

    class Config:
        from_attributes = True
