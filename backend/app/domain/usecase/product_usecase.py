from abc import ABC, abstractmethod
from app.domain.entities.product_entity import Product
from core.dto.base_dto import DTO

class ProductUseCase(ABC):

    @abstractmethod
    async def create_product(self, dto: DTO) -> Product:
        """Create a new product."""
        pass

    @abstractmethod
    async def get_products(self, dto: DTO) -> list[Product]:
        """Retrieve products based on conditions."""
        pass    

    @abstractmethod
    async def update_product(self, sku: str, dto: DTO) -> Product:
        """Update an existing product."""
        pass

    @abstractmethod
    async def delete_product(self,  dto: DTO) -> Product:
        """Delete a product by SKU."""
        pass    

    @abstractmethod
    async def delete_all_products(self) -> None:
        """Delete all products."""
        pass