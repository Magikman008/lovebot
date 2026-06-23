from django.urls import include, path, re_path

from invite.views import spa_index


urlpatterns = [
    path("api/", include("invite.urls")),
    re_path(r"^.*$", spa_index, name="spa-index"),
]
