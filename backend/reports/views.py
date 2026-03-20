from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from .models import Report
from .serializers import ReportSerializer


class ReportViewSet(viewsets.ModelViewSet):
    serializer_class = ReportSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Report.objects.select_related("student", "student__user").order_by("-submitted_at")
        if self.request.user.is_staff or self.request.user.role in ["Admin", "Coordinator"]:
            return queryset
        if self.request.user.role == "Supervisor":
            return queryset
        if hasattr(self.request.user, "studentprofile"):
            return queryset.filter(student=self.request.user.studentprofile)
        return queryset.none()

    def perform_create(self, serializer):
        if self.request.user.role == "Supervisor":
            raise ValidationError("Supervisors cannot submit reports.")
        if (self.request.user.is_staff or self.request.user.role in ["Admin", "Coordinator"]) and serializer.validated_data.get("student"):
            serializer.save()
            return
        if hasattr(self.request.user, "studentprofile"):
            serializer.save(student=self.request.user.studentprofile)
            return
        raise ValidationError("Student profile not found for current user.")

# Create your views here.
