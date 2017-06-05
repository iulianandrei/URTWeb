import bcrypt as bcrypt
from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions
from rest_framework import status

from main.models import User
from main.serializers import UserSerializer

import bcrypt
import json


#Pages
def index(request):
    return render(request, 'MainView.html/')


def login(request):
    return render(request, 'index.html/')


def register(request):
    return render(request, 'RegisterView.html/')


def map(request):
    return render(request, 'GoosterView.html/')



#API
@api_view(['POST'])
def create_user(request):

    req_name  = None
    req_email = None
    req_pwd   = None
    req_prefs = None

    try:
        req_name  = request.data['name']
        req_email = request.data['email']
        req_pwd   = request.data['pwd']
    except:
        return Response({"status" : "Failure", "data": request.data}, status = status.HTTP_400_BAD_REQUEST)

    try:
        req_prefs = request.data['prefs']
    except:
        req_prefs = ['Mall', 'Food', 'Drink']

    hashed = bcrypt.hashpw(bytes(req_pwd, encoding='ascii'), bcrypt.gensalt())

    user = User.objects.create(name     = req_name,
                               email    = req_email,
                               pwd      = hashed,
                               prefs    = req_prefs)

    user.save()
    return Response({"status" : "Success", "token": hashed}, status = status.HTTP_201_CREATED)

@api_view(['POST'])
def check_user(request):
    req_email = None
    req_pwd   = None

    try:
        req_email = request.data['email']
        req_pwd   = request.data['pwd']
    except:
        return Response({"status" : "Failure", "data": request.data}, status = status.HTTP_400_BAD_REQUEST)

    for user in User.objects:
        if user.email == req_email:
            if bcrypt.checkpw(bytes(req_pwd, encoding='ascii'), bytes(user.pwd, encoding='ascii')):
                return Response({"status": "Accepted"}, status=status.HTTP_200_OK)

    return Response({"status": "Rejected"}, status=status.HTTP_200_OK)
