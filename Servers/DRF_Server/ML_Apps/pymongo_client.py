from django.conf import settings
from pymongo import MongoClient

_client = None

def get_db():
    """Return a cached DB using MONGODB_URI / MONGODB_DB from settings."""
    global _client
    if _client is None:
        _client = MongoClient(settings.MONGODB_URI, retryWrites=True)
    return _client[settings.MONGODB_DB]
