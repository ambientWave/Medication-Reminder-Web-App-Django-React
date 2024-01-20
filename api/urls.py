from django.urls import path
from . import views

from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('', views.getRoutes, name="routes"),
    path('notes/', views.getReminders, name='reminders'),
    path('notes/create', views.createReminder, name='create-reminder'),
    path('notes/<str:primary_key>/update', views.updateReminder, name='update-reminder'),
    path('notes/<str:primary_key>/delete', views.deleteReminder, name='delete-reminder'),
    path('notes/<str:primary_key>/', views.getReminder, name='reminder'), # exposed endpoint to get one reminder only
    path('token/', views.ProfileTokenObtainPairView.as_view(), name='get-token'), # ProfileTokenObtainPairView is defined class and there's a method that adapt that to be like a method. That's as_view()
    path('token/refresh/', TokenRefreshView.as_view(), name='refresh-token'),
    path('register/', views.RegisterView.as_view(), name='create-user'),
    path('dashboard/', views.dashboard, name='dashboard')]
