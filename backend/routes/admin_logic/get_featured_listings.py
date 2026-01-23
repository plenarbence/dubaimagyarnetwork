# backend/routes/admin_logic/get_featured_listings.py

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.models.listing import Listing, ListingStatus
from backend.schemas.admin_schema import AdminFeaturedListingSchema


async def get_featured_listings(
    db: AsyncSession,
) -> list[AdminFeaturedListingSchema]:
    """
    Admin helper:
    - minden ACTIVE listing
    - admin_featured flag alapján
    """

    stmt = (
        select(
            Listing.id,
            Listing.title,
            Listing.admin_featured,
        )
        .where(Listing.status == ListingStatus.active)
        .order_by(Listing.created_at.desc())
    )

    result = await db.execute(stmt)
    rows = result.all()

    return [
        AdminFeaturedListingSchema(
            id=row.id,
            title=row.title,
            is_featured=row.admin_featured,
        )
        for row in rows
    ]

