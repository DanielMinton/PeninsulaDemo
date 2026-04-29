from django.db import models


class Vehicle(models.Model):
    STATUS_ACTIVE = 'active'
    STATUS_MAINTENANCE = 'maintenance'
    STATUS_RETIRED = 'retired'

    STATUS_CHOICES = [
        (STATUS_ACTIVE, 'Active'),
        (STATUS_MAINTENANCE, 'In Maintenance'),
        (STATUS_RETIRED, 'Retired'),
    ]

    name = models.CharField(max_length=100)
    make = models.CharField(max_length=100, blank=True)
    model_name = models.CharField(max_length=100, blank=True)
    year = models.IntegerField(null=True, blank=True)
    license_plate = models.CharField(max_length=20, blank=True)
    capacity_cubic_yards = models.DecimalField(max_digits=5, decimal_places=1, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_ACTIVE)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        verbose_name = 'Vehicle'
        verbose_name_plural = 'Vehicles'

    def __str__(self):
        return f'{self.name} ({self.get_status_display()})'


class Equipment(models.Model):
    name = models.CharField(max_length=200)
    equipment_type = models.CharField(max_length=100)
    serial_number = models.CharField(max_length=100, blank=True)
    active = models.BooleanField(default=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']
        verbose_name = 'Equipment'
        verbose_name_plural = 'Equipment'

    def __str__(self):
        return f'{self.name} ({self.equipment_type})'
