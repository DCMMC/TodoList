"""todolist URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path	
from .views import upload, get, login_handler, logout_handler, log_state
# from .views import debug_url
from django.conf.urls import url
from django.views.generic.base import TemplateView
from django.views.static import serve
from todolist.settings import NOT_FOUND_ROOT, LOGIN_ROOT
from django.conf.urls import (
    handler400, handler403, handler404, handler500
)
from django.contrib.auth.decorators import login_required

handler404 = 'todolist.views.page_not_found'

urlpatterns = [
    path('admin/', admin.site.urls),
    path('upload', upload),
    path('get', get),
    url(r'^$', TemplateView.as_view(template_name="index.html")),
    url(r'^404/(?P<path>.*)$', serve, {
            'document_root': NOT_FOUND_ROOT,
        }),
    url(r'^login/(?P<path>.*)$', serve, {
            'document_root': LOGIN_ROOT,
        }),
    path('login_handler', login_handler),
    path('logout_handler', logout_handler),
    path('log_state', log_state),
    # path('debug', debug_url),
]
