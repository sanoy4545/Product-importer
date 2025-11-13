from pydantic import BaseModel
class CreateProductResponse(BaseModel):
    message: str
    status: bool