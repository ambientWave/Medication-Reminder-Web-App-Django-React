# Generated by Django 4.2.4 on 2023-09-29 03:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_alter_medicinereminder_dosage_unit_of_measure'),
    ]

    operations = [
        migrations.AlterField(
            model_name='medicinereminder',
            name='dosage_unit_of_measure',
            field=models.CharField(choices=[('tablet', 'Tablet'), ('capsule', 'Capsule'), ('gravimetric/mg', 'Milligram/mg'), ('gravimetric/iu', 'International Unit/iu'), ('volumetric/ml', 'Milliliter/ml')], max_length=256, null=True),
        ),
    ]
