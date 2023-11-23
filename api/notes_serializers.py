from rest_framework.serializers import ModelSerializer
from .models import MedicineReminder
class MedicineReminderSerializer(ModelSerializer):
    class Meta:
        model = MedicineReminder
        fields = '__all__' # or ['body', 'update_date', 'create_date']