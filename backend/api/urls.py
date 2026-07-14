from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TransactionViewSet, SavingsGoalViewSet, GoalContributionViewSet, PlannedPaymentViewSet

router = DefaultRouter()
router.register(r'transactions', TransactionViewSet, basename='transaction')
router.register(r'goals', SavingsGoalViewSet, basename='goal')
router.register(r'contributions', GoalContributionViewSet, basename='contribution')
router.register(r'planned-payments', PlannedPaymentViewSet, basename='planned-payment')

urlpatterns = [
    path('', include(router.urls)),
]