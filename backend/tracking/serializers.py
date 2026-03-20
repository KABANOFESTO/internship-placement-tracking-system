from rest_framework import serializers
from .models import ProgressLog, Milestone


class ProgressLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgressLog
        fields = [
            "id",
            "student",
            "date",
            "hours_completed",
            "summary",
            "supervisor",
            "approved",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class MilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Milestone
        fields = ["id", "student", "title", "description", "due_date", "completed", "completed_at"]
