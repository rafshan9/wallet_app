from django.db import models
from django.contrib.auth.models import User

class Transaction(models.Model):
    TRANSACTION_TYPES = (
        ('INCOME', 'Income'),
        ('EXPENSE', 'Expense'),
    )
    
    # Matches your UI pills
    CATEGORY_CHOICES = (
        ('SALARY', 'Salary'),
        ('INVESTMENT', 'Return from Investment'),
        ('GROCERIES', 'Groceries'),
        ('SUBSCRIPTIONS', 'Subscriptions'),
        ('MEMBERSHIP', 'Membership'),
        ('BILLS', 'Bills'),
        ('TRANSPORT', 'Transport'),
        ('DINING', 'Dining'),
        ('SHOPPING', 'Shopping'),
        ('ENTERTAINMENT', 'Entertainment'),
        ('RENT', 'Rent'),
        ('OTHER', 'Other')
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    title = models.CharField(max_length=100) # e.g., "Netflix", "June Salary"
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} | {self.type} | {self.amount}"

class SavingsGoal(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='goals')
    name = models.CharField(max_length=100) # e.g., "Trip to Argentina"
    target_amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def current_amount(self):
        # Automatically calculates total from contributions
        return sum(contribution.amount for contribution in self.contributions.all())

    def __str__(self):
        return f"{self.name} - {self.user.username}"


class GoalContribution(models.Model):
    goal = models.ForeignKey(SavingsGoal, on_delete=models.CASCADE, related_name='contributions')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"${self.amount} to {self.goal.name}"




