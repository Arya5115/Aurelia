from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Profile, UserRole


@receiver(post_save, sender=User)
def ensure_user_profile_and_role(sender, instance, created, **kwargs):
    if created:
        Profile.objects.get_or_create(user=instance)

    default_role = "admin" if instance.is_superuser or instance.is_staff else "user"
    UserRole.objects.get_or_create(user=instance, role=default_role)
