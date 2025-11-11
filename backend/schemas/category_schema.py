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

    class Config:
        from_attributes = True


