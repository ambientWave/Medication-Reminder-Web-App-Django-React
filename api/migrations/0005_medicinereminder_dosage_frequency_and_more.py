# Generated by Django 4.2.4 on 2023-09-26 19:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_rename_note_medicinereminder_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='medicinereminder',
            name='dosage_frequency',
            field=models.FloatField(null=True),
        ),
        migrations.AddField(
            model_name='medicinereminder',
            name='equally_distributed_regimen',
            field=models.BooleanField(default=True, null=True),
        ),
        migrations.AddField(
            model_name='medicinereminder',
            name='first_time_of_intake',
            field=models.TimeField(null=True),
        ),
        migrations.AddField(
            model_name='medicinereminder',
            name='per_day_or_week_or_month',
            field=models.CharField(choices=[('daily', 'Daily Regimen'), ('weekly', 'Weekly Regimen'), ('monthly', 'Monthly Regimen')], max_length=256, null=True),
        ),
    ]