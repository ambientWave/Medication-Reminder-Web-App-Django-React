from django.contrib import admin

# Register your models here.

from .models import MedicineReminder

admin.site.register(MedicineReminder) # this allow the superuser to make queries to the Notes model or table from admin panel
