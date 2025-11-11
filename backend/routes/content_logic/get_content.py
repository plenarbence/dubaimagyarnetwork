# backend/routes/content_logic/get_content.py

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
from backend.models.content import Content


async def get_content_logic(key: str, db: AsyncSession):
    """
    Lekéri a megadott kulcsú (key) content bejegyzést.
    Ha nem létezik, 404 hibát dob.
    """
    result = await db.execute(select(Content).filter(Content.key == key))
    content = result.scalars().first()

    if not content:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Content not found")

    db.expunge(content)
    return {"key": content.key, "value": content.value}
