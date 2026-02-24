from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from backend.models import User, Listing, Rating


ACTIVE_STATUS = "active"


async def get_public_stats(
    db: AsyncSession,
) -> dict[str, int]:
    """
    Public platform stats.

    - users: összes user
    - listings: csak active listingek
    - ratings: csak active listinghez tartozó ratingek
    - listing_clicks: csak active listing click_counter összege
    - contact_clicks: csak active listingek contact click összege
    """

    # -------------------------
    # Users (összes)
    # -------------------------
    users_stmt = select(func.count()).select_from(User)
    users_result = await db.execute(users_stmt)
    users_count = users_result.scalar() or 0

    # -------------------------
    # Active listings count
    # -------------------------
    listings_stmt = (
        select(func.count())
        .select_from(Listing)
        .where(Listing.status == ACTIVE_STATUS)
    )
    listings_result = await db.execute(listings_stmt)
    listings_count = listings_result.scalar() or 0

    # -------------------------
    # Ratings (JOIN active listings)
    # -------------------------
    ratings_stmt = (
        select(func.count())
        .select_from(Rating)
        .join(Listing, Rating.listing_id == Listing.id)
        .where(Listing.status == ACTIVE_STATUS)
    )
    ratings_result = await db.execute(ratings_stmt)
    ratings_count = ratings_result.scalar() or 0

    # -------------------------
    # Listing clicks (active only)
    # -------------------------
    listing_clicks_stmt = (
        select(func.coalesce(func.sum(Listing.click_counter), 0))
        .where(Listing.status == ACTIVE_STATUS)
    )
    listing_clicks_result = await db.execute(listing_clicks_stmt)
    listing_clicks = listing_clicks_result.scalar() or 0

    # -------------------------
    # Contact clicks (active only)
    # -------------------------
    contact_clicks_stmt = (
        select(
            func.coalesce(
                func.sum(
                    Listing.click_website
                    + Listing.click_email
                    + Listing.click_phone
                    + Listing.click_whatsapp
                    + Listing.click_instagram
                    + Listing.click_tiktok
                    + Listing.click_facebook
                    + Listing.click_youtube
                ),
                0,
            )
        )
        .where(Listing.status == ACTIVE_STATUS)
    )
    contact_clicks_result = await db.execute(contact_clicks_stmt)
    contact_clicks = contact_clicks_result.scalar() or 0

    return {
        "users": users_count,
        "listings": listings_count,
        "ratings": ratings_count,
        "listing_clicks": listing_clicks,
        "contact_clicks": contact_clicks,
    }
