from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import update

from backend.models.listing import Listing


# ===========================
# ✅ Allowed click targets
# ===========================
CLICK_TARGET_COLUMN_MAP = {
    "listing": "click_counter",
    "listing_featured": "click_counter_featured",
    "website": "click_website",
    "email": "click_email",
    "phone": "click_phone",
    "whatsapp": "click_whatsapp",
    "instagram": "click_instagram",
    "tiktok": "click_tiktok",
    "facebook": "click_facebook",
    "youtube": "click_youtube",
}


async def listing_click_counter_logic(
    *,
    listing_id: int,
    target: str,
    db: AsyncSession,
) -> None:
    """
    Public listing click counter (best-effort).

    - target alapján kiválasztott counter +1
    - whitelistelt mezők
    - hiba esetén rollback + lenyelés
    """

    column_name = CLICK_TARGET_COLUMN_MAP.get(target)
    if not column_name:
        # ismeretlen target -> szándékosan lenyeljük
        return

    try:
        column = getattr(Listing, column_name)

        await db.execute(
            update(Listing)
            .where(Listing.id == listing_id)
            .values({column_name: column + 1})
        )
        await db.commit()

    except Exception:
        await db.rollback()
        return
