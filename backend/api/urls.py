from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TransactionViewSet, SavingsGoalViewSet, GoalContributionViewSet, PlannedPaymentViewSet, NoteViewSet, process_voice_expense
from . import views


router = DefaultRouter()
router.register(r'transactions', TransactionViewSet, basename='transaction')
router.register(r'goals', SavingsGoalViewSet, basename='goal')
router.register(r'contributions', GoalContributionViewSet, basename='contribution')
router.register(r'planned-payments', PlannedPaymentViewSet, basename='planned-payment')
router.register(r'notes', NoteViewSet, basename='note')

urlpatterns = [
    path('transactions/voice/', views.process_voice_expense, name='voice-expense'),
    path('', include(router.urls)),
]