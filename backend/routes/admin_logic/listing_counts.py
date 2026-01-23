from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from backend.models import Listing


# az admin oldalon használt fix státuszlista
ADMIN_LISTING_STATES = [
    "pending_admin",
    "awaiting_payment",
    "rejected",
    "active",
    "draft",
    "expired",
]




async def get_listing_state_counts(
    db: AsyncSession,
) -> dict[str, int]:
    """
    Visszaadja az admin listing státuszok darabszámát.

    Output példa:
    {
        "pending_admin": 12,
        "awaiting_payment": 4,
        "rejected": 3,
        "active": 128,
        "draft": 9,
        "expired": 21
    }
    """

    stmt = (
        select(
            Listing.status,
            func.count(Listing.id).label("count"),
        )
        .group_by(Listing.status)
    )

    result = await db.execute(stmt)
    rows = result.all()

    # default 0 minden státuszra
    counts: dict[str, int] = {
        state: 0 for state in ADMIN_LISTING_STATES
    }

    # DB-ből jövő értékek felülírják
    for status, count in rows:
        if status in counts:
            counts[status] = count

    return counts
