from django.contrib import admin
from .models import AppUser, PasswordToken, DeleteAccountToken

admin.site.register(AppUser)
admin.site.register(PasswordToken)
admin.site.register(DeleteAccountToken)


