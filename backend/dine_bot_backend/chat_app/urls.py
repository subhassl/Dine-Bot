from django.urls import path
from chat_app.views import ChatView, ChatMessageView, CustomAuthToken

urlpatterns = [
    path("chat/", ChatView.as_view()),
    path("chat-message/", ChatMessageView.as_view()),
    path("auth-token/", CustomAuthToken.as_view()),
]
