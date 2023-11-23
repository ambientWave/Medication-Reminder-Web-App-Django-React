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
    reminders = MedicineReminder.objects.all()
    serializer = MedicineReminderSerializer(reminders, many=True)
    return Response(serializer.data)


# get specific one note by passing the integer that would come after notes/ as the primary_key
@api_view(['GET'])
def getReminder(request, primary_key):
    reminders = MedicineReminder.objects.get(id=primary_key)
    serializer = MedicineReminderSerializer(reminders, many=False)
    return Response(serializer.data)


@api_view(['PUT'])
def updateReminder(request, primary_key):
    data = request.data # new data from entered by user in the frontend
    reminder = MedicineReminder.objects.get(id=primary_key)
    serializer = MedicineReminderSerializer(instance=reminder, data=data)
    
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)