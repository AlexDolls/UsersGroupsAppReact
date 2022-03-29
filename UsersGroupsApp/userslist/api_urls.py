from django.urls import path

from . import views

app_name = "userslist_api"

urlpatterns = [
        path('users/', views.all_users, name = "all_users"),
        path('users/<int:user_id>/', views.get_user, name = "get_user"),
        path('users/create/<str:username>/<str:password>/', views.create_user, name = "create_user"),
        path('users/<int:user_id>/remove/', views.remove_user, name = "remove_user"),
        path('users/<int:user_id>/change/password/<str:new_password>/', views.change_password, name = "change_password"),
        path('users/<int:user_id>/change/username/', views.change_username, name = "change_username"),
        path('users/<int:user_id>/change/addgroup/', views.change_group, name = "change_group"),
        path('groups/', views.all_groups, name = "all_groups"),
        path('groups/<int:group_id>/', views.get_group, name = "get_group"),
        path('groups/create/<str:group_name>/<str:desc>/', views.create_group, name = "create group"),
        path('groups/<int:group_id>/remove/', views.remove_group, name = "remove_group"),
        path('groups/<int:group_id>/change/groupname/<str:new_group_name>/', views.change_group_name, name = "change_group_name"),
        path('groups/<int:group_id>/change/groupdesc/<str:new_group_desc>/', views.change_group_desc, name = "change_group_desc"),
        ]

