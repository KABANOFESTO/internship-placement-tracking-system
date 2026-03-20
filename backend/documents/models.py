from django.db import models
class Document(models.Model):
    user = models.ForeignKey("accounts.User", on_delete=models.CASCADE)
    file = models.FileField(upload_to="documents/")
    name = models.CharField(max_length=255)
    uploaded_at = models.DateTimeField(auto_now_add=True)
