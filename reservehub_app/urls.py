from django.urls import path
from . import views, token

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
    path('token/refresh', token.CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('delete-account/', views.DeleteAccountView.as_view(), name='delete_account'),
    path('delete-account-confirm/<uidb64>/<token>/', views.DeleteAccountConfirmView.as_view(),
         name='delete_account_confirm'),
    path('webhooks-paypal/', views.ProcessWebHookView.as_view(), name='webhook'),
    path('subscription-plans/', views.SubscriptionPlanListView.as_view(), name='subscription-plan-list'),
    path('subscription-services/', views.SubscriptionServicesListView.as_view(), name='subscription-services-list'),
    path('received-payments/', views.ReceivedPaymentsView.as_view(), name='subscription-services-list'),
    path('get-userinformation/', views.UserInformation.as_view(), name='get-userinformation'),
    path('get-businessinformation/', views.BusinessInformation.as_view(), name='get-businessinformation'),
    path('get-businesstypes/', views.BusinessTypesView.as_view(), name='get-businesstypes'),
    path('get-business-settings/', views.BusinessSettings.as_view(), name='business-settings'),
]
