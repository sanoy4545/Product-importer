from fastapi import APIRouter, UploadFile, File
from app.adapter import Routes
from app.adapter.request import CreateProductRequest
from app.adapter.response import CreateProductResponse
from fastapi import Depends, HTTPException
from app.application.services.product_service import ProductService
from app.application.dto import CreateProductDTO
from sqlalchemy.ext.asyncio import AsyncSession
from core.db.session import get_db

product_router = APIRouter()

# Create product
@product_router.post(Routes.CREATE_PRODUCT,response_model=CreateProductResponse)
async def create_product_endpoint(request: CreateProductRequest, db : AsyncSession = Depends(get_db)):
    product_use_case= ProductService(db)
    product = await product_use_case.create_product(CreateProductDTO(**request.model_dump()))
    return CreateProductResponse(message="Product created successfully",status=True)

# Get product by SKU
'''@product_router.get(Routes.GET_PRODUCT)
async def get_product_endpoint(filters: dict = None, db=Depends(get_db)):
    product = await get_products(db, filters)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

# Update product
@product_router.put(Routes.UPDATE_PRODUCT)
async def update_product_endpoint(sku: str, name: str = None, description: str = None, active: bool = None, db=Depends(get_db)):
    product = await update_product(db, sku, name, description, active)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

# Delete product
@product_router.delete(Routes.DELETE_PRODUCT)
async def delete_product_endpoint(sku: str, db=Depends(get_db)):
    product = await delete_product(db, sku)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"detail": "Product deleted"}


@router.delete("/products")
async def delete_all_products_endpoint(db=Depends(get_db)):
    await delete_all_products(db)
    return {"detail": "All products deleted"}'''