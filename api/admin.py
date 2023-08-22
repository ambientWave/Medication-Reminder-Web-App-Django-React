from django.contrib import admin

# Register your models here.

from .models import Notes

admin.site.register(Notes) # this allow the superuser to make queries to the Notes model or table from admin panel
