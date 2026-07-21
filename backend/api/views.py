from django.contrib.auth.models import User
from rest_framework import generics, viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import UserSerializer, TransactionSerializer, SavingsGoalSerializer, GoalContributionSerializer, PlannedPaymentSerializer, NoteSerializer
from .models import Transaction, SavingsGoal, GoalContribution, PlannedPayment, Note
from datetime import timedelta
import google.generativeai as genai
import tempfile
import os
import json
from rest_framework.decorators import api_view, permission_classes
from django.conf import settings

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


#Gemini voice to text
genai.configure(api_key=settings.GEMINI_API_KEY)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def process_voice_expense(request):
    audio_file = request.FILES.get('audio')
    if not audio_file:
        return Response({"error": "No audio file"}, status=400)

    # Save incoming audio to a temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix='.m4a') as temp_audio:
        for chunk in audio_file.chunks():
            temp_audio.write(chunk)
        temp_path = temp_audio.name

    try:
        # Upload to Gemini
        gemini_file = genai.upload_file(temp_path)
        
        # Enforce your strict JSON schema
        model = genai.GenerativeModel('gemini-1.5-flash')
        prompt = """
        Extract the expense details from this audio. 
        Return ONLY a JSON array matching this exact format, with no markdown formatting:
        [{"name": "Merchant Name", "amount": 0.00, "category": "CATEGORY_NAME"}]
        """
        
        response = model.generate_content([prompt, gemini_file])
        
        # Clean up files immediately
        os.remove(temp_path)
        genai.delete_file(gemini_file.name)
        
        # Parse and return to Expo
        raw_text = response.text.strip().removeprefix('```json').removesuffix('```').strip()
        return Response(json.loads(raw_text))

    except Exception as e:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        return Response({"error": str(e)}, status=500)