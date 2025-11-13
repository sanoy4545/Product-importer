from app.domain.usecase.product_usecase import ProductUseCase
from app.domain.entities.product_entity import Product
from app.application.dto import CreateProductDTO, DeleteProductDTO, UpdateProductDTO
from core.db.base_repo import BaseRepository
from sqlalchemy.ext.asyncio import AsyncSession
from app.application.exceptions import ProductNotFoundException

class ProductService(ProductUseCase):
    def __init__(self,db: AsyncSession):
        self.repository = BaseRepository(session=db, model=Product)

    async def create_product(self, dto: CreateProductDTO) -> bool:
        return await self.repository.create(data=dto.model_dump())

    async def get_products(self, dto) -> list[Product]:
        # Implementation for retrieving products
        pass    

    async def update_product(self, dto: UpdateProductDTO) -> bool:
        item_exists = await self.repository.get({"sku": dto.sku})
        if not item_exists:
            raise ProductNotFoundException()
        return await self.repository.update(filter_conditions={"sku": dto.sku}, data=dto.model_dump(exclude_unset=True, exclude={"sku"}))

    async def delete_product(self, dto: DeleteProductDTO) -> Product:
        item_exists = await self.repository.get({"sku": dto.sku})
        if not item_exists:
            raise ProductNotFoundException()
        return await self.repository.delete(dto.sku)

    async def delete_all_products(self) -> None:
        return await self.repository.delete_all()
    