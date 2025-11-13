from app.adapter import Routes
from workers.tasks import process_csv
from fastapi import APIRouter, UploadFile, File
import shutil
import os
import uuid

UPLOAD_DIR = "uploads"

upload_router= APIRouter()

@upload_router.post(Routes.UPLOAD)
async def upload_csv(file: UploadFile = File(...)):
    if not os.path.exists(UPLOAD_DIR):
        os.makedirs(UPLOAD_DIR)
    file_id = str(uuid.uuid4())
    file_path = f"{UPLOAD_DIR}/{file_id}_{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    task = process_csv.delay(file_path)
    return {"task_id": task.id, "message": "File received, processing started."}


@upload_router.get(Routes.PROGRESS)
async def get_progress(task_id: str):
    from workers.celery_app import celery_app
    task = celery_app.AsyncResult(task_id)
    return {"task_id": task_id, "status": task.status, "result": task.result}

