from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status

from backend.models.category import Category


async def save_category_seo(
    db: AsyncSession,
    category_id: int,
    *,
    slug: str,
    seo_title: str | None,
    seo_description: str | None,
    seo_h1: str | None,
    seo_intro: str | None,
) -> None:
    """
    Admin helper:
    - main / child category SEO adatainak mentése
    - slug kötelező és unique
    """

    if not slug or not slug.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Slug is required",
        )

    # --- category exists ---
    result = await db.execute(
        select(Category).where(Category.id == category_id)
    )
    category = result.scalar_one_or_none()

    if category is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )

    # --- slug unique check (exclude self) ---
    result = await db.execute(
        select(Category).where(
            Category.slug == slug,
            Category.id != category_id,
        )
    )
    existing = result.scalar_one_or_none()

    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Slug already exists",
        )

    # --- update fields ---
    category.slug = slug
    category.seo_title = seo_title
    category.seo_description = seo_description
    category.seo_h1 = seo_h1
    category.seo_intro = seo_intro

    await db.commit()
