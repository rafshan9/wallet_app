from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Transaction, SavingsGoal, GoalContribution

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class TransactionSerializer(serializers.ModelSerializer):
    # Automatically assigns the logged-in user
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    
    class Meta:
        model = Transaction
        fields = ['id', 'user', 'type', 'category', 'amount', 'date', 'title']


class GoalContributionSerializer(serializers.ModelSerializer):
    class Meta:
        model = GoalContribution
        fields = ['id', 'amount', 'date', 'goal'] 


class SavingsGoalSerializer(serializers.ModelSerializer):
    current_amount = serializers.ReadOnlyField()
    contributions = GoalContributionSerializer(many=True, read_only=True)
    # Automatically assigns the logged-in user
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    
    class Meta:
        model = SavingsGoal
        fields = ['id', 'user', 'name', 'target_amount', 'current_amount', 'contributions', 'color', 'created_at']