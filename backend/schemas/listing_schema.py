from datetime import datetime
from typing import Optional, List, Annotated
from pydantic import BaseModel, Field, StringConstraints
from backend.models.listing import ListingStatus
from backend.schemas.image_schema import ImageResponse
from backend.schemas.rating_schema import RatingResponse, PublicRatingOut
from backend.schemas.category_schema import CategoryOut





# ===========================
# ✅ Tag típusdefiníció (max 40 karakter)
# ===========================
TagStr = Annotated[str, StringConstraints(max_length=40)]


# ===========================
# ✅ Input schema – új listing létrehozása
# ===========================
class ListingCreate(BaseModel):
    title: str = Field(..., max_length=70)
    description: str = Field(..., max_length=1000) 

    # opcionális /adatok
    email: Optional[str] = Field(None, max_length=255)
    phone_number: Optional[str] = Field(None, max_length=50)
    website: Optional[str] = Field(None, max_length=255)
    whatsapp: Optional[str] = Field(None, max_length=100)
    instagram: Optional[str] = Field(None, max_length=255)
    tiktok: Optional[str] = Field(None, max_length=255)
    facebook: Optional[str] = Field(None, max_length=255)
    youtube: Optional[str] = Field(None, max_length=255)
    location: Optional[str] = Field(None, max_length=255)
    company: Optional[str] = Field(None, max_length=255)

    tags: Optional[List[TagStr]] = Field(
        default=None,
        max_items=5,
        description="Opcionális kulcsszavak (max 5 db, max 40 karakter)"
    )

    category_id: Optional[int] = None




# ===========================
# ✅ Output schema – válasz a kliensnek
# ===========================
class ListingResponse(BaseModel):
    # -----------------------------
    # Alapadatok
    # -----------------------------
    id: int
    title: str
    description: str

    created_at: datetime
    approved_at: Optional[datetime] = None
    published_at: Optional[datetime] = None
    visibility_until: Optional[datetime] = None

    # státusz + admin info
    status: ListingStatus
    admin_comment: Optional[str] = Field(None, max_length=500)
    admin_featured: bool

    # -----------------------------
    # Kapcsolatok
    # -----------------------------
    user_id: int
    category: Optional[CategoryOut] = None


    # -----------------------------
    # Elérhetőségek / adatok
    # -----------------------------
    email: Optional[str] = None
    phone_number: Optional[str] = None
    website: Optional[str] = None
    whatsapp: Optional[str] = None
    instagram: Optional[str] = None
    tiktok: Optional[str] = None
    facebook: Optional[str] = None
    youtube: Optional[str] = None
    location: Optional[str] = None

    company: Optional[str] = None
    tags: Optional[List[str]] = None

    # -----------------------------
    # Médiai elemek
    # -----------------------------
    images: List[ImageResponse] = []
    
    # -----------------------------
    # Rating lista (user review-k)
    # -----------------------------
    ratings: List[RatingResponse] = []

    # -----------------------------
    # Featured adatok
    # -----------------------------
    featured_from: Optional[datetime] = None
    featured_until: Optional[datetime] = None
    is_featured: bool

    # -----------------------------
    # Click counterek
    # -----------------------------
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




# ===========================
# ✅ Output schema – CREATE listing
# ===========================
class ListingCreateResponse(BaseModel):
    id: int
    status: ListingStatus
    category_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True



# ===========================
# ✅ Output schema – MY listings (listázó / kártya nézet)
# ===========================
class MyListingResponse(BaseModel):
    # -----------------------------
    # Alapadatok
    # -----------------------------
    id: int
    title: str
    status: ListingStatus

    # -----------------------------
    # Opcionális tagek
    # -----------------------------
    tags: Optional[List[str]] = None

    # -----------------------------
    # Rating (aggregált adatok)
    # -----------------------------
    rating_avg: Optional[float] = None
    rating_count: int = 0

    # -----------------------------
    # Main image url
    # -----------------------------
    main_image_url: Optional[str] = None

    class Config:
        from_attributes = True





# ===========================
# ✅ Output schema – preview
# ===========================
class ListingPreviewResponse(BaseModel):
    # ---- alap ----
    title: str
    description: str
    status: ListingStatus

    # ---- üzleti / kontakt ----
    company: Optional[str] = None
    email: Optional[str] = None
    phone_number: Optional[str] = None
    website: Optional[str] = None
    whatsapp: Optional[str] = None
    instagram: Optional[str] = None
    tiktok: Optional[str] = None
    facebook: Optional[str] = None
    youtube: Optional[str] = None
    location: Optional[str] = None
    tags: Optional[List[str]] = None

    # ---- rating (aggregált) ----
    rating_avg: Optional[float] = None
    rating_count: int = 0

    # ---- képek ----
    image_url_list: List[str] = []

    # ---- admin visszajelzés ----
    admin_comment: Optional[str] = None

    class Config:
        from_attributes = True



# ===========================
# ✅ Output schema –  public listazo kartya
# ===========================
class MyPublicListingCard(BaseModel):
    # -----------------------------
    # Alapadatok
    # -----------------------------
    id: int
    title: str

    # -----------------------------
    # Opcionális tagek
    # -----------------------------
    tags: Optional[List[str]] = None

    # -----------------------------
    # Rating (aggregált adatok)
    # -----------------------------
    rating_avg: Optional[float] = None
    rating_count: int = 0

    # -----------------------------
    # Main image url
    # -----------------------------
    main_image_url: Optional[str] = None

    is_featured: bool

    class Config:
        from_attributes = True





# ===========================
# ✅ Output schema –  public listing page
# ===========================
class PublicListingDetailOut(BaseModel):
    # ---- alap ----
    title: str
    description: str

    # ---- üzleti / kontakt ----
    company: str | None = None
    email: str | None = None
    phone_number: str | None = None
    website: str | None = None
    whatsapp: str | None = None
    instagram: str | None = None
    tiktok: str | None = None
    facebook: str | None = None
    youtube: str | None = None
    location: str | None = None
    tags: List[str] | None = None

    # ---- rating (aggregált) ----
    rating_avg: float | None = None
    rating_count: int = 0

    # ---- képek ----
    image_url_list: List[str] = []

    # ---- rating lista ----
    ratings_list: List[PublicRatingOut] = []

    class Config:
        from_attributes = True