from rest_framework import serializers
from .models import Report
from auth.models import User, StudentProfile


class UserBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "role", "profile_picture"]


class StudentProfileSerializer(serializers.ModelSerializer):
    user = UserBasicSerializer(read_only=True)

    class Meta:
        model = StudentProfile
        fields = ["id", "student_id", "program", "year_of_study", "graduation_date", "skills", "user"]


class ReportSerializer(serializers.ModelSerializer):
    student_details = StudentProfileSerializer(source="student", read_only=True)

    class Meta:
        model = Report
        fields = ["id", "student", "student_details", "type", "file", "feedback", "submitted_at"]
        read_only_fields = ["id", "submitted_at"]
        extra_kwargs = {
            "student": {"required": False},
        }
