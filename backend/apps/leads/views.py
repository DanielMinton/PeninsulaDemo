from rest_framework import generics, status
from rest_framework.response import Response
from .models import Lead, ServiceArea, Testimonial, JobPhoto
from .serializers import (
    LeadSerializer,
    ServiceAreaSerializer,
    TestimonialSerializer,
    JobPhotoSerializer,
)


class LeadCreateView(generics.CreateAPIView):
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        if not data.get('source_page'):
            data['source_page'] = request.META.get('HTTP_REFERER', '')

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            {
                'message': 'Your quote request has been received. Peninsula Pick Ups will reach out to you shortly.',
                'id': serializer.data['id'],
            },
            status=status.HTTP_201_CREATED,
        )


class ServiceAreaListView(generics.ListAPIView):
    queryset = ServiceArea.objects.filter(active=True)
    serializer_class = ServiceAreaSerializer


class ServiceAreaDetailView(generics.RetrieveAPIView):
    queryset = ServiceArea.objects.filter(active=True)
    serializer_class = ServiceAreaSerializer
    lookup_field = 'slug'


class TestimonialListView(generics.ListAPIView):
    queryset = Testimonial.objects.filter(verified=True)
    serializer_class = TestimonialSerializer


class JobPhotoListView(generics.ListAPIView):
    queryset = JobPhoto.objects.all()
    serializer_class = JobPhotoSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
