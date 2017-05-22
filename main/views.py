from django.shortcuts import render
from django.http import HttpResponse

def index(request):
    return HttpResponse('INDEX!')

def login(request):
    return HttpResponse('LOGIN!')

def register(request):
    return HttpResponse('REGISTER!')
