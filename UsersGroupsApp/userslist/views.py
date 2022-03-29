from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from django.contrib.auth.models import User
from .models import Group
from django.db import IntegrityError

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.parsers import JSONParser

from .serializers import UsersSerializer, GroupsSerializer



# Make interaction with Group model easier
class GroupActions(object):

    @classmethod
    def create_group(cls, name: str, desc: str):
        try:
            new_group = Group.objects.create(name=name, description=desc)
            new_group.save()
            return {"detail":"Group with name - {0} and descirption - {1} was created".format(new_group.name, new_group.description)}
        except IntegrityError:
            return {"error":"Group with this name is already exists"}

    @classmethod
    def remove_group(cls, group_id: int):
        group = cls.get_group(group_id=group_id)
        if group.user_set.count() == 0:
            group_name = group.name
            group_id = group.id
            group_users_count = group.user_set.all().count()
            group.delete()
            return {"detail":"Group with name {0} and ID {1} was deleted. Users count - {2}".format(group_name, group_id, group_users_count)}
        else:
            return {"error":"Can't delete group while users attached to it."}

    @classmethod
    def change_group_name(cls, name: str, group_id: int):
        group = cls.get_group(group_id)
        group.name = name
        try:
            group.save()
            return {"detail":"Name of group with id {0} was changed on {1}".format(group.id, group.name)}
        except IntegrityError:
            return {"error":"Group with this name is already exists"}

    @classmethod
    def change_group_desc(cls, desc: str, group_id: int):
        group = cls.get_group(group_id)
        group.description = desc
        group.save()
        return {"detail":"Description of group {0} was changed to {1}".format(group.name, group.description)}
    
    @classmethod
    def get_group(cls, group_id: int):
        group = get_object_or_404(Group, pk=group_id)
        return group

    @classmethod
    def get_group_json(cls, group_object: Group):
        serializer_for_group = GroupsSerializer(
                    instance = group_object,
                    many = False
                )
        return serializer_for_group.data

    @classmethod
    def all_groups(cls):
        groups = Group.objects.all()
        serializer_for_groups = GroupsSerializer(
                    instance = groups,
                    many = True
                )
        return serializer_for_groups.data

# Make interaction with User model easier
class UserActions(object):

    @classmethod
    def create_user(cls, username: str, password: str, group: int, email: str):
        try:
            new_user = User.objects.create_user(username=username, email=email, password=password)
            if group != None:
                try:
                    group = int(group)
                except ValueError:
                    return {"detail": "Wrong group ID"}
                new_user.groups.add(group)
            new_user.save()
            return cls.get_user_json(new_user)
        except IntegrityError:
            return {"error":"User with this name is already exists"}

    @classmethod
    def remove_user(cls, user_id: int):
        user = cls.get_user(user_id=user_id)
        username = user.username
        user_id = user.id
        user.delete()
        return {"detail":"User with username {0} and ID {1} was removed".format(username, user_id)}
    
    @classmethod
    def change_username(cls, username: str, user_id: int):
        user = cls.get_user(user_id)
        user.username = username
        try:
            user.save()
            return {"detail":"Username of user with id {0} was changed on {1}".format(user.id, user.username)}
        except IntegrityError:
            return {"error":"User with this name is already exists"}

    @classmethod
    def change_password(cls, password: str, user_id: int):
        user = cls.get_user(user_id)
        user.set_password = password
        user.save()
        return {"detail":"Password of user {0} was changed on {1}".format(user.username, password)}

    @classmethod
    def change_group(cls, user_id: int, group_id: int):
        user = cls.get_user(user_id)
        if group_id is None:
            user.groups.clear()
            return {"detail": "group_id wasn't given"}
        user.groups.clear()
        user.groups.add(group_id)
        user.save()
        return {"detail":"User {0} was added to group - {1}".format(user.username, Group.objects.get(id=group_id).name)}

    @classmethod
    def all_users(cls):
        users = User.objects.all()
        serializer_for_users = UsersSerializer(
                    instance = users,
                    many = True
                )
        return serializer_for_users.data
    
    @classmethod
    def get_user(cls, user_id: int):
        user = get_object_or_404(User, pk=user_id)
        return user

    @classmethod
    def get_user_json(cls, user_object: User):
        serializer_for_user = UsersSerializer(
                    instance = user_object,
                    many = False
                )
        return serializer_for_user.data


"""
User API views
"""

@api_view(['GET'])
def all_users(request):
    users = UserActions.all_users()
    return Response(users)

@api_view(['GET'])
def get_user(request, user_id: int):
    user = UserActions.get_user(user_id)
    user_json_info = UserActions.get_user_json(user)
    return Response(user_json_info)

@api_view(['GET'])
def create_user(request, username: int, password: str):
    email = request.GET.get("email", "sample@mail.com")
    group = request.GET.get("group_id", "null")
    user = UserActions.create_user(username=username, password=password, email=email, group=group)
    return Response(user)

@api_view(['GET'])
def remove_user(request, user_id: int):
    user_remove = UserActions.remove_user(user_id=user_id)
    return Response(user_remove)

@api_view(['GET'])
def change_password(request, user_id: int, new_password: str):
    user_change_password = UserActions.change_password(password=new_password, user_id=user_id)
    return Response(user_change_password)

@api_view(['GET'])
def change_username(request, user_id: int):
    new_username = request.GET.get("username", "")
    if not new_username:
        return Response({"error":"No username was given!"})
    user_change_username = UserActions.change_username(username=new_username, user_id=user_id)
    return Response(user_change_username)

@api_view(['GET'])
def change_group(request, user_id: int):
    group_id = request.GET.get("group_id", None)
    if group_id == "":
        group_id = None
    user_change_group = UserActions.change_group(user_id=user_id, group_id=group_id)
    return Response(user_change_group)

"""
Group API views
"""

@api_view(['GET'])
def all_groups(request):
    groups = GroupActions.all_groups()
    return Response(groups)

@api_view(['GET'])
def get_group(request, group_id: int):
    group = GroupActions.get_group(group_id)
    group_json_info = GroupActions.get_group_json(group)
    return Response(group_json_info)

@api_view(['GET'])
def create_group(request, group_name: str, desc: str):
    group = GroupActions.create_group(name=group_name, desc=desc)
    return Response(group)

@api_view(['GET'])
def remove_group(request, group_id: int):
    group_remove = GroupActions.remove_group(group_id=group_id)
    return Response(group_remove)

@api_view(['GET'])
def change_group_name(request, group_id: int, new_group_name: str):
    group_change_name = GroupActions.change_group_name(name=new_group_name, group_id=group_id)
    return Response(group_change_name)

@api_view(['GET'])
def change_group_desc(request, group_id: int, new_group_desc: str):
    group_change_desc = GroupActions.change_group_desc(desc=new_group_desc, group_id=group_id)
    return Response(group_change_desc)

"""
Render views
"""
def index(request):
    return render(request, "userslist/index.html")
