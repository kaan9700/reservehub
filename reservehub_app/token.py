from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status
from .models import AppUser


class CustomTokenRefreshView(TokenRefreshView):

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            refresh = RefreshToken(request.data['refresh'])
            user_id = refresh.payload.get("user_id")

            try:
                user = AppUser.objects.get(id=user_id)

                # Determine the role based on the user attributes
                if user.is_superuser:
                    role = "superadmin"
                elif user.is_admin:
                    role = "admin"
                elif user.is_staff:
                    role = "staff"
                else:
                    role = "user"
                print("ROLE: ", role)
                updated_data = {
                    'role': role,
                    'email': user.email,
                    'phone': user.phone,
                    # Add other required fields here
                }

                new_access_token = RefreshToken.for_user(user).access_token
                response.data['access'] = str(new_access_token)
                response.data['user'] = updated_data

            except AppUser.DoesNotExist:
                response.data = {'detail': 'User not found'}
                response.status_code = status.HTTP_400_BAD_REQUEST

        return response
