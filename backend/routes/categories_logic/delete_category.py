from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.models.category import Category
from backend.models.listing import Listing



async def delete_category_logic(cat_id: int, db: AsyncSession) -> None:
    """
    Kategória törlése (csak ha nincs alárendelt kategória).
    """

    # --- 1️⃣ Ellenőrizzük, hogy létezik-e a kategória ---
    result = await db.execute(select(Category).where(Category.id == cat_id))
    cat = result.scalar_one_or_none()

    if not cat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )

    # --- 2️⃣ Ellenőrizzük, hogy van-e alárendelt kategória ---
    child_result = await db.execute(
        select(Category).where(Category.parent_id == cat_id)
    )
    has_child = child_result.scalar_one_or_none()

    if has_child:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Cannot delete a parent category that has subcategories."
        )
    
    # --- 2️⃣/b Ellenőrizzük, hogy van-e hozzárendelt listing ---
    listing_result = await db.execute(
        select(Listing).where(Listing.category_id == cat_id)
    )
    has_listing = listing_result.scalar_one_or_none()

    if has_listing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Cannot delete category that has listings."
        )


    # --- 3️⃣ Törlés ---
    await db.delete(cat)
    await db.commit()
