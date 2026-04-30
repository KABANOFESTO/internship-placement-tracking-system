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
    partner_user_details = UserBasicSerializer(source="partner_user", read_only=True)

    class Meta:
        model = Organization
        fields = [
            "id",
            "partner_user",
            "partner_user_details",
            "name",
            "address",
            "contact_email",
            "contact_phone",
            "industry",
            "website",
            "description",
            "capacity",
            "status",
            "settings",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class InternshipPositionSerializer(serializers.ModelSerializer):
    organization_details = OrganizationSerializer(source="organization", read_only=True)

    class Meta:
        model = InternshipPosition
        fields = [
            "id",
            "title",
            "organization",
            "organization_details",
            "description",
            "required_skills",
            "capacity",
            "requirements",
            "location",
            "start_date",
            "end_date",
            "is_active",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]
        extra_kwargs = {
            "organization": {"required": False},
        }


class ApplicationSerializer(serializers.ModelSerializer):
    student_details = StudentProfileSerializer(source="student", read_only=True)
    position_details = InternshipPositionSerializer(source="position", read_only=True)

    class Meta:
        model = Application
        fields = [
            "id",
            "student",
            "student_details",
            "position",
            "position_details",
            "cover_letter",
            "cv",
            "status",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]
        extra_kwargs = {
            "student": {"required": False},
        }


class PlacementSerializer(serializers.ModelSerializer):
    student_details = serializers.SerializerMethodField()
    supervisor_details = SupervisorProfileSerializer(source="supervisor", read_only=True)
    application_details = ApplicationSerializer(source="application", read_only=True)

    class Meta:
        model = Placement
        fields = [
            "id",
            "application",
            "application_details",
            "student_details",
            "supervisor",
            "supervisor_details",
            "start_date",
            "end_date",
            "confirmed",
        ]

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
