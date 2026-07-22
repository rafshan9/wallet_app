from django.contrib.auth.models import User
from rest_framework import generics, viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from datetime import timedelta
from google import genai
import tempfile
import os
import json
import requests
from rest_framework.decorators import api_view, permission_classes
from django.conf import settings
from rest_framework.views import APIView
from .serializers import UserSerializer, TransactionSerializer, SavingsGoalSerializer, GoalContributionSerializer, PlannedPaymentSerializer, NoteSerializer
from .models import Transaction, SavingsGoal, GoalContribution, PlannedPayment, Note


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user).order_by('-date')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class SavingsGoalViewSet(viewsets.ModelViewSet):
    serializer_class = SavingsGoalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SavingsGoal.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def add_funds(self, request, pk=None):
        goal = self.get_object()
        amount = request.data.get('amount')
        
        if not amount:
            return Response({'error': 'Amount is required'}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Add money to the goal
        contribution = GoalContribution.objects.create(goal=goal, amount=amount)
        
        # 2. Automatically log this as an expense so it deducts from available balance
        Transaction.objects.create(
            user=self.request.user,
            type='EXPENSE',
            amount=amount,
            category='OTHER',
            title=f'Contribution to: {goal.name}'
        )

        return Response(GoalContributionSerializer(contribution).data, status=status.HTTP_201_CREATED)

class GoalContributionViewSet(viewsets.ModelViewSet):
    serializer_class = GoalContributionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only show contributions for goals that belong to the logged-in user
        return GoalContribution.objects.filter(goal__user=self.request.user)
    
class PlannedPaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PlannedPaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PlannedPayment.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def mark_paid(self, request, pk=None):
        payment = self.get_object()
        if payment.is_recurring and payment.frequency:
            # one-off payments just get marked paid and drop off the list
            delta = {'weekly': timedelta(weeks=1), 'monthly': timedelta(days=30), 'yearly': timedelta(days=365)}[payment.frequency]
            payment.due_date += delta  # recurring ones roll forward instead
        else:
            payment.is_paid = True
        payment.save()
        return Response(PlannedPaymentSerializer(payment).data)


class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class DeleteAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        user = request.user
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
        
#Gemini voice to text
client = genai.Client(api_key=settings.GEMINI_API_KEY)

#Groke voice to text 

#Expense
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def process_voice_expense(request):
    audio_file = request.FILES.get('audio')
    if not audio_file:
        return Response({"error": "No audio file"}, status=400)

    with tempfile.NamedTemporaryFile(delete=False, suffix='.m4a') as temp_audio:
        for chunk in audio_file.chunks():
            temp_audio.write(chunk)
        temp_path = temp_audio.name

    try:
        gemini_file = client.files.upload(file=temp_path)

        prompt = """
        Extract the expense details from this audio.
        Return ONLY a JSON array matching this exact format, with no markdown formatting:
        [{"name": "Merchant Name", "amount": 0.00, "category": "CATEGORY_NAME"}]

        CATEGORY_NAME must be exactly one of these values, with no others allowed:
        GROCERIES, SUBSCRIPTIONS, MEMBERSHIP, BILLS, TRANSPORT, DINING, SHOPPING, ENTERTAINMENT, RENT, OTHER

        Pick the closest match. If nothing fits well, use OTHER.
        """

        response = client.models.generate_content(
            model='gemini-3.5-flash',
            contents=[prompt, gemini_file]
        )

        os.remove(temp_path)
        client.files.delete(name=gemini_file.name)

        raw_text = response.text.strip().removeprefix('```json').removesuffix('```').strip()
        return Response(json.loads(raw_text))

    except Exception as e:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        return Response({"error": str(e)}, status=500)

#Voice note using gemini 
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def process_voice_note(request):
    audio_file = request.FILES.get('audio')
    if not audio_file:
        return Response({"error": "No audio file"}, status=400)

    with tempfile.NamedTemporaryFile(delete=False, suffix='.m4a') as temp_audio:
        for chunk in audio_file.chunks():
            temp_audio.write(chunk)
        temp_path = temp_audio.name

    try:
        gemini_file = client.files.upload(file=temp_path)
        prompt = "Transcribe this audio exactly as spoken. Return only the transcription text, with no extra commentary, labels, or formatting."

        response = client.models.generate_content(
            model='gemini-3.5-flash',
            contents=[prompt, gemini_file]
        )

        os.remove(temp_path)
        client.files.delete(name=gemini_file.name)

        return Response({"text": response.text.strip()})

    except Exception as e:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        return Response({"error": str(e)}, status=500)

