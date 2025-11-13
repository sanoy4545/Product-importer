class CustomException(Exception):
    status = "error"
    code = 400
    error_code = "BAD_GATEWAY"
    message = "BAD GATEWAY"
    