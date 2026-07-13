from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TransactionViewSet, SavingsGoalViewSet, GoalContributionViewSet

router = DefaultRouter()
router.register(r'transactions', TransactionViewSet, basename='transaction')
router.register(r'goals', SavingsGoalViewSet, basename='goal')
router.register(r'contributions', GoalContributionViewSet, basename='contribution')

urlpatterns = [
    path('', include(router.urls)),
]