from pydantic import BaseModel
from typing import Optional

class CreateProductDTO(BaseModel):
    sku: str
    name: str
    description: str
    active: bool = True

class GetProductsDTO(BaseModel):
    sku: str | None = None
    name: str | None = None
    description: str | None = None
    active: bool | None = None
    limit: int = 10
    page: int = 1

class UpdateProductDTO(BaseModel):
    sku: str
    name: str | None = None
    description: str | None = None
    active: bool | None = None

class DeleteProductDTO(BaseModel):
    sku: str

class CreateWebhookDTO(BaseModel):
    url: str
    event_type: str
    enabled: Optional[bool] = True

class GetWebhooksDTO(BaseModel):
    limit: int = 10
    page: int = 1

class UpdateWebhookDTO(BaseModel):
    id: int
    url: Optional[str] = None
    event_type: Optional[str] = None
    enabled: Optional[bool] = None

class TestWebhookDTO(BaseModel):
    id: int

class DeleteWebhookDTO(BaseModel):
    id: int

class EnableWebhookDTO(BaseModel):
    id: int
    enabled: bool

class TestWebhookDTO(BaseModel):
    id: int
   