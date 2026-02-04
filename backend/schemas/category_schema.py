from pydantic import BaseModel, Field
from typing import Optional, List


# --- Admin input (POST / PUT) ---
class CategoryCreate(BaseModel):
    """
    Admin kategória létrehozásához vagy módosításához.
    Max 2 szint engedélyezett (főkategória + alkategória).
    """
    name: str = Field(..., example="Szolgáltatások")
    parent_id: Optional[int] = Field(None, example=None)
    order_index: int = Field(0, example=0)


# --- Egyszerű kimenet (admin / public lista) ---
class CategoryOut(BaseModel):
    """
    Egyszerű kategória-válasz (id, név, parent, sorrend).
    """
    id: int
    name: str
    parent_id: Optional[int]
    order_index: int
    listing_count: Optional[int] = None

    class Config:
        from_attributes = True

# scheme rename-hez
class CategoryRename(BaseModel):
    name: str = Field(..., min_length=1)


# publikus kategoria lekeres
class PublicCategoryOut(BaseModel):
    id: int
    name: str
    slug: str
    listing_count: int


# SEO schema
class CategorySEOSchema(BaseModel):
    id: int
    name: str
    slug: str

    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    seo_h1: Optional[str] = None
    seo_intro: Optional[str] = None

    class Config:
        from_attributes = True


# publikus sub-kategoria lekeres
class PublicSubCategoryOut(BaseModel):
    id: int
    name: str
    listing_count: int

# counters
class PublicSubCategoryResponse(BaseModel):
    subcategories: List[PublicSubCategoryOut]
    main_count: int

