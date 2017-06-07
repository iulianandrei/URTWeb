from django.shortcuts import render
from django.core.mail import send_mail
from django.conf import settings
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions
from rest_framework import status

from main.models import User
from main.serializers import UserSerializer

import operator
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

    try:
        req_name  = request.data['name']
        req_email = request.data['email']
        req_pwd   = request.data['pwd']
    except:
        return Response({"status" : "Failure", "data": request.data}, status = status.HTTP_400_BAD_REQUEST)

    already = User.objects(email=req_email).count()
    if already > 0:
        return Response({"status": "Failure - Already Exists", "data": request.data}, status=status.HTTP_409_CONFLICT)


    hashed = bcrypt.hashpw(bytes(req_pwd, encoding='ascii'), bcrypt.gensalt())

    user = User.objects.create(name     = req_name,
                               email    = req_email,
                               pwd      = hashed,
                               prefs    = [])

    user.save()

    subject = "You are now a Gooster"
    message = "Hi " + req_name + "!\n\n"
    message += "Congratulations! You are now a Gooster! We hope you have a nice stay.\n\n"
    message += "Have a nice day,\nGooster Team."
    send_mail(subject, message, settings.EMAIL_HOST_USER, [req_email], fail_silently=True)

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

    exists = User.objects(email=req_email).count()
    if exists < 1:
        return Response({"status": "Failure - Not registered", "data": request.data}, status=status.HTTP_401_UNAUTHORIZED)


    user = User.objects.get(email=req_email)

    if(user != None):
        if bcrypt.checkpw(bytes(req_pwd, encoding='ascii'), bytes(user.pwd, encoding='ascii')):
            return Response({"status": "Accepted"}, status=status.HTTP_200_OK)

    return Response({"status": "Rejected"}, status=status.HTTP_200_OK)

@api_view(['POST'])
def add_prefs(request):
    req_email = None
    req_prefs  = None

    try:
        req_email = request.data['email']
        req_prefs  = request.data['prefs']
    except:
        return Response({"status" : "Failure", "data": request.data}, status = status.HTTP_400_BAD_REQUEST)

    User.objects(email=req_email).update(add_to_set__prefs=req_prefs)

    return Response({"status": "OK"}, status=status.HTTP_200_OK)


@api_view(['POST'])
def get_prefs(request):
    req_email = None

    try:
        req_email = request.data['email']
    except:
        return Response({"status": "Failure", "data": request.data}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.get(email=req_email)

    return Response({"status": "OK", "prefs": user.prefs}, status=status.HTTP_200_OK)


@api_view(['POST'])
def delete_pref(request):
    req_email = None
    req_pref  = None

    try:
        req_email = request.data['email']
        req_pref  = request.data['pref']
    except:
        return Response({"status": "Failure", "data": request.data}, status=status.HTTP_400_BAD_REQUEST)

    User.objects(email=req_email).update(pull__prefs=req_pref)

    return Response({"status": "OK"}, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_top(request):
    varDict = {}
    for user in User.objects:
        for item in user.prefs:
            if item in varDict:
                varDict[item] = varDict[item] + 1
            else:
                varDict[item] = 1

    newDict = dict(sorted(varDict.items(), key=operator.itemgetter(1), reverse=True)[:5])
    return Response({"status": "OK", "data": newDict}, status=status.HTTP_200_OK)
