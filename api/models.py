from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save

# Create your models here.

class User(AbstractUser):
    username = models.CharField(max_length=100)
    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'email' # the default username field in database
    REQUIRED_FIELDS = ['username'] # must be a list or a tuple
    
    def __str__(self):
        return self.username


class MedicineReminder(models.Model):
    # make sure that every user has its own reminders isolated from others
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reminder_user") # cascade behaviour means that whenever the related user gets deleted, its respective profile gets also deleted
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
        return str(self.medicine_name) if self.medicine_name else ''
    

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE) # cascade behaviour means that whenever the related user gets deleted, its respective profile gets also deleted
    full_name = models.CharField(max_length=100)
    verified = models.BooleanField(default=False)

    def __str__(self):
        return self.full_name

# create a database row record in medicinereminder whenever a new user is registered (suitable for profiles)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        # pass
        # MedicineReminder.objects.create(user=instance)
        Profile.objects.create(user=instance)

def save_user_profile(sender, instance, **kwargs):
    # instance.medicinereminder.save()
    instance.profile.save()

post_save.connect(create_user_profile, sender=User)
post_save.connect(save_user_profile, sender=User)
