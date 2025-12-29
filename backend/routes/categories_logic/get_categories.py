from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from backend.models.category import Category
from backend.models.listing import Listing
from backend.schemas.category_schema import CategoryOut


async def get_categories_logic(db: AsyncSession) -> list[CategoryOut]:
    result = await db.execute(
        select(
            Category,
            func.count(Listing.id).label("listing_count"),
        )
        .outerjoin(Listing, Listing.category_id == Category.id)
        .group_by(Category.id)
        .order_by(Category.parent_id, Category.order_index)
    )

    rows = result.all()

    return [
        CategoryOut(
            id=cat.id,
            name=cat.name,
            parent_id=cat.parent_id,
            order_index=cat.order_index,
            listing_count=listing_count,
        )
        for cat, listing_count in rows
    ]
