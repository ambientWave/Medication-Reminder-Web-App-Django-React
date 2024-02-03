from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .models import MedicineReminder, User, Profile
from .notes_serializers import MedicineReminderSerializer, UserSerializer, RegisterUserTokenSerializer, ProfileTokenSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
import json
# Create your views (how data is represented in exposed endpoints) here.

@api_view(['GET'])
@permission_classes([IsAuthenticated]) # disallow all http requests from unauthenticated users
def getRoutes(request):

    routes = [
    {
        'Endpoint': '/notes/',
        'method': 'GET',
        'body': None,
        'description': 'Returns an array of notes'
    },
    {
        'Endpoint': '/notes/id',
        'method': 'GET',
        'body': None,
        'description': 'Returns a single note object'
    },
    {
        'Endpoint': '/notes/create/',
        'method': 'POST',
        'body': {'body': ""},
        'description': 'Creates new note with data sent in post request'
    },
    {
        'Endpoint': '/notes/id/update/',
        'method': 'PUT',
        'body': {'body': ""},
        'description': 'Creates an existing note with data sent in post request'
    },
    {
        'Endpoint': '/notes/id/delete/',
        'method': 'DELETE',
        'body': None,
        'description': 'Deletes and exiting note'
    },
    ]

    return Response(routes)

@api_view(['GET'])
@permission_classes([IsAuthenticated]) # disallow all http requests from unauthenticated users
def getReminders(request):
    # reminders = MedicineReminder.objects.all() # #.order_by('-updated')# add this if you want the response items to be sorted by update date in a descending manner
    reminders = MedicineReminder.objects.filter(user=request.user) # filter is used to limit the fetched objects to the ones associated with the current logged user
    serializer = MedicineReminderSerializer(reminders, many=True)
    return Response(serializer.data)


# get specific one note by passing the integer that would come after notes/ as the primary_key
@api_view(['GET'])
@permission_classes([IsAuthenticated]) # disallow all http requests from unauthenticated users
def getReminder(request, primary_key):
    reminders = MedicineReminder.objects.get(id=primary_key, user=request.user)
    serializer = MedicineReminderSerializer(reminders, many=False)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated]) # disallow all http requests from unauthenticated users
def createReminder(request):
    data = json.loads(request.data['body']) # request.data
    reminder = MedicineReminder.objects.create(user=request.user, medicine_name=data['medicine_name'], route_of_administration=data['route_of_administration'],
                                               dosage_form=data['dosage_form'], dosage_unit_of_measure=data['dosage_unit_of_measure'],
                                               dosage_quantity_of_units_per_time=data['dosage_quantity_of_units_per_time'],
                                               regimen_note=data['regimen_note'], body=data['medicine_name'],
                                               equally_distributed_regimen=True, periodic_interval=data['periodic_interval'],
                                               dosage_frequency=data['dosage_frequency'], first_time_of_intake=data['first_time_of_intake'],
                                               is_chronic_or_acute=data['is_chronic_or_acute'], stopped_by_datetime=data['stopped_by_datetime'])
    serializer = MedicineReminderSerializer(reminder, many=False)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated]) # disallow all http requests from unauthenticated users
def updateReminder(request, primary_key):
    data = json.loads(request.data['body']) # new data from entered by user in the frontend
    data['user'] = request.user.id
    stored_reminder = MedicineReminder.objects.get(id=primary_key, user=request.user)
    serializer = MedicineReminderSerializer(instance=stored_reminder, data=data)
    serializer.is_valid()

    if serializer.is_valid():
        serializer.save()
        ''' Model.save() does either INSERT or UPDATE of an object in a DB depending on its preexistence (if there's an existing primary key), while
            Model.objects.create() does only INSERT
        '''
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated]) # disallow all http requests from unauthenticated users
def deleteReminder(request, primary_key):
    reminder = MedicineReminder.objects.get(id=primary_key, user=request.user)
    reminder.delete()
    return Response("Reminder has been deleted!")

class ProfileTokenObtainPairView(TokenObtainPairView):
    serializer_class = ProfileTokenSerializer

class RegisterView(generics.CreateAPIView):
    '''
    This class defines a view which is critical for creating new user
    '''
    # overriding inherited class attributes
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterUserTokenSerializer

@api_view(['GET', 'POST'])
@permission_classes(IsAuthenticated)
def dashboard(request):
    if request.method == 'GET':
        response = f"Hey {request.user}, you are seeing a GET response"
        return Response({'response': response}, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        custom_request_header = request.POST.get("text") # a custom header named text
        response = f"Hey {request.user}, your input was {custom_request_header}"
        return Response({'response': response}, status=status.HTTP_200_OK)
    else:
        return Response({}, status=status.HTTP_400_BAD_REQUEST)