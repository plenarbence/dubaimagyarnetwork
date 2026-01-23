from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import aliased

from backend.models.category import Category
from backend.models.listing import Listing
from backend.schemas.category_schema import PublicCategoryOut


async def public_get_main_categories(db: AsyncSession) -> list[PublicCategoryOut]:
    """
    Publikus főkategóriák lekérése aktív hirdetések számával
    (főkategória + összes alkategória).
    """

    ChildCategory = aliased(Category)

    stmt = (
        select(
            Category,
            func.count(Listing.id).label("listing_count"),
        )
        .outerjoin(
            ChildCategory,
            ChildCategory.parent_id == Category.id,
        )
        .outerjoin(
            Listing,
            (
                ((Listing.category_id == Category.id) |
                (Listing.category_id == ChildCategory.id))
                & (Listing.status == "active")
            ),
        )
        .where(Category.parent_id.is_(None))
        .group_by(Category.id)
        .order_by(Category.order_index.asc())
    )


    result = await db.execute(stmt)
    rows = result.all()

    return [
        PublicCategoryOut(
            id=cat.id,
            name=cat.name,
            slug=cat.slug,
            listing_count=listing_count,
        )
        for cat, listing_count in rows
    ]
