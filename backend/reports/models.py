from django.db import models


class Report(models.Model):
    class Type(models.TextChoices):
        WEEKLY = "WEEKLY"
        FINAL = "FINAL"

    student = models.ForeignKey("authapi.StudentProfile", on_delete=models.CASCADE)
    type = models.CharField(max_length=20, choices=Type.choices)
    file = models.FileField(upload_to="reports/")
    feedback = models.TextField(blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student} - {self.type}"
