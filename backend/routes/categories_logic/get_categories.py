from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from backend.models.category import Category
from backend.schemas.category_schema import CategoryOut


async def get_categories_logic(db: AsyncSession) -> list[CategoryOut]:
    """
    Összes kategória lekérése, parent_id és order_index szerint rendezve.
    """

    result = await db.execute(
        select(Category).order_by(Category.parent_id, Category.order_index)
    )
    categories = result.scalars().all()

    return [CategoryOut.model_validate(cat) for cat in categories]

