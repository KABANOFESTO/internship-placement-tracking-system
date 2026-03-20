from rest_framework import serializers
from .models import Evaluation, EvaluationCriterion, EvaluationRating


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

    class Meta:
        model = Evaluation
        fields = [
            "id",
            "student",
            "supervisor",
            "evaluation_type",
            "score",
            "feedback",
            "created_at",
            "ratings",
        ]
        read_only_fields = ["id", "created_at"]
