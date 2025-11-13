from sqlalchemy import Column, Integer, String, Boolean, Float
from core.db.session import Base

class Webhook(Base):
    __tablename__ = "webhooks"
    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, nullable=False)
    event_type = Column(String, nullable=False)
    enabled = Column(Boolean, default=True)
    last_response_code = Column(Integer, nullable=True)
    last_response_time = Column(Float, nullable=True)


class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    sku = Column(String, unique=True, index=True)
    name = Column(String)
    description = Column(String)
    active = Column(Boolean, default=True)
