from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.adapter import product_router, upload_router
import app.domain.entities.product_entity
from core.db.session import engine, Base


app = FastAPI(title="Product Importer")

# Create tables on startup using async engine
@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(product_router.product_router, prefix="/products", tags=["Products"])
app.include_router(upload_router.upload_router, prefix="/upload", tags=["Upload"])