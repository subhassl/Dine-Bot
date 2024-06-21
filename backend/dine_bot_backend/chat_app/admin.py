from django.contrib import admin
from chat_app.models import Chat, ChatHistory


# Register your models here.
@admin.register(Chat)
class ChatAdmin(admin.ModelAdmin):
    list_display = ("user_id",)


@admin.register(ChatHistory)
class ChatHistoryAdmin(admin.ModelAdmin):
    list_display = ("chat", "role", "message")
