from pydantic import BaseModel, ConfigDict

class CreateProductResponse(BaseModel):
    message: str
    status: bool

class UpdateProductResponse(CreateProductResponse):
    pass

class DeleteProductResponse(CreateProductResponse):
    pass

class DeleteAllProductsResponse(CreateProductResponse):
    pass

class UploadResponse(BaseModel):
    task_id: str
    message: str

class ProgressResponse(BaseModel):
    task_id: str
    status: str
    result: str | None = None

class WebhookCreationResponse(BaseModel):
    success: bool
    message: str

class WebhookEditResponse(WebhookCreationResponse):
    pass

class WebhookDeletionResponse(WebhookCreationResponse):
    pass

class EnableWebhookResponse(WebhookCreationResponse):
    pass

class PageResponse(BaseModel):
    items: list
    total: int
    page: int
    page_size: int

class ProductResponse(BaseModel):
    id: int
    sku: str
    name: str
    description: str
    active: bool
    model_config = ConfigDict(from_attributes=True)

class WebhookResponse(BaseModel):
    id: int
    url: str
    event_type: str
    enabled: bool
    model_config = ConfigDict(from_attributes=True)
    