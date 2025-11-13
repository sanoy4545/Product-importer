class Routes:
    UPLOAD = "/upload"
    PROGRESS = "/progress/{task_id}"
    CREATE_PRODUCT = "/create_product"
    GET_PRODUCT = "/product"
    UPDATE_PRODUCT = "/product/{sku}"
    DELETE_PRODUCT = "/product/{sku}"
    DELETE_ALL_PRODUCTS = "/products"