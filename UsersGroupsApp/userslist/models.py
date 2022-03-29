from django.db import models
from django.contrib.auth.models import Group
# Create your models here.

class Group(Group):
    description = models.CharField(max_length = 200)


