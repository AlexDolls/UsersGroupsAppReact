from django.urls import path

from . import views

app_name = "userslist"

urlpatterns = [
            path("", views.index, name = "index"),
        ]
