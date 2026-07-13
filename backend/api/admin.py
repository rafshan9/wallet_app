from django.contrib import admin
from .models import Transaction, SavingsGoal, GoalContribution

admin.site.register(Transaction)
admin.site.register(SavingsGoal)
admin.site.register(GoalContribution)