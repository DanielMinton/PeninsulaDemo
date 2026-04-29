import re
from rest_framework import serializers
from .models import Lead, ServiceArea, Testimonial, JobPhoto


class LeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = [
            'id', 'name', 'phone', 'email', 'service_requested',
            'message', 'service_location', 'preferred_date',
            'load_size', 'urgency', 'source_page', 'status', 'created_at',
        ]
        read_only_fields = ['id', 'status', 'created_at']

    def validate_name(self, value):
        if len(value.strip()) < 2:
            raise serializers.ValidationError('Please enter your full name.')
        return value.strip()

    def validate_phone(self, value):
        digits = re.sub(r'\D', '', value)
        if len(digits) < 10:
            raise serializers.ValidationError('Please enter a valid 10-digit phone number.')
        return value.strip()

    def validate_service_location(self, value):
        if len(value.strip()) < 2:
            raise serializers.ValidationError('Please enter your service city or address.')
        return value.strip()


class ServiceAreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceArea
        fields = '__all__'


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = '__all__'


class JobPhotoSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = JobPhoto
        fields = ['id', 'title', 'caption', 'before_after_type', 'image_url', 'service_area', 'created_at']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None
