from django.contrib import admin
from chat_app.models import Chat, ChatMessage


@admin.register(Chat)
class ChatAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user_id",
    )


@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ("chat", "role", "message")
