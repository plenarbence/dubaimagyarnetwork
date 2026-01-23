from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status

from backend.models.listing import Listing
from backend.models.category import Category


async def update_listing_category(
    db: AsyncSession,
    listing_id: int,
    child_category_id: int,
) -> None:
    # listing
    res = await db.execute(
        select(Listing).where(Listing.id == listing_id)
    )
    listing: Listing | None = res.scalar_one_or_none()

    if listing is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found",
        )

    # category (child)
    res = await db.execute(
        select(Category).where(Category.id == child_category_id)
    )
    category: Category | None = res.scalar_one_or_none()

    if category is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid category",
        )

    # guard: csak CHILD mehet fel
    if category.parent_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Main category cannot be assigned directly",
        )

    listing.category_id = category.id
    await db.commit()
