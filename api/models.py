from django.db import models
from django.utils import timezone

# Create your models here.

class MedicineReminder(models.Model):
    medicine_name = models.CharField(null=True, blank=False, max_length=256)
    route_of_administration = models.CharField(null=True, blank=False, choices=(('oral', 'Orally',), ('parentral/im', 'Intra-muscular',), ('parentral/sc', 'Subcutaneous',), ('parentral/iv', 'Intravenous',),), max_length=256)
    dosage_form = models.CharField(null=True, blank=False, choices=(('tablet', 'Tablet',), ('capsule', 'Capsule',), ('syrup', 'Syrup',), ('injectable', 'Injectable',),), max_length=256) # select menu in the frontend
    dosage_unit_of_measure = models.CharField(null=True, blank=False, choices=(('tablet', 'Tablet',), ('capsule', 'Capsule',), ('gravimetric/mg', 'Milligram/mg',), ('gravimetric/iu', 'International Unit/iu',), ('volumetric/ml', 'Milliliter/ml',),), max_length=256) # select menu in the frontend
    dosage_quantity_of_units_per_time = models.FloatField(null=True, blank=False)
    regimen_note = models.CharField(null=True, blank=True, max_length=256)
    body = models.TextField(null=True, blank=True)
    update_date = models.DateTimeField(auto_now=True) # automatically fetch the time and date of the moment on each sql update
    create_date = models.DateTimeField(auto_now_add=True) # automatically fetch the time and date of the moment only at the time of creation (sql insertion)


    # First Approach: calculate based on the first time of intake and frequency

    equally_distributed_regimen = models.BooleanField(default=True, null=True, blank=False)
    periodic_interval = models.CharField(null=True, blank=False, choices=(('daily', 'Daily Regimen',), ('weekly', 'Weekly Regimen',), ('monthly', 'Monthly Regimen',),), max_length=256)
    dosage_frequency = models.PositiveIntegerField(null=True, blank=False) # (24h/dosageFrequency or 7d/dosageFrequency depending on perDayOrPwerWeek)
    first_time_of_intake = models.DateTimeField(null=True, blank=False, default=timezone.now) # the frontend need to taki into consideration that server has UTC timezone. All time records that is recieved need to accustomed to the client TZ
    is_chronic_or_acute = models.BooleanField(default=False, null=True, blank=False)
    stopped_by_datetime = models.DateTimeField(null=True, blank=True)
    # Second Approach

    # customDistributedRegimen/BooleanField
    # customDailyTime1/TimeField
    # customDailyTime1=2/TimeField
    # customDailyTime3/TimeField

    def __str__(self):
        return self.body[0:100] # the first 50 character of the body of the note
    