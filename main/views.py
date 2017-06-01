from django.shortcuts import render
from django.http import HttpResponse

from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions
from rest_framework import status

from main.models import User
from main.serializers import UserSerializer


#Pages
def index(request):
    return render(request, 'MainView.html')


def login(request):
    return render(request, 'LoginView.html')


def register(request):
    return render(request, 'RegisterView.html')


#API
@api_view(['POST'])
def create_user(request):
    return Response({"status" : "Success", "data": request.data} , status = status.HTTP_201_CREATED)