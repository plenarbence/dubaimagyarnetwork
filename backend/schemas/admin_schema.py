from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Any
from backend.models.listing import ListingStatus

# -----------------------------
# ✅ Admin belépéshez input séma
# -----------------------------
class AdminLoginRequest(BaseModel):
    username: str
    password: str



# -----------------------------
# ✅ list of listings admin schema
# -----------------------------
class AdminListingListItem(BaseModel):
    id: int
    title: str

    created_at: datetime

    # 📊 Click statisztikák
    listing_clicks: int
    social_clicks: int

    class Config:
        from_attributes = True




# -----------------------------
# ✅ listing details admin schema
# -----------------------------
class AdminListingDetail(BaseModel):
    # ---------------------------------------
    # 🧾 Alapadatok
    # ---------------------------------------
    id: int
    title: str
    description: str
    status: ListingStatus

    created_at: datetime
    approved_at: Optional[datetime]
    published_at: Optional[datetime]
    visibility_until: Optional[datetime]

    # ---------------------------------------
    # 👤 User / kategória
    # ---------------------------------------
    user_id: int
    user_email: str

    main_category: Optional[str]
    sub_category: Optional[str]

    # ---------------------------------------
    # 🖼️ Képek
    # ---------------------------------------
    image_url_list: List[str]

    # ---------------------------------------
    # 🏢 Üzleti és elérhetőségi adatok
    # ---------------------------------------
    company: Optional[str]
    email: Optional[str]
    phone_number: Optional[str]
    website: Optional[str]
    whatsapp: Optional[str]
    instagram: Optional[str]
    tiktok: Optional[str]
    facebook: Optional[str]
    youtube: Optional[str]
    location: Optional[str]
    tags: Optional[List[str]]  # JSONB (lista / dict)

    # ---------------------------------------
    # 🧠 Admin
    # ---------------------------------------
    admin_comment: Optional[str]

    # ---------------------------------------
    # 📊 Click counterek
    # ---------------------------------------
    click_counter: int
    click_counter_featured: int

    click_website: int
    click_email: int
    click_phone: int
    click_whatsapp: int
    click_instagram: int
    click_tiktok: int
    click_facebook: int
    click_youtube: int

    class Config:
        from_attributes = True




# -----------------------------
# ✅ listing details admin schema
# -----------------------------
class AdminFeaturedListingSchema(BaseModel):
    id: int
    title: str
    is_featured: bool

