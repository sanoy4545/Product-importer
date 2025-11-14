from warnings import filters
from sqlalchemy import Column, String, Boolean, Integer, select, and_, delete, update

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
    
    # get with pagination
    async def get_paginated(self, conditions: dict = None, page: int = 1, page_size: int = 10):
        query = select(self.model)
        filter_conditions = []
        if conditions:
            for key, value in conditions.items():
                if not hasattr(self.model, key) or value is None:
                    continue
                attr = getattr(self.model, key)
                # Try to detect column type; if it's a String use LIKE/ILIKE
                try:
                    col_type = attr.property.columns[0].type
                except Exception:
                    col_type = None

                if isinstance(col_type, String):
                    # if the caller provided '%' patterns, use them as-is; otherwise do prefix match
                    pattern = value if (isinstance(value, str) and '%' in value) else f"{value}%"
                    # use case-insensitive match
                    filter_conditions.append(attr.ilike(pattern))
                else:
                    filter_conditions.append(attr == value)
        if filter_conditions:
            query = query.where(and_(*filter_conditions))
        total_result = await self.session.execute(query)
        total_count = len(total_result.scalars().all())
        query = query.offset((page - 1) * page_size).limit(page_size)
        result = await self.session.execute(query)
        items = result.scalars().all()
        return {"items": items, "total": total_count, "page": page, "page_size": page_size}

    async def get(self, conditions: dict = None):
        query = select(self.model)
        filter_conditions = []
        if conditions:
            for key, value in conditions.items():
                if not hasattr(self.model, key) or value is None:
                    continue
                attr = getattr(self.model, key)
                try:
                    col_type = attr.property.columns[0].type
                except Exception:
                    col_type = None

                if isinstance(col_type, String):
                    pattern = value if (isinstance(value, str) and '%' in value) else f"{value}%"
                    filter_conditions.append(attr.ilike(pattern))
                else:
                    filter_conditions.append(attr == value)
        if filter_conditions:
            query = query.where(and_(*filter_conditions))
        result = await self.session.execute(query)
        return result.scalars().all()

    async def update(self, filter_conditions: dict, data: dict ):
        query = (
            update(self.model)
            .where(and_(*[getattr(self.model, key) == value for key, value in filter_conditions.items()]))
            .values(**data)
        )
        result = await self.session.execute(query)
        await self.session.commit()
        return result.rowcount > 0

    async def delete(self, conditions: dict):
        result = await self.session.execute(select(self.model).where(and_(*[getattr(self.model, key) == value for key, value in conditions.items()])))
        filter_conditions = [getattr(self.model, key) == value for key, value in conditions.items() if hasattr(self.model, key) and value is not None]
        query = select(self.model)
        if filter_conditions:
            query = query.where(and_(*filter_conditions))
            result = await self.session.execute(query)
        to_delete = result.scalars().all()
        for item in to_delete:
            await self.session.delete(item)
        await self.session.commit()
        return len(to_delete)
    
    async def delete_all(self):
        result = await self.session.execute(select(self.model))
        results = result.scalars().all()
        for result in results:    
            await self.session.delete(result)
        await self.session.commit()