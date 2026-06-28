from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("evaluations", "0002_evaluationcriterion_evaluationrating"),
    ]

    operations = [
        migrations.AddField(
            model_name="evaluation",
            name="criterion_scores",
            field=models.JSONField(blank=True, default=dict),
        ),
    ]
