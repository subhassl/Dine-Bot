from django.urls import path
from chat_app.views import ChatView, ChatMessageView

urlpatterns = [
    path("chat/", ChatView.as_view()),
    path("chat-message/", ChatMessageView.as_view()),
]
