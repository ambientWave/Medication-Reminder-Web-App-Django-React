from rest_framework.serializers import ModelSerializer
from .models import Notes
class NotesSerializer(ModelSerializer):
    class Meta:
        model = Notes
        fields = '__all__' # or ['body', 'update_date', 'create_date']