from django.urls import path

from Accounts.views import UserRegistrationAPIView, UserLoginAPIView, UserLogoutAPIView, CurrentUserAPIView

urlpatterns = [
    path('register/', UserRegistrationAPIView.as_view(), name='user-register'),
    path('login/', UserLoginAPIView.as_view(), name='user-login'),
    path('logout/', UserLogoutAPIView.as_view(), name='user-logout'),
    path('current_user/', CurrentUserAPIView.as_view(), name='current_user'),
]
