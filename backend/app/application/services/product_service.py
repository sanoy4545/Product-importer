from app.domain.usecase.product_usecase import ProductUseCase
from app.domain.entities.product_entity import Product
from app.application.dto import CreateProductDTO
from core.db.base_repo import BaseRepository
from sqlalchemy.ext.asyncio import AsyncSession

class ProductService(ProductUseCase):
    def __init__(self,db: AsyncSession):
        self.repository = BaseRepository(session=db, model=Product)

    async def create_product(self, dto:CreateProductDTO) -> Product:
        return await self.repository.create(data=dto.model_dump())

    async def get_products(self, dto) -> list[Product]:
        # Implementation for retrieving products
        pass    

    async def update_product(self, sku: str, dto) -> Product:
        # Implementation for updating a product
        pass

    async def delete_product(self, dto) -> Product:
        # Implementation for deleting a product
        pass    

    async def delete_all_products(self) -> None:
        # Implementation for deleting all products
        pass
    