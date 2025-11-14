from time import time
from app.domain.usecase.product_usecase import ProductUseCase, WebhookUseCase
from app.domain.entities.product_entity import Product, Webhook
from app.application.dto import CreateProductDTO, DeleteProductDTO, DeleteWebhookDTO, EnableWebhookDTO, EnableWebhookDTO, TestWebhookDTO, UpdateProductDTO, UpdateWebhookDTO, CreateWebhookDTO, GetWebhooksDTO, GetProductsDTO
from core.db.base_repo import BaseRepository
from sqlalchemy.ext.asyncio import AsyncSession
from core.helpers.url import is_valid_url
import httpx
from app.application.exceptions import ProductNotFoundException,WebhookNotFoundException

class ProductService(ProductUseCase):
    def __init__(self,db: AsyncSession):
        self.repository = BaseRepository(session=db, model=Product)

    async def create_product(self, dto: CreateProductDTO) -> bool:
        return await self.repository.create(data=dto.model_dump())

    async def get_products(self, dto: GetProductsDTO) -> list[Product]:
        return await self.repository.get_paginated(conditions=dto.model_dump(exclude_unset=True, exclude={"limit", "page"}), page_size=dto.limit, page=dto.page)

    async def update_product(self, dto: UpdateProductDTO) -> bool:
        item_exists = await self.repository.get({"sku": dto.sku})
        if not item_exists:
            raise ProductNotFoundException()
        return await self.repository.update(filter_conditions={"sku": dto.sku}, data=dto.model_dump(exclude_unset=True, exclude={"sku"}))

    async def delete_product(self, dto: DeleteProductDTO) -> Product:
        item_exists = await self.repository.get({"sku": dto.sku})
        if not item_exists:
            raise ProductNotFoundException()
        return await self.repository.delete({"sku": dto.sku})

    async def delete_all_products(self) -> None:
        return await self.repository.delete_all()


class WebhookService(WebhookUseCase):
    
    def __init__(self, db: AsyncSession):
        self.repository = BaseRepository(session=db, model=Webhook)

    async def create_webhook(self, dto: CreateWebhookDTO) -> None:
        valid_url = is_valid_url(dto.url)
        if not valid_url:
            raise ValueError("Invalid URL format")
        return await self.repository.create(data=dto.model_dump())

    async def get_webhooks(self, dto: GetWebhooksDTO) -> list[Webhook]:
        return await self.repository.get_paginated(conditions=dto.model_dump(exclude_unset=True, exclude={"limit", "page"}), page_size=dto.limit, page=dto.page)    
    
    async def update_webhook(self, dto: UpdateWebhookDTO) -> None:
        item_exists = await self.repository.get({"id": dto.id})
        if not item_exists:
            raise WebhookNotFoundException()
        return await self.repository.update(filter_conditions={"id": dto.id}, data=dto.model_dump(exclude_unset=True, exclude={"id"}))
    
    async def delete_webhook(self, dto: DeleteWebhookDTO) -> None:
        item_exists = await self.repository.get({"id": dto.id})
        if not item_exists:
            raise WebhookNotFoundException()
        return await self.repository.delete({"id": dto.id})
    
    async def enable_webhook(self, dto: EnableWebhookDTO) -> None:
        item_exists = await self.repository.get({"id": dto.id})
        if not item_exists:
            raise WebhookNotFoundException()
        return await self.repository.update(filter_conditions={"id": dto.id}, data=dto.model_dump(exclude_unset=True, exclude={"id"}))
    
    async def test_webhook(self, dto: TestWebhookDTO) -> dict:
        webhook=(await self.repository.get({"id": dto.id}))
        if not webhook:
            raise WebhookNotFoundException()
        start= time()
        async with httpx.AsyncClient() as client:
            response = await client.post(webhook.url, json={"test": True})
        elapsed = time() - start
        # Optionally update last_response_code and last_response_time
        await self.repository.update({"id": dto.id}, {"last_response_code": response.status_code, "last_response_time": elapsed})
        return {"response_code": response.status_code, "response_time": elapsed}
    