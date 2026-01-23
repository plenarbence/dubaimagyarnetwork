from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status

from backend.models.category import Category
from backend.schemas.category_schema import CategorySEOSchema


async def get_category_by_slug(
    db: AsyncSession,
    slug: str,
) -> CategorySEOSchema:
    stmt = select(Category).where(Category.slug == slug)
    result = await db.execute(stmt)
    category = result.scalar_one_or_none()

    if category is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )

    return CategorySEOSchema.model_validate(category)
