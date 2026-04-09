from django.db import migrations


def seed_services(apps, schema_editor):
    Service = apps.get_model("api", "Service")

    defaults = [
        {
            "title": "Signature Massage",
            "category": "Body",
            "duration": "90 min",
            "price": "180.00",
            "description": "A restorative massage designed to release tension and restore balance.",
        },
        {
            "title": "Radiance Facial",
            "category": "Skin",
            "duration": "75 min",
            "price": "150.00",
            "description": "A botanical facial treatment focused on glow, hydration, and skin renewal.",
        },
        {
            "title": "Luxury Hair Styling",
            "category": "Hair",
            "duration": "120 min",
            "price": "220.00",
            "description": "Premium styling and finishing tailored to events and special occasions.",
        },
        {
            "title": "Artisan Nail Design",
            "category": "Nails",
            "duration": "60 min",
            "price": "95.00",
            "description": "Detailed nail artistry paired with a luxury hand-care experience.",
        },
    ]

    for service in defaults:
        Service.objects.get_or_create(title=service["title"], defaults=service)


def remove_seed_services(apps, schema_editor):
    Service = apps.get_model("api", "Service")
    Service.objects.filter(
        title__in=[
            "Signature Massage",
            "Radiance Facial",
            "Luxury Hair Styling",
            "Artisan Nail Design",
        ]
    ).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_services, remove_seed_services),
    ]
