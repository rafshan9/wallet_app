from django.contrib.auth.models import User
from rest_framework import generics, viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from datetime import timedelta
from google import genai
from rest_framework.throttling import ScopedRateThrottle
from django.core.exceptions import ValidationError as DjangoValidationError
from django.contrib.auth.password_validation import validate_password
import tempfile
import os
import resend
from django.core.signing import TimestampSigner, BadSignature, SignatureExpired
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
from .models import Transaction, SavingsGoal, GoalContribution, PlannedPayment, Note, UserSettings
from google.oauth2 import id_token as google_id_token
from google.auth.transport import requests as google_requests






class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

    def perform_create(self, serializer):
        user = serializer.save()  
        try:
            send_verification_email(user)
        except Exception as e:
            print(f"VERIFICATION EMAIL FAILED: {e}")
            # Account still gets created even if the email fails —
            # they can request a resend via ResendVerificationEmailView.



#Verify email -------------------------------------------------------------------------------

resend.api_key = settings.RESEND_API_KEY
signer = TimestampSigner()


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

def send_verification_email(user):
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    verify_url = f"{settings.EMAIL_VERIFY_BASE_URL}?uid={uid}&token={token}"

    resend.Emails.send({
        "from": settings.DEFAULT_FROM_EMAIL,
        "to": [user.email],
        "subject": "Verify your Spends account",
        "html": f"""
            <p>Hi {user.first_name or user.username},</p>
            <p>Confirm your email to activate your Spends account:</p>
            <p><a href="{verify_url}">Verify email</a></p>
        """,
    })


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

#-------------------------------------------------------------------------------------------------------

#Forgot password----------------------------------------------------------------------------------------

def send_password_reset_email(user):
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    base_url = settings.PASSWORD_RESET_BASE_URL 
    reset_link = f"{base_url}?uid={uid}&token={token}"

    resend.Emails.send({
        "from": settings.DEFAULT_FROM_EMAIL,
        "to": [user.email],
        "subject": "Reset your Spends password",
        "html": f"""
            <p>Hi {user.first_name or user.username},</p>
            <p>Tap the link below to reset your Spends password. If you didn't request this, you can ignore this email.</p>
            <p><a href="{reset_link}">Reset password</a></p>
        """,
    })


class ForgotPasswordView(APIView):
    permission_classes = (AllowAny,)
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'forgot_password'

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'detail': 'email is required'}, status=400)

        user = User.objects.filter(email__iexact=email).first()
        if user:
            send_password_reset_email(user)

        # Same response whether or not the account exists —
        # otherwise this endpoint becomes a way to check which emails are registered.
        return Response({'detail': 'If that email exists, a reset link has been sent.'})


class ResetPasswordView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        uid = request.data.get('uid')
        token = request.data.get('token')
        new_password = request.data.get('new_password')

        if not uid or not token or not new_password:
            return Response({'error': 'uid, token, and new_password are required'}, status=400)

        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({'error': 'Invalid or expired link'}, status=400)

        if not default_token_generator.check_token(user, token):
            return Response({'error': 'Invalid or expired link'}, status=400)

        try:
            validate_password(new_password, user=user)
        except DjangoValidationError as e:
            return Response({'error': e.messages}, status=400)

        user.set_password(new_password)
        user.save(update_fields=['password'])

        return Response({'detail': 'Password reset successful.'})


