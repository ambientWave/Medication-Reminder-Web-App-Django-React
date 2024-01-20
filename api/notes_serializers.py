from rest_framework import serializers
from .models import User, Profile, MedicineReminder

from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class RegisterUserTokenSerializer(serializers.ModelSerializer):
    # this class is intended to power the process of user registeration
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    password2 = serializers.CharField(
        write_only=True, required=True
    )

    class Meta:
        '''
        1. Meta inner class in Django models:

        This is just a class container with some options (metadata) attached to the model. It defines such things as available permissions, associated database table name, whether the model is abstract or not, singular and plural versions of the name etc.

        Short explanation is here: Django docs: Models: Meta options

        List of available meta options is here: Django docs: Model Meta options

        For latest version of Django: Django docs: Model Meta options

        2. Metaclass in Python:

        The best description is here: What are metaclasses in Python?

        '''
        model = User
        fields = ['email', 'username', 'password', 'password2']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {'password': "Password fields don't match"}
            )
        return attrs
    
    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()

        return user
    
        
class ProfileTokenSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # because there is a field in the reminder model that link it to the respective user, one can access fields of reminder by going through the keys of dictionary
        token['full_name'] = user.profile.full_name
        token['username'] = user.username
        token['email'] = user.email
        token['verified'] = user.profile.verified
        return token
    

class ReminderTokenSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # because there is a field in the reminder model that link it to the respective user, one can access fields of reminder by going through the keys of dictionary
        token['id'] = user.reminder_user.id
        token['medicine_name'] = user.reminder_user.medicine_name
        token['route_of_administration'] = user.reminder_user.route_of_administration
        token['dosage_form'] = user.reminder_user.dosage_form
        token['dosage_quantity_of_units_per_time'] = user.reminder_user.dosage_quantity_of_units_per_time
        token['periodic_interval'] = user.reminder_user.periodic_interval
        token['dosage_frequency'] = user.reminder_user.dosage_frequency
        token['first_time_of_intake'] = user.reminder_user.first_time_of_intake
        token['is_chronic_or_acute'] = user.reminder_user.is_chronic_or_acute
        token['stopped_by_datetime'] = user.reminder_user.stopped_by_datetime
        token['regimen_note'] = user.reminder_user.regimen_note

        # complete all fields below and pick up from 8:00 on video of serializer

        return token

class MedicineReminderSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicineReminder
        fields = '__all__' # or ['body', 'update_date', 'create_date']