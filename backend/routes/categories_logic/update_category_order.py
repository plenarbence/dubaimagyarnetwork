from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from backend.models.category import Category


async def update_category_order_logic(cat_id: int, new_order: int, db: AsyncSession) -> None:
    """
    Kategória sorrend (order_index) módosítása.
    """

    # --- 1️⃣ Kategória lekérése ---
    result = await db.execute(select(Category).where(Category.id == cat_id))
    category = result.scalar_one_or_none()

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found."
        )

    # --- 2️⃣ Érték validálása ---
    if new_order < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order index cannot be negative."
        )

    # --- 3️⃣ Módosítás és mentés ---
    category.order_index = new_order
    await db.commit()
    await db.refresh(category)
