import pandas as pd
from app.domain.entities.product_entity import Product
from core.db.session import AsyncSessionLocal
from workers.celery_app import celery_app
from asgiref.sync import async_to_sync
from sqlalchemy import select

@celery_app.task
def process_csv(file_path):
    async def _process():
        async with AsyncSessionLocal() as db:
            df = pd.read_csv(file_path)
            for _, row in df.iterrows():
                sku = str(row["sku"]).strip().lower()
                result = await db.execute(
                    select(Product).where(Product.sku.ilike(sku))
                )
                existing = result.scalar_one_or_none()
                if existing:
                    existing.name = row["name"]
                    existing.description = row["description"]
                else:
                    db.add(Product(sku=sku, name=row["name"], description=row["description"]))
            await db.commit()
        return "CSV import completed"
    return async_to_sync(_process)()
