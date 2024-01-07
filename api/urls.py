from django.urls import path
from . import views

urlpatterns = [
    path('', views.getRoutes, name="routes"),
    path('notes/', views.getReminders, name='reminders'),
    path('notes/create', views.createReminder, name='create-reminder'),
    path('notes/<str:primary_key>/update', views.updateReminder, name='update-reminder'),
    path('notes/<str:primary_key>/delete', views.deleteReminder, name='delete-reminder'),
    path('notes/<str:primary_key>/', views.getReminder, name='reminder'),
    ]
