from django.db import models


# Create your models here.
class Chat(models.Model):
    user_id = models.CharField(max_length=50)


class ChatHistory(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE)
    message = models.TextField()
    role = models.CharField(max_length=10)  # 'user' or 'model'
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.role + ": " + self.message
