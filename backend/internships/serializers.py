from rest_framework import serializers
from .models import Organization, InternshipPosition, Application, Placement
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


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ["id", "name", "address", "contact_email"]


class InternshipPositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = InternshipPosition
        fields = ["id", "title", "organization", "description", "required_skills", "capacity"]


class ApplicationSerializer(serializers.ModelSerializer):
    student_details = StudentProfileSerializer(source="student", read_only=True)

    class Meta:
        model = Application
        fields = ["id", "student", "student_details", "position", "cover_letter", "cv", "status", "created_at"]
        read_only_fields = ["id", "created_at"]


class PlacementSerializer(serializers.ModelSerializer):
    student_details = serializers.SerializerMethodField()

    class Meta:
        model = Placement
        fields = ["id", "application", "student_details", "supervisor", "start_date", "end_date", "confirmed"]

    def get_student_details(self, obj):
        student = getattr(obj.application, "student", None)
        if not student:
            return None
        return StudentProfileSerializer(student).data
