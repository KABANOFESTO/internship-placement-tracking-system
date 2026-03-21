from rest_framework import serializers
from .models import Evaluation, EvaluationCriterion, EvaluationRating
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


class EvaluationCriterionSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvaluationCriterion
        fields = ["id", "name", "description", "max_score", "is_active"]


class EvaluationRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvaluationRating
        fields = ["id", "evaluation", "criterion", "score", "comment"]


class EvaluationSerializer(serializers.ModelSerializer):
    ratings = EvaluationRatingSerializer(many=True, read_only=True)
    student_details = StudentProfileSerializer(source="student", read_only=True)

    class Meta:
        model = Evaluation
        fields = [
            "id",
            "student",
            "student_details",
            "supervisor",
            "evaluation_type",
            "score",
            "feedback",
            "created_at",
            "ratings",
        ]
        read_only_fields = ["id", "created_at"]
