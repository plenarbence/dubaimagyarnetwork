from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.models.profanity import Profanity


async def get_profanity_list(db: AsyncSession) -> list[str]:
    result = await db.execute(
        select(Profanity.text)
    )

    return [row.text for row in result.all()]
