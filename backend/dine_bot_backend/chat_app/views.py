from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from chat_app.models import Chat, ChatMessage, ROlE_CHOICES
from chat_app.gemini_integration import get_gemini_response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication, SessionAuthentication


class CustomAuthToken(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response(
                {"error": "Username and password are required."}, status=400
            )

        # Authenticate the user
        user = authenticate(request, username=username, password=password)

        if user is None:
            return Response({"error": "Invalid credentials."}, status=401)

        # Generate a token for the authenticated user
        token, created = Token.objects.get_or_create(user=user)

        return Response({"token": token.key, "username": user.username}, status=200)


class AuthRequiredApiView(APIView):
    authentication_classes = [
        TokenAuthentication,
        SessionAuthentication,
    ]  # Specify the authentication class
    permission_classes = [IsAuthenticated]  # Specify the permission class


class ChatView(AuthRequiredApiView):
    def post(self, request):
        chat = Chat.objects.create(user_id=request.user.id)
        return Response({"chat_id": chat.id}, status=status.HTTP_201_CREATED)


# Create your views here.
class ChatMessageView(AuthRequiredApiView):

    def post(self, request):
        data = request.data
        user_id = request.user.id  # Get user ID from authenticated user
        chat_id = data["chat_id"]
        message = data["message"]

        try:
            # Attempt to retrieve an existing Chat session based on user_id
            chat = Chat.objects.get(id=chat_id, user_id=user_id)

        except Chat.DoesNotExist:
            return Response(
                {"error": "Chat session not found"}, status=status.HTTP_404_NOT_FOUND
            )

        # retrive the history of the current session
        messages = ChatMessage.objects.filter(chat=chat).order_by("created_at")

        # format to required structure
        history_data = []
        for msg in messages:
            formatted_history = {"role": ROlE_CHOICES[msg.role], "parts": [msg.message]}
            history_data.append(formatted_history)

        # Generate a response from the Gemini API based on the current message and chat history
        try:
            response = get_gemini_response(message, history_data)

            # Save the new user message in the chat history
            ChatMessage.objects.create(
                chat=chat, message=message, role=1
            )  # user message

            # Save the model's response in the chat history
            ChatMessage.objects.create(
                chat=chat, message=response, role=2
            )  # model message

            # Return the model's response to the client
            return Response({"response": response}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
