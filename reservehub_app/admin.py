from django.contrib import admin
from .models import AppUser, PasswordToken, DeleteAccountToken, ReceivedPayments, SubscriptionPlan, Business, BusinessType

admin.site.register(AppUser)
admin.site.register(PasswordToken)
admin.site.register(DeleteAccountToken)
admin.site.register(ReceivedPayments)
admin.site.register(SubscriptionPlan)
admin.site.register(Business)
admin.site.register(BusinessType)