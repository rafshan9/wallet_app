from django.contrib.auth.models import User
from rest_framework import generics, viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .serializers import UserSerializer, TransactionSerializer, SavingsGoalSerializer, GoalContributionSerializer
from .models import Transaction, SavingsGoal, GoalContribution

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