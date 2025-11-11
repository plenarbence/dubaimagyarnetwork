from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from backend.models.category import Category


async def update_category_name_logic(cat_id: int, new_name: str, db: AsyncSession) -> None:
    """
    Kategória nevének módosítása (duplikáció ellenőrzéssel).
    """

    # --- 1️⃣ Lekérjük a kategóriát ---
    result = await db.execute(select(Category).where(Category.id == cat_id))
    category = result.scalar_one_or_none()

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found."
        )

    # --- 2️⃣ Új név validálása ---
    new_name = new_name.strip()
    if not new_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category name cannot be empty."
        )

    # --- 3️⃣ Duplikáció ellenőrzése (kivéve saját magát) ---
    dup_check = await db.execute(
        select(Category).where(Category.name == new_name, Category.id != cat_id)
    )
    if dup_check.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ez a kategórianév már létezik."
        )

    # --- 4️⃣ Név frissítése ---
    category.name = new_name
    await db.commit()
    await db.refresh(category)
