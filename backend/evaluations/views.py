from django.db import models
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from .models import Evaluation, EvaluationCriterion, EvaluationRating
from .serializers import (
    EvaluationSerializer,
    EvaluationCriterionSerializer,
    EvaluationRatingSerializer,
)


class EvaluationViewSet(viewsets.ModelViewSet):
    serializer_class = EvaluationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Evaluation.objects.select_related("student", "supervisor").order_by("-created_at")
        if self.request.user.is_staff or self.request.user.role in ["Admin", "Coordinator"]:
            return queryset
        if self.request.user.role == "Supervisor":
            return queryset.filter(supervisor=self.request.user.supervisorprofile)
        if hasattr(self.request.user, "studentprofile"):
            return queryset.filter(student=self.request.user.studentprofile)
        return queryset.none()

    def perform_create(self, serializer):
        if self.request.user.role not in ["Supervisor", "Admin", "Coordinator"] and not self.request.user.is_staff:
            raise ValidationError("Only supervisors or admins can create evaluations.")
        if self.request.user.role == "Supervisor" and hasattr(self.request.user, "supervisorprofile"):
            serializer.save(supervisor=self.request.user.supervisorprofile)
            return
        serializer.save()

    @action(detail=False, methods=["get"])
    def statistics(self, request):
        if request.user.role not in ["Admin", "Coordinator"] and not request.user.is_staff:
            return Response({"detail": "Not allowed."}, status=status.HTTP_403_FORBIDDEN)
        total = Evaluation.objects.count()
        by_type = Evaluation.objects.values("evaluation_type").annotate(count=models.Count("id"))
        avg_score = Evaluation.objects.aggregate(avg=models.Avg("score"))
        return Response({"total": total, "by_type": list(by_type), "avg_score": avg_score.get("avg")})


class EvaluationCriterionViewSet(viewsets.ModelViewSet):
    queryset = EvaluationCriterion.objects.all().order_by("name")
    serializer_class = EvaluationCriterionSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        if request.user.role not in ["Admin", "Coordinator"] and not request.user.is_staff:
            raise ValidationError("Only admins or coordinators can create criteria.")
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        if request.user.role not in ["Admin", "Coordinator"] and not request.user.is_staff:
            raise ValidationError("Only admins or coordinators can update criteria.")
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        if request.user.role not in ["Admin", "Coordinator"] and not request.user.is_staff:
            raise ValidationError("Only admins or coordinators can delete criteria.")
        return super().destroy(request, *args, **kwargs)


class EvaluationRatingViewSet(viewsets.ModelViewSet):
    serializer_class = EvaluationRatingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = EvaluationRating.objects.select_related("evaluation", "criterion").all()
        if self.request.user.is_staff or self.request.user.role in ["Admin", "Coordinator"]:
            return queryset
        if self.request.user.role == "Supervisor":
            return queryset.filter(evaluation__supervisor=self.request.user.supervisorprofile)
        if hasattr(self.request.user, "studentprofile"):
            return queryset.filter(evaluation__student=self.request.user.studentprofile)
        return queryset.none()

    def perform_create(self, serializer):
        if self.request.user.role not in ["Supervisor", "Admin", "Coordinator"] and not self.request.user.is_staff:
            raise ValidationError("Only supervisors or admins can create ratings.")
        serializer.save()

# Create your views here.
