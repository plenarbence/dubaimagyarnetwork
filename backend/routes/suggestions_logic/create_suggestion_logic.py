from sqlalchemy.ext.asyncio import AsyncSession

from backend.models.suggestion import Suggestion
from backend.schemas.suggestion_schema import SuggestionCreate


async def create_suggestion_logic(
    db: AsyncSession,
    payload: SuggestionCreate,
) -> None:
    suggestion = Suggestion(
        text=payload.text,
    )

    db.add(suggestion)
    await db.commit()
