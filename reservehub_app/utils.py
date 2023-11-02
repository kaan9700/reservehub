from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import serializers
from .models import SubscriptionPlan, SubscriptionServices, BusinessType



class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['email'] = user.email
        if user.is_admin:
            token['role'] = 'admin'
        if user.is_superuser:
            token['role'] = 'superadmin'

        # Falls nutzer nicht is_admin oder is_superuser ist, dann ist er ein user
        if not user.is_admin and not user.is_superuser:
            token['role'] = 'user'

        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class SubscriptionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionPlan
        fields = '__all__'

class SubscriptionServicesSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionServices
        fields = '__all__'


class BusinessTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessType
        fields = '__all__'