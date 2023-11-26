from django.urls import path
from . import views

urlpatterns = [
    path('', views.getRoutes, name="routes"),
    path('notes/', views.getReminders, name='reminders'),
    path('notes/<str:primary_key>/update', views.updateReminder, name='update-reminder'),
    path('notes/<str:primary_key>/', views.getReminder, name='reminder'),
    ]