class PasswordResetRedirectView(APIView):
    """
    Email-safe HTTPS endpoint that redirects into the app via deep link.
    Email clients won't render spends:// links, so the email points here instead.
    """
    permission_classes = (AllowAny,)

    def get(self, request):
        uid = request.GET.get('uid', '')
        token = request.GET.get('token', '')
        deep_link = f"spends://reset-password?uid={uid}&token={token}"

        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Redirecting to Spends…</title>
            <script>window.location.href = "{deep_link}";</script>
        </head>
        <body style="font-family: sans-serif; text-align: center; padding: 40px;">
            <h2>Redirecting to Spends…</h2>
            <p>If the app didn't open, <a href="{deep_link}">tap here</a>.</p>
        </body>
        </html>
        """
        return HttpResponse(html)


class ChangePasswordView(APIView):
    """Lets an authenticated user change their own password."""
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        if not old_password or not new_password:
            return Response({'error': 'old_password and new_password are required'}, status=400)

        user = request.user
        if not user.check_password(old_password):
            return Response({'error': 'Current password is incorrect.'}, status=400)

        try:
            validate_password(new_password, user=user)
        except DjangoValidationError as e:
            return Response({'error': e.messages}, status=400)

        user.set_password(new_password)
        user.save(update_fields=['password'])

        return Response({'detail': 'Password changed successfully.'})

#-------------------------------------------------------------------------------------------------------

import re

class ChangeNameView(APIView):
    """Lets an authenticated user change their first and last name."""
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        first_name = request.data.get('first_name', '').strip()
        last_name = request.data.get('last_name', '').strip()

        if not first_name:
            return Response({'error': 'First name is required.'}, status=400)

        request.user.first_name = first_name
        request.user.last_name = last_name
        request.user.save(update_fields=['first_name', 'last_name'])

        return Response({
            'detail': 'Name updated successfully.',
            'first_name': first_name,
            'last_name': last_name
        })

class ChangeUsernameView(APIView):
    """Lets an authenticated user change their username."""
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        new_username = request.data.get('username', '').strip()

        if not new_username:
            return Response({'error': 'Username is required.'}, status=400)

        if len(new_username) < 3:
            return Response({'error': 'Username must be at least 3 characters.'}, status=400)

        if len(new_username) > 30:
            return Response({'error': 'Username must be 30 characters or fewer.'}, status=400)

        if not re.match(r'^[a-zA-Z0-9_]+$', new_username):
            return Response({'error': 'Username can only contain letters, numbers, and underscores.'}, status=400)

        if new_username.lower() == request.user.username.lower():
            return Response({'error': 'That is already your username.'}, status=400)

        if User.objects.filter(username__iexact=new_username).exists():
            # Generate suggestions
            base = new_username.rstrip('0123456789')
            suggestions = []
            import random
            for _ in range(20):
                candidate = f"{base}{random.randint(1, 999)}"
                if not User.objects.filter(username__iexact=candidate).exists():
                    suggestions.append(candidate)
                if len(suggestions) == 3:
                    break
            return Response({
                'error': 'That username is already taken.',
                'suggestions': suggestions,
            }, status=409)

        request.user.username = new_username
        request.user.save(update_fields=['username'])

        return Response({'detail': 'Username changed successfully.', 'username': new_username})


class CheckUsernameView(APIView):
    """Check whether a username is available."""
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        username = request.GET.get('username', '').strip()
        if not username:
            return Response({'available': False, 'error': 'Username is required.'}, status=400)

        is_own = username.lower() == request.user.username.lower()
        taken = User.objects.filter(username__iexact=username).exists()

        return Response({'available': is_own or not taken})




class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user).order_by('-date')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
#-------------------------------------------------------------------------------------------------------#
#-------------------------------------USER SETTINGS-----------------------------------------------------#
#-------------------------------------------------------------------------------------------------------#

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def manage_daily_budget(request):
    # This automatically gets the settings or creates a blank one if it doesn't exist yet
    settings, created = UserSettings.objects.get_or_create(user=request.user)

    if request.method == 'POST':
        # React Native will send the new budget here
        new_budget = request.data.get('daily_budget')
        settings.daily_budget = new_budget
        settings.save()
        return Response({"message": "Budget updated!", "daily_budget": settings.daily_budget})

    # If it's a GET request, just return the current budget
    return Response({"daily_budget": settings.daily_budget})


#----------------------------------------------------------------#

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

