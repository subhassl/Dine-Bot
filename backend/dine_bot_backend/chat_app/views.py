from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from chat_app.models import Chat, ChatHistory
from chat_app.gemini_integration import get_gemini_response


# Create your views here.
class ChatView(APIView):
    def post(self, request):
        data = request.data
        user_id = data["user_id"]
        message = data["message"]

        try:
            # Attempt to retrieve an existing Chat session based on user_id
            chat = Chat.objects.get(user_id=user_id)
            created = (
                False  # Flag indicating whether the Chat session was created or not
            )
        except Chat.DoesNotExist:
            # If no Chat session exists for the given user_id, create a new one
            chat = Chat.objects.create(user_id=user_id)
            created = True  # Set the flag to True to indicate that a new Chat session was created

        # retrive the history of the current session
        history = ChatHistory.objects.filter(chat=chat)

        # format to required structure
        history_data = []
        for h in history:
            formatted_history = {"role": h.role, "parts": [h.message]}
            history_data.append(formatted_history)

        # Generate a response from the Gemini API based on the current message and chat history
        try:
            response = get_gemini_response(message, history_data)
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Save the new user message in the chat history
        ChatHistory.objects.create(chat=chat, message=message, role="user")

        # Save the model's response in the chat history
        ChatHistory.objects.create(chat=chat, message=response, role="model")

        # Return the model's response to the client
        return Response({"response": response}, status=status.HTTP_200_OK)
