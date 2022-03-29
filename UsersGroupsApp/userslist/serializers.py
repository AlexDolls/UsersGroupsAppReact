from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Group



class UsersSerializer(serializers.ModelSerializer):
    date_joined = serializers.SerializerMethodField('get_date')

    class Meta:
        model = User
        fields = '__all__'

    def get_date(self,obj): 
        return obj.date_joined.strftime("%b %d %Y %H:%M:%S")


class GroupsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = '__all__'

