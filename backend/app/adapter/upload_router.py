from app.adapter import Routes
from workers.tasks import process_csv
from fastapi import APIRouter, HTTPException, UploadFile, File
from app.adapter.response import UploadResponse, ProgressResponse
import shutil
import os
import uuid

UPLOAD_DIR = "uploads"

upload_router= APIRouter()

@upload_router.post(Routes.UPLOAD)
async def upload_csv(file: UploadFile = File(...)):

    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a CSV file.")

    if not os.path.exists(UPLOAD_DIR):
        os.makedirs(UPLOAD_DIR)
    file_id = str(uuid.uuid4())
    file_path = os.path.abspath(f"{UPLOAD_DIR}/{file_id}_{file.filename}")

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        # Clean up if file was partially written
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")

    task = process_csv.delay(file_path)
    return UploadResponse(task_id=task.id, message="File received, processing started.")


@upload_router.get(Routes.PROGRESS)
async def get_progress(task_id: str):
    from workers.celery_app import celery_app
    task = celery_app.AsyncResult(task_id)
    return ProgressResponse(task_id=task_id, status=task.status, result=task.result)

