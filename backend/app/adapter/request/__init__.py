from pydantic import BaseModel
from typing import Optional

class CreateProductRequest(BaseModel):
    sku: str
    name: str
    description: str
    active: bool = True

class filterproduct(BaseModel):
    id: int | None = None
    sku: str | None = None
    name: str | None = None
    active: bool | None = None
class GetProductsRequest(filterproduct):
    limit: int = 10
    page: int = 1

class UpdateProductRequest(BaseModel):
    sku: str
    name: str | None = None
    description: str | None = None
    active: bool | None = None

class DeleteProductRequest(BaseModel):
    sku: str

class CreateWebhookRequest(BaseModel):
    url: str
    event_type: str
    enabled: bool = True

class filterhook(BaseModel):
    id: int | None = None
    url: str | None = None
    event_type: str | None = None
    enabled: bool | None = None
class GetWebhooksRequest(filterhook):
    limit: int = 10
    page: int = 1

class UpdateWebhookRequest(BaseModel):
    id: int
    url: str | None = None
    event_type: str | None = None
    enabled: bool | None = None

class DeleteWebhookRequest(BaseModel):
    id: int 

class EnableWebhookRequest(BaseModel):
    id: int
    enabled: bool

class TestWebhookRequest(BaseModel):
    id: int