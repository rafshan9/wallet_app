from django.contrib.auth.models import User
from rest_framework import generics, viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from datetime import timedelta
from google import genai
from rest_framework.throttling import ScopedRateThrottle
import tempfile
import os
from django.http import HttpResponse
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
import json
import requests
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from django.conf import settings
from rest_framework.views import APIView
from .serializers import UserSerializer, TransactionSerializer, SavingsGoalSerializer, GoalContributionSerializer, PlannedPaymentSerializer, NoteSerializer
from .models import Transaction, SavingsGoal, GoalContribution, PlannedPayment, Note
from google.oauth2 import id_token as google_id_token
from google.auth.transport import requests as google_requests



def send_verification_email(user):
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    verify_link = f"{settings.EMAIL_VERIFY_BASE_URL}?uid={uid}&token={token}"
    send_mail(
        subject='Verify your email',
        message=f'Tap this link to verify your account: {verify_link}',
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
    )


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

    def perform_create(self, serializer):
        user = serializer.save()  # your UserSerializer.create() already sets is_active=False
        send_verification_email(user)


class VerifyEmailView(APIView):
    permission_classes = (AllowAny,)

    def get(self, request):
        uid = request.GET.get('uid')
        token = request.GET.get('token')

        error_html = """
        <html><body style="font-family: sans-serif; text-align: center; padding: 40px;">
            <h2>❌ Invalid or expired link</h2>
            <p>Please request a new verification email from the app.</p>
        </body></html>
        """

        if not uid or not token:
            return HttpResponse(error_html, status=400)

        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return HttpResponse(error_html, status=400)

        if not default_token_generator.check_token(user, token):
            return HttpResponse(error_html, status=400)

        if not user.is_active:
            user.is_active = True
            user.save(update_fields=['is_active'])

        success_html = """
        <html><body style="font-family: sans-serif; text-align: center; padding: 40px;">
            <h2>✅ Email verified</h2>
            <p>You can close this tab and open the app.</p>
        </body></html>
        """
        return HttpResponse(success_html)

class ResendVerificationEmailView(APIView):
    permission_classes = (AllowAny,)
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'resend_verification'

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'detail': 'email is required'}, status=400)

        user = User.objects.filter(email__iexact=email, is_active=False).first()
        if user:
            send_verification_email(user)

        # Same response whether or not the account exists / is already verified —
        # otherwise this endpoint becomes a way to check which emails are registered.
        return Response({'detail': 'If that email needs verifying, a new link has been sent.'})

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


# Google auth
class GoogleAuthView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        token = request.data.get('id_token')
        if not token:
            return Response({'detail': 'id_token is required'}, status=400)

        try:
            idinfo = google_id_token.verify_oauth2_token(
                token, google_requests.Request(), settings.GOOGLE_OAUTH_CLIENT_ID
            )
        except ValueError:
            return Response({'detail': 'Invalid Google token'}, status=401)

        if not idinfo.get('email_verified'):
            return Response({'detail': 'Google email not verified'}, status=401)

        email = idinfo['email']
        user = User.objects.filter(email__iexact=email).first()

        if user is None:
            username = base = email.split('@')[0]
            suffix = 1
            while User.objects.filter(username=username).exists():
                username = f"{base}{suffix}"
                suffix += 1
            user = User.objects.create(
                username=username,
                email=email,
                first_name=idinfo.get('given_name', ''),
                last_name=idinfo.get('family_name', ''),
            )
            user.set_unusable_password()
            user.save()
        elif not user.is_active:
            # Google just proved this person really owns this email — reclaim the account
            # from whatever password-signup stub was sitting on it, and lock out that password
            # since it may not belong to the real owner.
            user.is_active = True
            user.set_unusable_password()
            user.save()

        refresh = RefreshToken.for_user(user)
        return Response({'access': str(refresh.access_token), 'refresh': str(refresh)})
        
#Gemini voice to text
client = genai.Client(api_key=settings.GEMINI_API_KEY)


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

# Voice to text expense
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def process_expense_text(request):
    text = request.data.get('text')
    if not text:
        return Response({"error": "No text provided"}, status=400)

    prompt = f"""
    Extract the expense details from this text: "{text}"

    Return ONLY a JSON array matching this exact format, with no markdown formatting:
    [{{"name": "Merchant Name", "amount": 0.00, "category": "CATEGORY_NAME"}}]

    CATEGORY_NAME must be exactly one of these values, with no others allowed:
    GROCERIES, SUBSCRIPTIONS, MEMBERSHIP, BILLS, TRANSPORT, DINING, SHOPPING, ENTERTAINMENT, RENT, OTHER

    Pick the closest match. If nothing fits well, use OTHER.
    If multiple expenses are mentioned, return one object per expense.
    """

    try:
        response = client.models.generate_content(
            model='gemini-3.5-flash',
            contents=[prompt]
        )
        raw_text = response.text.strip().removeprefix('```json').removesuffix('```').strip()
        return Response(json.loads(raw_text))
    except Exception as e:
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

