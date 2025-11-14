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

class WebhookUseCase(ABC):

    @abstractmethod
    async def create_webhook(self, dto: DTO) -> None:
        """Create a new webhook."""
        pass

    @abstractmethod
    async def get_webhooks(self, dto: DTO) -> list:
        """Retrieve webhooks based on conditions."""
        pass    

    @abstractmethod
    async def update_webhook(self, id: int, dto: DTO) -> None:
        """Update an existing webhook."""
        pass

    @abstractmethod
    async def delete_webhook(self, id: int) -> None:
        """Delete a webhook by ID."""
        pass

    @abstractmethod
    async def enable_webhook(self, id: int, enabled: bool) -> None:
        """Enable or disable a webhook."""
        pass

    @abstractmethod
    async def test_webhook(self, id: int) -> dict:
        """Test a webhook by ID."""
        pass