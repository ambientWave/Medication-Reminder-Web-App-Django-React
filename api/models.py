from django.db import models

# Create your models here.

class Notes(models.Model):
    body = models.TextField(null=True, blank=True)
    update_date = models.DateTimeField(auto_now=True) # activated on each sql update
    create_date = models.DateTimeField(auto_now_add=True) # activated only at the time of creation (sql insertion)
    # medicineName/CharField
    # dosageForm/CharField select menu in the frontend
    # dosageUnitOfMeasure/CharField select menu in the frontend
    # dosageQuantityOfUnitsPerTime/FloatField
    # regimenNote/CharField


    # First Approach: calculate based on the first time of intake and frequency

    # equallyDistributedRegimen/BooleanField
    # perDayOrPerWeek/BooleanField
    # dosageFrequency/FloatField
    # firstTimeOfIntake/TimeField


    # Second Approach

    # mealDistributedRegimen/BooleanField
    # meal1Time/TimeField
    # meal2Time/TimeField
    # meal3Time/TimeField

    def __str__(self):
        return self.body[0:50] # the first 50 character of the body of the note
    