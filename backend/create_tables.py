import asyncio
from core.db.session import engine, Base
import app.domain.entities.product_entity
# Import all your models/entities here

async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

asyncio.run(create_tables())