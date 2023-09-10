from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.contrib.auth.hashers import make_password, check_password
from datetime import timedelta
from django.utils import timezone
from django.contrib.auth.tokens import default_token_generator



class AppUserManager(BaseUserManager):
    def create_user(self, email, password=None):
        if not email:
            raise ValueError('Users must have an email address')

        user = self.model(email=self.normalize_email(email))

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None):
        user = self.create_user(email, password=password)

        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

    def validate_token(self, user, token, type):
        if type == 'delete':
            try:
                token_model = DeleteAccountToken.objects.get(user=user, token=token)
            except DeleteAccountToken.DoesNotExist:
                return False
        else:
            try:
                token_model = PasswordToken.objects.get(user=user, token=token)
            except PasswordToken.DoesNotExist:
                return False

        if timezone.now() - token_model.created_at > timedelta(minutes=15):
            return False

        return default_token_generator.check_token(user, token)

class AppUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=500)
    email_confirmed = models.BooleanField(default=False)
    phone = models.CharField(max_length=20)
    last_login = models.DateTimeField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)  # Neu hinzugefügt
    is_superuser = models.BooleanField(default=False)  # Neu hinzugefügt

    objects = AppUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

    def set_password(self, raw_password):
        self.password = make_password(raw_password)
        self.save()

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)



class PasswordToken(models.Model):
    user = models.ForeignKey(AppUser, on_delete=models.CASCADE)
    token = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

class DeleteAccountToken(models.Model):
    user = models.ForeignKey(AppUser, on_delete=models.CASCADE)
    token = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)