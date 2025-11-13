from pydantic import BaseModel

class CreateProductDTO(BaseModel):
    sku: str
    name: str
    description: str
    active: bool = True

class UpdateProductDTO(BaseModel):
    sku: str
    name: str | None = None
    description: str | None = None
    active: bool | None = None

class DeleteProductDTO(BaseModel):
    sku: str