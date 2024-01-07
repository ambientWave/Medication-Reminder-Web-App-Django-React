from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import MedicineReminder
from .notes_serializers import MedicineReminderSerializer
# Create your views here.

@api_view(['GET'])
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
def getReminders(request):
    reminders = MedicineReminder.objects.all() # #.order_by('-updated')# add this if you want the response items to be sorted by update date in a descending manner
    serializer = MedicineReminderSerializer(reminders, many=True)
    return Response(serializer.data)


# get specific one note by passing the integer that would come after notes/ as the primary_key
@api_view(['GET'])
def getReminder(request, primary_key):
    reminders = MedicineReminder.objects.get(id=primary_key)
    serializer = MedicineReminderSerializer(reminders, many=False)
    return Response(serializer.data)

@api_view(['POST'])
def createReminder(request):
    data = request.data
    reminder = MedicineReminder.objects.create(medicine_name=data['medicine_name'], route_of_administration=data['route_of_administration'],
                                               dosage_form=data['dosage_form'], dosage_unit_of_measure=data['dosage_unit_of_measure'],
                                               dosage_quantity_of_units_per_time=data['dosage_quantity_of_units_per_time'],
                                               regimen_note=data['regimen_note'], body=data['medicine_name'],
                                               equally_distributed_regimen=True, periodic_interval=data['periodic_interval'],
                                               dosage_frequency=data['dosage_frequency'], first_time_of_intake=data['first_time_of_intake'],
                                               is_chronic_or_acute=data['is_chronic_or_acute'], stopped_by_datetime=data['stopped_by_datetime'])
    serializer = MedicineReminderSerializer(reminder, many=False)
    return Response(serializer.data)

@api_view(['PUT'])
def updateReminder(request, primary_key):
    data = request.data # new data from entered by user in the frontend
    reminder = MedicineReminder.objects.get(id=primary_key)
    serializer = MedicineReminderSerializer(instance=reminder, data=data)
    
    if serializer.is_valid():
        serializer.save()
        ''' Model.save() does either INSERT or UPDATE of an object in a DB depending on its preexistence (if there's an existing primary key), while
            Model.objects.create() does only INSERT
        '''
    return Response(serializer.data)

@api_view(['DELETE'])
def deleteReminder(request, primary_key):
    reminder = MedicineReminder.objects.get(id=primary_key)
    reminder.delete()
    return Response("Reminder has been deleted!")