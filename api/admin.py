from django.contrib import admin

# Register your models here.

from .models import User, Profile, MedicineReminder
# from api.models import User, MedicineReminder

class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email']


class ProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'full_name', 'verified']
    list_editable = ['verified']

    
class MedicineReminderAdmin(admin.ModelAdmin):
    list_display = ['user', 'medicine_name',
                     'route_of_administration',
                     'dosage_form', 'dosage_unit_of_measure',
                     'dosage_quantity_of_units_per_time',
                     'regimen_note', 'equally_distributed_regimen',
                     'periodic_interval', 'dosage_frequency',
                     'first_time_of_intake', 'is_chronic_or_acute',
                     'stopped_by_datetime']
    list_editable = ['medicine_name',
                     'route_of_administration',
                     'dosage_form', 'dosage_unit_of_measure',
                     'dosage_quantity_of_units_per_time',
                     'regimen_note', 'equally_distributed_regimen',
                     'periodic_interval', 'dosage_frequency',
                     'first_time_of_intake', 'is_chronic_or_acute',
                     'stopped_by_datetime']
    
admin.site.register(User, UserAdmin)
admin.site.register(Profile, ProfileAdmin)
admin.site.register(MedicineReminder, MedicineReminderAdmin) # this allow the superuser to make queries to the Notes model or table from admin panel