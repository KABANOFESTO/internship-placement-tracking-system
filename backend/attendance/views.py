from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.db import models
from .models import AttendanceRecord
from .serializers import AttendanceRecordSerializer


class AttendanceRecordViewSet(viewsets.ModelViewSet):
    serializer_class = AttendanceRecordSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = AttendanceRecord.objects.select_related("student", "student__user", "supervisor")
        if self.request.user.is_staff or self.request.user.role in ["Admin", "Coordinator"]:
            return queryset
        if hasattr(self.request.user, "supervisorprofile"):
            return queryset.filter(supervisor=self.request.user.supervisorprofile)
        if hasattr(self.request.user, "studentprofile"):
            return queryset.filter(student=self.request.user.studentprofile)
        return queryset.none()

    def perform_create(self, serializer):
        if self.request.user.role not in ["Supervisor", "Admin", "Coordinator"] and not self.request.user.is_staff:
            raise ValidationError("Only supervisors or admins can create attendance records.")
        if self.request.user.role == "Supervisor" and hasattr(self.request.user, "supervisorprofile"):
            serializer.save(supervisor=self.request.user.supervisorprofile)
            return
        serializer.save()

    @action(detail=False, methods=["get"])
    def statistics(self, request):
        if request.user.role not in ["Admin", "Coordinator", "Supervisor"] and not request.user.is_staff:
            return Response({"detail": "Not allowed."}, status=status.HTTP_403_FORBIDDEN)
        queryset = self.get_queryset()
        by_status = queryset.values("status").annotate(count=models.Count("id"))
        return Response({"total": queryset.count(), "by_status": list(by_status)})
