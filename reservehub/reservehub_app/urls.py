from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('', views.getRoutes, name='APIs'),
    path('register/', views.RegisterView.as_view(), name="register"),
    path('login/', views.LoginView.as_view(), name='login'),
    path('activate/<uidb64>/<token>/', views.activate, name='activate'),
    path('password-reset/', views.PasswordResetRequestView.as_view(), name='password_reset'),
    path('password-reset-confirm/<uidb64>/<token>/', views.PasswordResetConfirmView.as_view(),
         name='password_reset_confirm'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('login/', views.LoginView.as_view(), name='token_obtain_pair'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('delete-account/', views.DeleteAccountView.as_view(), name='delete_account'),
    path('delete-account-confirm/<uidb64>/<token>/', views.DeleteAccountConfirmView.as_view(),
         name='delete_account_confirm'),
    path('webhook/', views.webhook, name='webhook'),

]
