from pydantic import BaseModel

class CreateProductRequest(BaseModel):
    sku: str
    name: str
    description: str
    active: bool = True