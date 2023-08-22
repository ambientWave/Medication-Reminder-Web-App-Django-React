from django.db import models

# Create your models here.

class Notes(models.Model):
    body = models.TextField(null=True, blank=True)
    update_date = models.DateTimeField(auto_now=True) # activated on each sql update
    create_date = models.DateTimeField(auto_now_add=True) # activated only at the time of creation (sql insertion)

    def __str__(self):
        return self.body[0:50] # the first 50 character of the body of the note
    