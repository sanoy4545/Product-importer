
import pandas as pd
from app.domain.entities.product_entity import Product
from core.db.sync_session import SessionLocal
from workers.celery_app import celery_app
from sqlalchemy import select

def safe_update_state(task, **kwargs):
    if getattr(task, 'request', None) and getattr(task.request, 'id', None):
        task.update_state(**kwargs)

@celery_app.task(bind=True)
def process_csv(self, file_path):
    import logging
    db = None
    try:
        db = SessionLocal()
        df = pd.read_csv(file_path)
        required_columns = ["sku", "name", "description"]
        for col in required_columns:
            if col not in df.columns:
                return f"CSV validation error: Missing required column '{col}'"
        if df[required_columns].isnull().any().any():
            return "CSV validation error: Missing values in required columns"
        total = len(df)
        for idx, row in enumerate(df.itertuples(index=False), 1):
            sku = str(row.sku).strip().lower()
            result = db.query(Product).filter(Product.sku.ilike(sku)).first()
            if result:
                result.name = row.name
                result.description = row.description
            else:
                db.add(Product(sku=sku, name=row.name, description=row.description))
            percent = int((idx / total) * 100) if total else 100
            safe_update_state(self, state='PROGRESS', meta={'progress': percent})
        db.commit()
        safe_update_state(self, state='SUCCESS', meta={'progress': 100, 'result': 'CSV import completed'})
        return "CSV import completed"
    except Exception as e:
        logging.error(f"Error in process_csv: {e}", exc_info=True)
        safe_update_state(self, state='FAILURE', meta={'progress': 0, 'result': str(e)})
        return f"CSV import failed: {str(e)}"
    finally:
        if db is not None:
            db.close()
