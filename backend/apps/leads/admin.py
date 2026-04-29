from django.contrib import admin
from .models import Lead, ServiceArea, Testimonial, JobPhoto


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ['name', 'phone', 'service_requested', 'service_location', 'status', 'created_at']
    list_filter = ['status', 'service_requested', 'urgency', 'created_at']
    search_fields = ['name', 'phone', 'email', 'service_location', 'message']
    readonly_fields = ['created_at', 'updated_at', 'source_page']
    list_editable = ['status']
    ordering = ['-created_at']

    fieldsets = (
        ('Customer', {
            'fields': ('name', 'phone', 'email'),
        }),
        ('Job Details', {
            'fields': ('service_requested', 'service_location', 'load_size', 'urgency', 'preferred_date', 'message'),
        }),
        ('Pipeline', {
            'fields': ('status', 'notes'),
        }),
        ('Tracking', {
            'fields': ('source_page', 'created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )


@admin.register(ServiceArea)
class ServiceAreaAdmin(admin.ModelAdmin):
    list_display = ['city', 'county', 'active', 'slug']
    list_filter = ['active', 'county']
    prepopulated_fields = {'slug': ('city',)}
    search_fields = ['city', 'county']


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ['customer_name', 'service_type', 'source', 'verified', 'display_order']
    list_filter = ['verified', 'service_type']
    list_editable = ['verified', 'display_order']
    search_fields = ['customer_name', 'quote']


@admin.register(JobPhoto)
class JobPhotoAdmin(admin.ModelAdmin):
    list_display = ['title', 'before_after_type', 'service_area', 'created_at']
    list_filter = ['before_after_type', 'service_area']
    search_fields = ['title', 'caption']
