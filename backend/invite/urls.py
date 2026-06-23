from django.urls import path

from .views import response_view


urlpatterns = [
    path("response/", response_view, name="invite-response"),
]
