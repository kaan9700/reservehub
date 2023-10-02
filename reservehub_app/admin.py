from django.contrib import admin
from .models import AppUser, PasswordToken, DeleteAccountToken, ReceivedPayments

admin.site.register(AppUser)
admin.site.register(PasswordToken)
admin.site.register(DeleteAccountToken)
admin.site.register(ReceivedPayments)

