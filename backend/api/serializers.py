from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Transaction, SavingsGoal, GoalContribution, PlannedPayment, Note
from django.contrib.auth.password_validation import validate_password


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name')
        extra_kwargs = {'password': {'write_only': True}}

    def validate_password(self, value):
        validate_password(value)
        return value
        
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

class PlannedPaymentSerializer(serializers.ModelSerializer):
    dueDate = serializers.DateField(source='due_date')
    isRecurring = serializers.BooleanField(source='is_recurring')
    isPaid = serializers.BooleanField(source='is_paid', read_only=True)

    class Meta:
        model = PlannedPayment
        fields = ['id', 'name', 'amount', 'dueDate', 'category', 'isRecurring', 'frequency', 'isPaid']


# serializers.py
class NoteSerializer(serializers.ModelSerializer):
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)

    class Meta:
        model = Note
        fields = ['id', 'content', 'createdAt']