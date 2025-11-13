from pydantic import BaseModel

class CreateProductRequest(BaseModel):
    sku: str
    name: str
    description: str
    active: bool = True

class UpdateProductRequest(BaseModel):
    sku: str
    name: str | None = None
    description: str | None = None
    active: bool | None = None

class DeleteProductRequest(BaseModel):
    sku: str