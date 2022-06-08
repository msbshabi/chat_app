from django.urls import path
from . import consumers

websocket_url_patterns = [
    path("chat/", consumers.ChatConsumer.as_asgi()),
]
