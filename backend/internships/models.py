import uuid

from django.db import models

class Organization(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    address = models.TextField()
    contact_email = models.EmailField()

    def __str__(self):
        return self.name
    
class InternshipPosition(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    description = models.TextField()
    required_skills = models.TextField()
    capacity = models.IntegerField()

    def __str__(self):
        return self.title
    
class Application(models.Model):
    class Status(models.TextChoices):
        PENDING = "PENDING"
        APPROVED = "APPROVED"
        REJECTED = "REJECTED"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey("accounts.StudentProfile", on_delete=models.CASCADE)
    position = models.ForeignKey(InternshipPosition, on_delete=models.CASCADE)
    cover_letter = models.TextField()
    cv = models.FileField(upload_to="cvs/")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student} - {self.position}"
    
class Application(models.Model):
    class Status(models.TextChoices):
        PENDING = "PENDING"
        APPROVED = "APPROVED"
        REJECTED = "REJECTED"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey("accounts.StudentProfile", on_delete=models.CASCADE)
    position = models.ForeignKey(InternshipPosition, on_delete=models.CASCADE)
    cover_letter = models.TextField()
    cv = models.FileField(upload_to="cvs/")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student} - {self.position}"
    
class Placement(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    application = models.OneToOneField(Application, on_delete=models.CASCADE)
    supervisor = models.ForeignKey("accounts.SupervisorProfile", on_delete=models.SET_NULL, null=True)
    start_date = models.DateField()
    end_date = models.DateField()
    confirmed = models.BooleanField(default=False)

    def __str__(self):
        return str(self.application)
