from sqlalchemy import Column, String, Boolean, Integer, select, and_, delete

class BaseRepository:
    def __init__(self, session, model):
        self.session = session
        self.model = model


    async def create(self, data: dict):
        new_row = self.model(**data)
        self.session.add(new_row)
        await self.session.commit()
        await self.session.refresh(new_row)
        return True

    async def get(self, conditions: dict = None):
        query = select(self.model)
        if conditions:
            filter_conditions = [getattr(self.model, key) == value for key, value in conditions.items() if hasattr(self.model, key) and value is not None]
        if filter_conditions:
            query = query.where(and_(*filter_conditions))
        result = await self.session.execute(query)
        return result.scalars().all()

    async def update(self, sku, name=None, description=None, active=None):
        result = await self.session.execute(select(self.model).where(self.model.sku == sku))
        product = result.scalar_one_or_none()
        if product:
            if name is not None:
                product.name = name
            if description is not None:
                product.description = description
            if active is not None:
                product.active = active
            await self.session.commit()
        await self.session.refresh(product)
        return product

    async def delete(self, sku):
        result = await self.session.execute(select(self.model).where(self.model.sku == sku))
        deleted = result.scalar_one_or_none()
        if deleted:
            await self.session.delete(deleted)
            await self.session.commit()
        return deleted

    async def delete_all(self):
        result = await self.session.execute(select(self.model))
        results = result.scalars().all()
        for result in results:    
            await self.session.delete(result)
        await self.session.commit()