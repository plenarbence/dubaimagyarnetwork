from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from backend.models.user import User


async def list_users_logic(db: AsyncSession):
    result = await db.execute(select(User).order_by(User.created_at.desc()))

    users = result.scalars().all()
    for user in users:
        db.expunge(user)
    return users


