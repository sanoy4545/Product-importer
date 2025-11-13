from fastapi import APIRouter, UploadFile, File
from app.adapter import Routes
from app.adapter.request import CreateProductRequest, UpdateProductRequest,DeleteProductRequest
from app.adapter.response import CreateProductResponse, UpdateProductResponse, DeleteProductResponse, DeleteAllProductsResponse
from fastapi import Depends, HTTPException
from app.application.services.product_service import ProductService
from app.application.dto import CreateProductDTO, UpdateProductDTO, DeleteProductDTO
from app.application.exceptions import ProductNotFoundException
from sqlalchemy.ext.asyncio import AsyncSession
from core.db.session import get_db

product_router = APIRouter()

# Create product
@product_router.post(Routes.CREATE_PRODUCT,response_model=CreateProductResponse)
async def create_product_endpoint(request: CreateProductRequest, db : AsyncSession = Depends(get_db)):
    product_use_case= ProductService(db)
    await product_use_case.create_product(CreateProductDTO(**request.model_dump()))
    return CreateProductResponse(message="Product created successfully",status=True)

# Get product by SKU
'''@product_router.get(Routes.GET_PRODUCT)
async def get_product_endpoint(filters: dict = None, db=Depends(get_db)):
    product = await get_products(db, filters)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product'''

# Update product
@product_router.put(Routes.UPDATE_PRODUCT, response_model=UpdateProductResponse)
async def update_product_endpoint(request: UpdateProductRequest, db: AsyncSession = Depends(get_db)):
    product_use_case = ProductService(db)
    try:
        await product_use_case.update_product(UpdateProductDTO(**request.model_dump()))
    except ProductNotFoundException as exc:
        raise HTTPException(
            status_code=exc.code,
            detail={"error_code": exc.error_code, "message": exc.message}
        )
    return UpdateProductResponse(message="Product updated successfully", status=True)

# Delete product
@product_router.delete(Routes.DELETE_PRODUCT,response_model=DeleteProductResponse)
async def delete_product_endpoint(request: DeleteProductRequest, db: AsyncSession = Depends(get_db)):
    product_use_case = ProductService(db)
    try:
        await product_use_case.delete_product(DeleteProductDTO(**request.model_dump()))
    except ProductNotFoundException as exc:
        raise HTTPException(
            status_code=exc.code,
            detail={"error_code": exc.error_code, "message": exc.message}
        )
    return DeleteProductResponse(message="Product deleted successfully", status=True)

#delete all products
@product_router.delete(Routes.DELETE_ALL_PRODUCTS,response_model=DeleteAllProductsResponse)
async def delete_all_products_endpoint(db: AsyncSession = Depends(get_db)):
    product_use_case = ProductService(db)
    await product_use_case.delete_all_products()
    return DeleteAllProductsResponse(message="All products deleted successfully", status=True)