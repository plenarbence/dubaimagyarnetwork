from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.models.category import Category
from backend.schemas.category_schema import CategorySEOSchema


async def get_main_categories_seo(
    db: AsyncSession,
) -> list[CategorySEOSchema]:
    """
    Admin helper:
    - összes main category (parent_id IS NULL)
    - SEO mezőkkel együtt
    """

    stmt = (
        select(Category)
        .where(Category.parent_id.is_(None))
        .order_by(Category.order_index)
    )

    result = await db.execute(stmt)
    categories = result.scalars().all()

    return [
        CategorySEOSchema.model_validate(cat)
        for cat in categories
    ]
