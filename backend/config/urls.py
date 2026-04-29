from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

admin.site.site_header = 'Peninsula Pick Ups Admin'
admin.site.site_title = 'Peninsula Pick Ups'
admin.site.index_title = 'Business Operations'

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('apps.api.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
