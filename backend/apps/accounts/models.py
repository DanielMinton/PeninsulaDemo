from django.db import models
from django.contrib.auth.models import User


class ClientProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='client_profile')
    phone = models.CharField(max_length=25, blank=True)
    service_address = models.CharField(max_length=300, blank=True)
    city = models.CharField(max_length=100, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Client Profile'
        verbose_name_plural = 'Client Profiles'

    def __str__(self):
        return f'{self.user.get_full_name() or self.user.username}'
