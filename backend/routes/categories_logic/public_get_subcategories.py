from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from backend.models.category import Category
from backend.models.listing import Listing, ListingStatus
from backend.schemas.category_schema import PublicSubCategoryOut


async def public_get_subcategories(
    db: AsyncSession,
    parent_category_id: int,
) -> list[PublicSubCategoryOut]:
    """
    Alkategóriák lekérése egy főkategória alatt,
    aktív hirdetések számával.
    """

    stmt = (
        select(
            Category.id,
            Category.name,
            func.count(Listing.id).label("listing_count"),
        )
        .outerjoin(
            Listing,
            (Listing.category_id == Category.id)
            & (Listing.status == ListingStatus.active),
        )
        .where(Category.parent_id == parent_category_id)
        .group_by(Category.id, Category.name)
        .order_by(Category.order_index.asc())
    )

    result = await db.execute(stmt)
    rows = result.all()

    return [
        PublicSubCategoryOut(
            id=row.id,
            name=row.name,
            listing_count=row.listing_count or 0,
        )
        for row in rows
    ]
