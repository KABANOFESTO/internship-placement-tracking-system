from rest_framework import serializers
from .models import Organization, InternshipPosition, Application, Placement
from auth.models import StudentProfile, SupervisorProfile, User


class UserBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "role", "profile_picture"]


class StudentProfileSerializer(serializers.ModelSerializer):
    user = UserBasicSerializer(read_only=True)

    class Meta:
        model = StudentProfile
        fields = ["id", "student_id", "program", "year_of_study", "graduation_date", "skills", "user"]


class SupervisorProfileSerializer(serializers.ModelSerializer):
    user = UserBasicSerializer(read_only=True)

    class Meta:
        model = SupervisorProfile
        fields = ["id", "organization", "position", "user"]


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
        extra_kwargs = {
            "student": {"required": False},
        }


class PlacementSerializer(serializers.ModelSerializer):
    student_details = serializers.SerializerMethodField()
    supervisor_details = SupervisorProfileSerializer(source="supervisor", read_only=True)

    class Meta:
        model = Placement
        fields = ["id", "application", "student_details", "supervisor", "supervisor_details", "start_date", "end_date", "confirmed"]

    def get_student_details(self, obj):
        student = getattr(obj.application, "student", None)
        if not student:
            return None
        return StudentProfileSerializer(student).data

    def validate_supervisor(self, value):
        if value is None:
            return value

        if isinstance(value, SupervisorProfile):
            return value

        supervisor_profile = SupervisorProfile.objects.filter(pk=value).first()
        if supervisor_profile:
            return supervisor_profile

        user = User.objects.filter(pk=value, role=User.Role.SUPERVISOR).first()
        if user:
            supervisor_profile, _ = SupervisorProfile.objects.get_or_create(
                user=user,
                defaults={"organization": "", "position": ""},
            )
            return supervisor_profile

        raise serializers.ValidationError("Selected supervisor does not exist.")
