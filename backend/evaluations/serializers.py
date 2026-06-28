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

    def validate(self, attrs):
        criterion = attrs.get("criterion") or getattr(self.instance, "criterion", None)
        score = attrs.get("score")
        if criterion and score is not None and score > criterion.max_score:
            raise serializers.ValidationError({"score": f"Score cannot exceed the criterion maximum of {criterion.max_score}."})
        return attrs


class EvaluationSerializer(serializers.ModelSerializer):
    ratings = EvaluationRatingSerializer(many=True, read_only=True)
    student_details = StudentProfileSerializer(source="student", read_only=True)
    max_score = serializers.SerializerMethodField()
    percentage = serializers.SerializerMethodField()
    score_out_of_20_component = serializers.SerializerMethodField()
    criterion_scores = serializers.JSONField(required=False)

    CRITERIA = {
        "professional_knowledge": "Professional Knowledge",
        "professional_qualities": "Professional Qualities",
        "personal_qualities": "Personal Qualities",
        "responsibility": "Responsibility",
        "relationship_with_coworkers": "Relationship with Co-workers",
    }

    class Meta:
        model = Evaluation
        fields = [
            "id",
            "student",
            "student_details",
            "supervisor",
            "evaluation_type",
            "score",
            "criterion_scores",
            "max_score",
            "percentage",
            "score_out_of_20_component",
            "feedback",
            "created_at",
            "ratings",
        ]
        read_only_fields = ["id", "created_at"]
        extra_kwargs = {
            "score": {"required": False},
        }

    def get_max_score(self, obj):
        return 50

    def get_percentage(self, obj):
        return round((obj.score / 50) * 100, 1)

    def get_score_out_of_20_component(self, obj):
        return round((obj.score / 50) * 10, 2)

    def validate_criterion_scores(self, value):
        if value in [None, ""]:
            return {}
        if not isinstance(value, dict):
            raise serializers.ValidationError("criterion_scores must be an object of score values.")

        validated = {}
        errors = {}
        for key, label in self.CRITERIA.items():
            raw_score = value.get(key)
            if raw_score is None:
                errors[key] = f"{label} is required."
                continue
            try:
                score = int(raw_score)
            except (TypeError, ValueError):
                errors[key] = f"{label} must be a whole number."
                continue
            if score < 0 or score > 10:
                errors[key] = f"{label} must be between 0 and 10."
                continue
            validated[key] = score

        if errors:
            raise serializers.ValidationError(errors)
        return validated

    def validate(self, attrs):
        criterion_scores = attrs.get("criterion_scores")
        if criterion_scores:
            attrs["score"] = sum(criterion_scores.values())
        elif attrs.get("score") is None and self.instance is None:
            raise serializers.ValidationError({"score": "Score or criterion scores are required."})

        score = attrs.get("score")
        if score is not None and (score < 0 or score > 50):
            raise serializers.ValidationError({"score": "Score must be between 0 and 50 for each midterm or final evaluation."})
        return attrs

    def validate_student(self, value):
        if value is None:
            raise serializers.ValidationError("Student is required.")

        if isinstance(value, StudentProfile):
            return value

        student_profile = StudentProfile.objects.filter(pk=value).first()
        if student_profile:
            return student_profile

        user = User.objects.filter(pk=value, role=User.Role.STUDENT).first()
        if user:
            student_profile = getattr(user, "studentprofile", None)
            if student_profile:
                return student_profile

        raise serializers.ValidationError("Selected student does not exist.")


class EvaluationSummarySerializer(serializers.Serializer):
    student = StudentProfileSerializer()
    midterm = EvaluationSerializer(allow_null=True)
    final = EvaluationSerializer(allow_null=True)
    midterm_score = serializers.IntegerField(allow_null=True)
    final_score = serializers.IntegerField(allow_null=True)
    total_score = serializers.IntegerField()
    total_max_score = serializers.IntegerField()
    final_score_out_of_20 = serializers.FloatField(allow_null=True)
    is_complete = serializers.BooleanField()
