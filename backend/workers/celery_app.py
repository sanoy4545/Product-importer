from celery import Celery
import os
from dotenv import load_dotenv

load_dotenv()
celery_app = Celery(
    "worker",
    broker=os.getenv("REDIS_URL"),
    backend=os.getenv("REDIS_URL")
)

# Enable autodiscovery of tasks in app.workers
celery_app.autodiscover_tasks(['app.workers'])
