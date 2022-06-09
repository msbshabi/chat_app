import uuid
from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


class Profile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, parent_link=True)
    bio = models.CharField(max_length=200, null=True, blank=True)
    location = models.CharField(max_length=30, null=True, blank=True)
    birthdate = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.user.first_name + " - " + self.user.last_name

    @property
    def full_name(self):
        return f'{self.user.first_name} {self.user.last_name}'

    @property
    def avatar_url(self):
        return f'https://avatars.dicebear.com/api/avataaars/{self.full_name}.png?style=circle&eyes[]=default&mouth[]=default&skin[]=light&hairColor[]=black'


@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_profile(sender, instance, **kwargs):
    instance.profile.save()
