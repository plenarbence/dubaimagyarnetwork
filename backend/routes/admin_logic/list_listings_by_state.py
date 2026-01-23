from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.models.listing import Listing, ListingStatus
from backend.schemas.admin_schema import AdminListingListItem


async def list_admin_listings_by_state(
    db: AsyncSession,
    state: ListingStatus,
) -> list[AdminListingListItem]:
    """
    Admin listing lista adott státuszra szűrve,
    created_at DESC szerint rendezve.
    """

    stmt = (
        select(
            Listing.id,
            Listing.title,
            Listing.created_at,
            Listing.click_counter.label("listing_clicks"),
            (
                Listing.click_website
                + Listing.click_email
                + Listing.click_phone
                + Listing.click_whatsapp
                + Listing.click_instagram
                + Listing.click_tiktok
                + Listing.click_facebook
                + Listing.click_youtube
            ).label("social_clicks"),
        )
        .where(Listing.status == state)
        .order_by(Listing.created_at.desc())
    )

    result = await db.execute(stmt)
    rows = result.all()

    return [
        AdminListingListItem(
            id=row.id,
            title=row.title,
            created_at=row.created_at,
            listing_clicks=row.listing_clicks,
            social_clicks=row.social_clicks,
        )
        for row in rows
    ]
