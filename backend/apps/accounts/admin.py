from django.contrib import admin
from .models import ClientProfile


@admin.register(ClientProfile)
class ClientProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'phone', 'city', 'created_at']
    search_fields = ['user__username', 'user__first_name', 'user__last_name', 'phone', 'city']
    raw_id_fields = ['user']
