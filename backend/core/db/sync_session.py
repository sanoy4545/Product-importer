from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from core.db.session import Base
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("SYNC_DB_URL")

engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(bind=engine)
