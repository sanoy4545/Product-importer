from pydantic import BaseModel

class CreateProductDTO(BaseModel):
    sku: str
    name: str
    description: str
    active: bool = True