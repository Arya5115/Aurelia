from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0002_seed_services"),
    ]

    operations = [
        migrations.AddField(
            model_name="booking",
            name="payment_amount",
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True),
        ),
        migrations.AddField(
            model_name="booking",
            name="payment_currency",
            field=models.CharField(blank=True, max_length=10),
        ),
        migrations.AddField(
            model_name="booking",
            name="payment_provider",
            field=models.CharField(blank=True, max_length=50),
        ),
        migrations.AddField(
            model_name="booking",
            name="payment_reference",
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name="booking",
            name="payment_status",
            field=models.CharField(
                choices=[("pending", "Pending"), ("paid", "Paid"), ("failed", "Failed"), ("refunded", "Refunded")],
                default="pending",
                max_length=20,
            ),
        ),
    ]
