from core.exceptions import CustomException

class ProductNotFoundException(CustomException):
    status = "error"
    code = 404
    error_code = "PRODUCT_NOT_FOUND"
    message = "Product not found"

class WebhookNotFoundException(CustomException):
    status = "error"
    code = 404
    error_code = "WEBHOOK_NOT_FOUND"
    message = "Webhook not found"