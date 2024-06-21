from django.db import models
from django.contrib.auth.models import User


class Chat(models.Model):
    user = models.ForeignKey(User, on_delete=models.PROTECT)

    def __str__(self):
        return str(self.id)


ROlE_CHOICES = {
    1: "user",
    2: "model",
}


class ChatMessage(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE)
    message = models.TextField()
    role = models.IntegerField(choices=ROlE_CHOICES.items())
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return ROlE_CHOICES[self.role] + ": " + self.message
