from django.db import models


class ServiceArea(models.Model):
    city = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    county = models.CharField(max_length=100)
    summary = models.TextField()
    services = models.JSONField(default=list)
    seo_title = models.CharField(max_length=200)
    seo_description = models.CharField(max_length=320)
    active = models.BooleanField(default=True)

    class Meta:
        ordering = ['city']
        verbose_name = 'Service Area'
        verbose_name_plural = 'Service Areas'

    def __str__(self):
        return f'{self.city}, {self.county} County'


class Lead(models.Model):
    STATUS_NEW = 'new'
    STATUS_CONTACTED = 'contacted'
    STATUS_QUOTED = 'quoted'
    STATUS_SCHEDULED = 'scheduled'
    STATUS_COMPLETED = 'completed'
    STATUS_LOST = 'lost'

    STATUS_CHOICES = [
        (STATUS_NEW, 'New'),
        (STATUS_CONTACTED, 'Contacted'),
        (STATUS_QUOTED, 'Quoted'),
        (STATUS_SCHEDULED, 'Scheduled'),
        (STATUS_COMPLETED, 'Completed'),
        (STATUS_LOST, 'Lost'),
    ]

    SERVICE_CHOICES = [
        ('junk_removal', 'Junk Removal'),
        ('construction_debris', 'Construction Debris Removal'),
        ('appliance_removal', 'Appliance Removal'),
        ('storage_cleanout', 'Storage Cleanout'),
        ('eviction_cleanout', 'Eviction Cleanout'),
        ('commercial_hauling', 'Commercial Hauling'),
        ('residential_cleanout', 'Residential Cleanout'),
        ('other', 'Other / Not Sure'),
    ]

    LOAD_SIZE_CHOICES = [
        ('single_item', 'Single Item'),
        ('quarter_truck', 'Small Load (1/4 Truck)'),
        ('half_truck', 'Medium Load (1/2 Truck)'),
        ('full_truck', 'Large Load (Full Truck)'),
    ]

    URGENCY_CHOICES = [
        ('flexible', 'Flexible'),
        ('this_week', 'This Week'),
        ('asap', 'ASAP'),
    ]

    name = models.CharField(max_length=200)
    phone = models.CharField(max_length=25)
    email = models.EmailField(blank=True)
    service_requested = models.CharField(max_length=50, choices=SERVICE_CHOICES, default='other')
    message = models.TextField(blank=True)
    service_location = models.CharField(max_length=200)
    preferred_date = models.DateField(null=True, blank=True)
    load_size = models.CharField(max_length=30, choices=LOAD_SIZE_CHOICES, blank=True)
    urgency = models.CharField(max_length=20, choices=URGENCY_CHOICES, blank=True)
    source_page = models.CharField(max_length=500, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_NEW)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Lead'
        verbose_name_plural = 'Leads'

    def __str__(self):
        return f'{self.name} | {self.get_service_requested_display()} | {self.get_status_display()}'


class Testimonial(models.Model):
    customer_name = models.CharField(max_length=200)
    source = models.CharField(max_length=100, default='Verified Customer')
    quote = models.TextField()
    service_type = models.CharField(max_length=100)
    verified = models.BooleanField(default=False)
    display_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['display_order', '-created_at']
        verbose_name = 'Testimonial'
        verbose_name_plural = 'Testimonials'

    def __str__(self):
        return f'{self.customer_name} ({self.service_type})'


class JobPhoto(models.Model):
    TYPE_BEFORE = 'before'
    TYPE_AFTER = 'after'
    TYPE_DURING = 'during'
    TYPE_OVERVIEW = 'overview'

    TYPE_CHOICES = [
        (TYPE_BEFORE, 'Before'),
        (TYPE_AFTER, 'After'),
        (TYPE_DURING, 'During'),
        (TYPE_OVERVIEW, 'Overview'),
    ]

    title = models.CharField(max_length=200)
    caption = models.TextField(blank=True)
    before_after_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    image = models.ImageField(upload_to='job-photos/%Y/%m/')
    service_area = models.ForeignKey(
        ServiceArea,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='photos',
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Job Photo'
        verbose_name_plural = 'Job Photos'

    def __str__(self):
        return f'{self.title} ({self.get_before_after_type_display()})'
