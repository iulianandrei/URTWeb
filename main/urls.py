from django.conf.urls import url
from . import views


urlpatterns = [
    #Pages
    url(r'^$', views.index, name='index'),
    url(r'^login/$', views.login),
    url(r'^register/$', views.register),

    #API
    url(r'^api/users/create$', views.create_user),
    url(r'^api/users/check$', views.check_user),
]