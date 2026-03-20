from django.db import models
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Organization, InternshipPosition, Application, Placement
from .serializers import (
    OrganizationSerializer,
    InternshipPositionSerializer,
    ApplicationSerializer,
    PlacementSerializer,
)


class OrganizationViewSet(viewsets.ModelViewSet):
    queryset = Organization.objects.all().order_by("name")
    serializer_class = OrganizationSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        if request.user.role not in ["Admin", "Coordinator"] and not request.user.is_staff:
            raise ValidationError("Only admins or coordinators can create organizations.")
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        if request.user.role not in ["Admin", "Coordinator"] and not request.user.is_staff:
            raise ValidationError("Only admins or coordinators can update organizations.")
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        if request.user.role not in ["Admin", "Coordinator"] and not request.user.is_staff:
            raise ValidationError("Only admins or coordinators can delete organizations.")
        return super().destroy(request, *args, **kwargs)


class InternshipPositionViewSet(viewsets.ModelViewSet):
    queryset = InternshipPosition.objects.select_related("organization").all()
    serializer_class = InternshipPositionSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        if request.user.role not in ["Admin", "Coordinator"] and not request.user.is_staff:
            raise ValidationError("Only admins or coordinators can create positions.")
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        if request.user.role not in ["Admin", "Coordinator"] and not request.user.is_staff:
            raise ValidationError("Only admins or coordinators can update positions.")
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        if request.user.role not in ["Admin", "Coordinator"] and not request.user.is_staff:
            raise ValidationError("Only admins or coordinators can delete positions.")
        return super().destroy(request, *args, **kwargs)

    @action(detail=False, methods=["get"])
    def recommendations(self, request):
        student = getattr(request.user, "studentprofile", None)
        student_id = request.query_params.get("student_id")
        if student_id and request.user.role in ["Admin", "Coordinator"]:
            try:
                from auth.models import StudentProfile

                student = StudentProfile.objects.get(id=student_id)
            except StudentProfile.DoesNotExist:
                return Response({"detail": "Student not found."}, status=status.HTTP_404_NOT_FOUND)
        if not student:
            return Response({"detail": "Student profile required."}, status=status.HTTP_400_BAD_REQUEST)

        student_skills = {s.strip().lower() for s in (student.skills or "").split(",") if s.strip()}
        recommendations = []
        for position in InternshipPosition.objects.all():
            required_skills = {s.strip().lower() for s in (position.required_skills or "").split(",") if s.strip()}
            if not required_skills:
                score = 0
            else:
                score = len(student_skills & required_skills) / len(required_skills)
            recommendations.append(
                {
                    "position": position,
                    "match_score": round(score, 2),
                    "matched_skills": sorted(student_skills & required_skills),
                }
            )

        recommendations.sort(key=lambda x: x["match_score"], reverse=True)
        top_n = int(request.query_params.get("top", 10))
        serializer = InternshipPositionSerializer([r["position"] for r in recommendations[:top_n]], many=True)
        for idx, data in enumerate(serializer.data):
            data["match_score"] = recommendations[idx]["match_score"]
            data["matched_skills"] = recommendations[idx]["matched_skills"]
        return Response(serializer.data)


class ApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Application.objects.select_related("student", "position").order_by("-created_at")
        if self.request.user.is_staff or self.request.user.role in ["Admin", "Coordinator"]:
            return queryset
        if self.request.user.role == "Supervisor":
            return queryset
        if hasattr(self.request.user, "studentprofile"):
            return queryset.filter(student=self.request.user.studentprofile)
        return queryset.none()

    def perform_create(self, serializer):
        if self.request.user.role in ["Supervisor", "Coordinator"]:
            raise ValidationError("Only students or admins can submit applications.")
        if (self.request.user.is_staff or self.request.user.role == "Admin") and serializer.validated_data.get("student"):
            serializer.save()
            return
        if hasattr(self.request.user, "studentprofile"):
            serializer.save(student=self.request.user.studentprofile)
            return
        raise ValidationError("Student profile not found for current user.")

    def update(self, request, *args, **kwargs):
        if request.user.role not in ["Admin", "Coordinator"] and not request.user.is_staff:
            raise ValidationError("Only admins or coordinators can update applications.")
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        if request.user.role not in ["Admin", "Coordinator"] and not request.user.is_staff:
            raise ValidationError("Only admins or coordinators can delete applications.")
        return super().destroy(request, *args, **kwargs)

    @action(detail=False, methods=["get"])
    def statistics(self, request):
        if request.user.role not in ["Admin", "Coordinator"] and not request.user.is_staff:
            return Response({"detail": "Not allowed."}, status=status.HTTP_403_FORBIDDEN)
        total = Application.objects.count()
        by_status = Application.objects.values("status").annotate(count=models.Count("id"))
        return Response({"total": total, "by_status": list(by_status)})


class PlacementViewSet(viewsets.ModelViewSet):
    queryset = Placement.objects.select_related("application", "supervisor").all()
    serializer_class = PlacementSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Placement.objects.select_related("application", "supervisor", "application__student").all()
        if self.request.user.is_staff or self.request.user.role in ["Admin", "Coordinator"]:
            return queryset
        if hasattr(self.request.user, "supervisorprofile"):
            return queryset.filter(supervisor=self.request.user.supervisorprofile)
        if hasattr(self.request.user, "studentprofile"):
            return queryset.filter(application__student=self.request.user.studentprofile)
        return queryset.none()

    def create(self, request, *args, **kwargs):
        if request.user.role not in ["Admin", "Coordinator"] and not request.user.is_staff:
            raise ValidationError("Only admins or coordinators can create placements.")
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        if request.user.role not in ["Admin", "Coordinator"] and not request.user.is_staff:
            raise ValidationError("Only admins or coordinators can update placements.")
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        if request.user.role not in ["Admin", "Coordinator"] and not request.user.is_staff:
            raise ValidationError("Only admins or coordinators can delete placements.")
        return super().destroy(request, *args, **kwargs)

    @action(detail=False, methods=["get"])
    def statistics(self, request):
        if request.user.role not in ["Admin", "Coordinator"] and not request.user.is_staff:
            return Response({"detail": "Not allowed."}, status=status.HTTP_403_FORBIDDEN)
        total = Placement.objects.count()
        confirmed = Placement.objects.filter(confirmed=True).count()
        by_supervisor = Placement.objects.values("supervisor").annotate(count=models.Count("id"))
        return Response({"total": total, "confirmed": confirmed, "by_supervisor": list(by_supervisor)})

# Create your views here.
