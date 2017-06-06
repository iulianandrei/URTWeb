from django.conf.urls import url
from . import views


urlpatterns = [
    # Pages
    url(r'^$', views.index, name='index'),
    url(r'^login/$', views.login, name='login'),
    url(r'^register/$', views.register, name='register'),
    url(r'^map/$', views.map, name='map'),

    # API
    url(r'^api/users/create$', views.create_user),
    url(r'^api/users/check$', views.check_user),
    url(r'^api/users/addprefs$', views.add_prefs),
    url(r'^api/users/getprefs$', views.get_prefs),
    url(r'^api/users/delpref$', views.delete_pref),
    url(r'^api/users/gettop$', views.get_top),
]