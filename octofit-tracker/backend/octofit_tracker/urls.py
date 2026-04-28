"""octofit_tracker URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.http import require_http_methods
from rest_framework import routers
from teams.views import TeamViewSet


@require_http_methods(["GET"])
def csrf_token_view(request):
    """Return CSRF token for the client"""
    token = get_token(request)
    return JsonResponse({'csrfToken': token})

# Create a router and register our viewsets
router = routers.DefaultRouter()
router.register(r'teams', TeamViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/csrf/', csrf_token_view, name='csrf-token'),
    path('api/', include(router.urls)),
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
]
