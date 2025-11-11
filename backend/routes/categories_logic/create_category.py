from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status

from backend.models.category import Category
from backend.schemas.category_schema import CategoryCreate, CategoryOut


async def create_category_logic(data: CategoryCreate, db: AsyncSession) -> CategoryOut:
    """
    Új kategória létrehozása (max 2 szint engedélyezett).
    """

    # --- 1️⃣ Névnél duplikáció ellenőrzés ---
    existing = await db.execute(select(Category).where(Category.name == data.name.strip()))
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ez a kategórianév már létezik."
        )


    # --- 1️⃣ Ha van parent_id, validáljuk, hogy a parent ne legyen alkategória ---
    if data.parent_id:
        parent_result = await db.execute(
            select(Category).where(Category.id == data.parent_id)
        )
        parent = parent_result.scalar_one_or_none()

        if not parent:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="A megadott parent kategória nem létezik."
            )

        if parent.parent_id is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Nem lehet alkategóriának újabb alkategóriája."
            )

    # --- 2️⃣ Kategória létrehozása ---
    new_cat = Category(
        name=data.name.strip(),
        parent_id=data.parent_id,
        order_index=data.order_index or 0,
    )

    db.add(new_cat)
    await db.commit()
    await db.refresh(new_cat)
    db.expunge(new_cat)

    return CategoryOut.model_validate(new_cat)
