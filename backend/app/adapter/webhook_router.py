from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.application.exceptions import WebhookNotFoundException
from core.db.session import get_db
from fastapi import Body
from app.adapter import WebhookRoutes
from app.adapter.request import  CreateWebhookRequest, UpdateWebhookRequest, DeleteWebhookRequest, EnableWebhookRequest, GetWebhooksRequest
from app.adapter.response import TestWebhookResponse, WebhookCreationResponse, WebhookEditResponse, WebhookDeletionResponse, EnableWebhookResponse, PageResponse, WebhookResponse
from app.application.dto import CreateWebhookDTO, UpdateWebhookDTO, DeleteWebhookDTO, EnableWebhookDTO, GetWebhooksDTO, TestWebhookDTO
from app.application.services.product_service import WebhookService
import time

webhook_router = APIRouter()

@webhook_router.post(WebhookRoutes.CREATE_WEBHOOK,response_model=WebhookCreationResponse)
async def add_webhook(request: CreateWebhookRequest, db: AsyncSession = Depends(get_db)):
    try:
        web_hook_use_case = WebhookService(db)
        await web_hook_use_case.create_webhook(CreateWebhookDTO(**request.model_dump()))
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    return WebhookCreationResponse(success=True, message="Webhook added successfully")  # Replace id=1 with actual created webhook ID

@webhook_router.put(WebhookRoutes.UPDATE_WEBHOOK,response_model=WebhookEditResponse)
async def edit_webhook(request: UpdateWebhookRequest, db: AsyncSession = Depends(get_db)):
    try:
        web_hook_use_case = WebhookService(db)
        await web_hook_use_case.update_webhook(UpdateWebhookDTO(**request.model_dump()))
    except WebhookNotFoundException as exc:
        raise HTTPException(
            status_code=exc.code,
            detail={"error_code": exc.error_code, "message": exc.message}
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    return WebhookEditResponse(message="Webhook updated successfully", success=True)    


@webhook_router.delete(WebhookRoutes.DELETE_WEBHOOK,response_model=WebhookDeletionResponse)
async def delete_webhook(request: DeleteWebhookRequest = Depends(), db: AsyncSession = Depends(get_db)):
    try:
        web_hook_use_case = WebhookService(db)
        await web_hook_use_case.delete_webhook(DeleteWebhookDTO(**request.model_dump()))
    except WebhookNotFoundException as exc:
        raise HTTPException(
            status_code=exc.code,
            detail={"error_code": exc.error_code, "message": exc.message}
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    return WebhookDeletionResponse(message="Webhook deleted successfully", success=True)


@webhook_router.get(WebhookRoutes.GET_WEBHOOKS,response_model=PageResponse)
async def list_webhooks(request: GetWebhooksRequest = Depends(), db: AsyncSession = Depends(get_db)):
    webhook_use_case = WebhookService(db)
    webhooks = await webhook_use_case.get_webhooks(GetWebhooksDTO(**request.model_dump()))
    webhooks['items'] = [WebhookResponse.model_validate(w) for w in webhooks['items']]
    return webhooks


@webhook_router.patch(WebhookRoutes.ENABLE_WEBHOOK, response_model=EnableWebhookResponse)
async def enable_webhook(request: EnableWebhookRequest, db: AsyncSession = Depends(get_db)):
    try:
         webhook_use_case = WebhookService(db)
         await webhook_use_case.enable_webhook(EnableWebhookDTO(**request.model_dump()))
    except WebhookNotFoundException as exc:
        raise HTTPException(
            status_code=exc.code,
            detail={"error_code": exc.error_code, "message": exc.message}
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    return EnableWebhookResponse(message=f"Webhook {'enabled' if request.enabled else 'disabled'} successfully", success=True)

@webhook_router.post(WebhookRoutes.TEST_WEBHOOK,response_model=TestWebhookResponse)
async def test_webhook(id: int,body: dict= Body(None), db: AsyncSession = Depends(get_db)):
    webhook_use_case = WebhookService(db)
    try:
        result = await webhook_use_case.test_webhook(TestWebhookDTO(body=body, id=id))
        return result
    except WebhookNotFoundException as exc:
        raise HTTPException(
            status_code=exc.code,
            detail={"error_code": exc.error_code, "message": exc.message}
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    
