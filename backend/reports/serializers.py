from rest_framework import serializers
from .models import Report


class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = ["id", "student", "type", "file", "feedback", "submitted_at"]
        read_only_fields = ["id", "submitted_at"]
