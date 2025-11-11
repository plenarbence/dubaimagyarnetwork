# backend/routes/content_logic/update_content.py

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
from backend.models.content import Content
from backend.schemas.content_schema import ContentUpdate


async def update_content_logic(key: str, data: ContentUpdate, db: AsyncSession):
    """
    Frissíti vagy létrehozza a megadott kulcsú (key) content bejegyzést.
    Ha a key nem létezik, új sort hoz létre.
    """
    result = await db.execute(select(Content).filter(Content.key == key))
    content = result.scalars().first()

    if not content:
        # ha még nincs, létrehozzuk
        content = Content(key=key, value=data.value)
        db.add(content)
    else:
        # ha már létezik, frissítjük
        content.value = data.value

    try:
        await db.commit()
        await db.refresh(content)
        db.expunge(content)
    except Exception:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error while updating content.",
        )

    return {"key": content.key, "value": content.value}
