from django.contrib import admin
from .models import Vehicle, Equipment


@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = ['name', 'make', 'model_name', 'year', 'capacity_cubic_yards', 'status']
    list_filter = ['status']
    search_fields = ['name', 'make', 'model_name', 'license_plate']


@admin.register(Equipment)
class EquipmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'equipment_type', 'active']
    list_filter = ['active', 'equipment_type']
    search_fields = ['name', 'serial_number']
