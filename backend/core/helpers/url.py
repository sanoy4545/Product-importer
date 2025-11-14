from urllib.parse import urlparse

def is_valid_url(url: str) -> bool:
    """
    Returns True if the given string is a valid HTTP/HTTPS URL, else False.
    """
    try:
        result = urlparse(url)
        return result.scheme in ("http", "https") and bool(result.netloc)
    except Exception:
        return False
