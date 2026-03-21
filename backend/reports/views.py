from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Report
from .serializers import ReportSerializer
from auditlogs.audit_log_utils import log_action


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

    @action(detail=True, methods=["post"])
    def set_feedback(self, request, pk=None):
        report = self.get_object()
        if request.user.role not in ["Supervisor", "Admin", "Coordinator"] and not request.user.is_staff:
            return Response({"detail": "Not allowed."}, status=status.HTTP_403_FORBIDDEN)
        feedback = request.data.get("feedback", "")
        report.feedback = feedback
        report.save(update_fields=["feedback"])
        log_action(
            request,
            action="REPORT_FEEDBACK_SET",
            target_user=report.student.user if hasattr(report.student, "user") else None,
            additional_data={"report_id": report.id},
        )
        return Response({"message": "Feedback updated.", "feedback": report.feedback})

# Create your views here.
