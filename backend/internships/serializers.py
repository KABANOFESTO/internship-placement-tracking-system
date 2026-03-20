from rest_framework import serializers
from .models import Organization, InternshipPosition, Application, Placement


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ["id", "name", "address", "contact_email"]


class InternshipPositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = InternshipPosition
        fields = ["id", "title", "organization", "description", "required_skills", "capacity"]


class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ["id", "student", "position", "cover_letter", "cv", "status", "created_at"]
        read_only_fields = ["id", "created_at"]


class PlacementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Placement
        fields = ["id", "application", "supervisor", "start_date", "end_date", "confirmed"]
