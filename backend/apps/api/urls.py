from django.urls import path
from .views import health_check
from apps.leads.views import (
    LeadCreateView,
    ServiceAreaListView,
    ServiceAreaDetailView,
    TestimonialListView,
    JobPhotoListView,
)

urlpatterns = [
    path('health/', health_check, name='health-check'),
    path('leads/', LeadCreateView.as_view(), name='lead-create'),
    path('service-areas/', ServiceAreaListView.as_view(), name='service-area-list'),
    path('service-areas/<slug:slug>/', ServiceAreaDetailView.as_view(), name='service-area-detail'),
    path('testimonials/', TestimonialListView.as_view(), name='testimonial-list'),
    path('job-photos/', JobPhotoListView.as_view(), name='job-photo-list'),
]
