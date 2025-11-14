class Routes:
    UPLOAD = "/upload"
    PROGRESS = "/progress/{task_id}"
    CREATE_PRODUCT = "/create_product"
    GET_PRODUCT = "/product"
    UPDATE_PRODUCT = "/product/{sku}"
    DELETE_PRODUCT = "/product/{sku}"
    DELETE_ALL_PRODUCTS = "/products"

class WebhookRoutes:
    CREATE_WEBHOOK = "/create_webhook"
    UPDATE_WEBHOOK = "/update_webhook/{id}"
    DELETE_WEBHOOK = "/delete_webhook/{id}"
    GET_WEBHOOKS = "/webhooks"
    ENABLE_WEBHOOK = "/webhooks/{id}/enable"
    TEST_WEBHOOK = "/webhooks/{id}/test"