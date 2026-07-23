from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TransactionViewSet, SavingsGoalViewSet, GoalContributionViewSet, PlannedPaymentViewSet, NoteViewSet, process_voice_expense, DeleteAccountView, UserProfileView, GoogleAuthView, VerifyEmailView, ResendVerificationEmailView
from . import views


router = DefaultRouter()
router.register(r'transactions', TransactionViewSet, basename='transaction')
router.register(r'goals', SavingsGoalViewSet, basename='goal')
router.register(r'contributions', GoalContributionViewSet, basename='contribution')
router.register(r'planned-payments', PlannedPaymentViewSet, basename='planned-payment')
router.register(r'notes', NoteViewSet, basename='note')

urlpatterns = [
    path('transactions/voice/', views.process_voice_expense, name='voice-expense'),
    path('notes/voice/', views.process_voice_note, name='voice-note'),
    path('account/delete/', views.DeleteAccountView.as_view(), name='delete-account'),
    path('account/profile/', UserProfileView.as_view(), name='user-profile'), 
    path('auth/google/', views.GoogleAuthView.as_view(), name='google-auth'),
    path('auth/resend-verification/', views.ResendVerificationEmailView.as_view(), name='resend-verification'),
    path('auth/verify-email/', views.VerifyEmailView.as_view(), name='verify-email'),
    path('', include(router.urls)),
]