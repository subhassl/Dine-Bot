from django.urls import path
from chat_app.views import ChatView

urlpatterns = [path("chat/", ChatView.as_view())]
