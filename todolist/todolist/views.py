from django.http import JsonResponse
import sys
import traceback
from .models import TodoList
import json
from django.views.decorators.csrf import csrf_exempt
import json
import logging
import os
from django.http import HttpResponseRedirect, HttpResponse, HttpResponseForbidden
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from todolist.settings import LOGIN_REDIRECT_URL, LOGOUT_REDIRECT_URL, BASE_DIR
from django.shortcuts import redirect

logger = logging.getLogger(__name__)


@csrf_exempt
def logout_handler(request):
    """
    退出登录
    """
    if request.method == 'GET':
        logout(request)
        return redirect(LOGOUT_REDIRECT_URL)
    else:
        return HttpResponseForbidden()

@csrf_exempt
def debug_url(request):
    """
    debug
    """
    if request.method == 'GET':
        return HttpResponse('Req typle: ' + request.method + ', req data: ' +
            str(request.GET))
    elif request.method == 'POST':
        if request.content_type == 'application/x-www-form-urlencoded':
            return HttpResponse('Req typle: ' + request.method + ', req data: ' +
                str(request.POST))
        elif request.content_type =='application/json':
            res = json.loads(str(request.body, encoding='utf-8'))
            return HttpResponse('Req typle: ' + request.method + ', req data: ' +
                str(request.body, encoding='utf-8'))

@csrf_exempt
def log_state(request):
    """
    确认是否已经登录
    """
    if request.method == 'GET':
        return JsonResponse({'result': request.user.is_authenticated,
                             'username': request.user.get_username()})
    else:
        return HttpResponseForbidden()

@csrf_exempt
def login_handler(request):
    """
    自定义登录
    """
    if request.method == 'POST':
        username = request.POST.get('username', '')
        password = request.POST.get('password', '')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect(LOGIN_REDIRECT_URL)
        else:
            # invalid login
            return HttpResponse('账号或密码错误, 请返回并重新登录!')
    else:
        return HttpResponseForbidden()


@csrf_exempt
def page_not_found(request, exception):
    # 必须像在 setting 中设置 debug 为 False
    return HttpResponseRedirect('/404/404.html')


@login_required
@csrf_exempt
def upload(request):
    """
    使用 http 传输 post, 不安全
    """
    if request.method == 'POST' and request.content_type =='application/json':
        try:
            res = json.loads(str(request.body, encoding='utf-8'))
            username = res.get('username', 'local_user')
            todolist = dict(res.get('todolist', {}))
            if len(TodoList.objects(username=username)) > 0:
                TodoList.objects(username=username).update_one(set__todolist=todolist)
                # TodoList._get_collection().find_one_and_update({'username': username}, {
                #     '$set': {'username': username, 'todolist': todolist}
                # })
                return JsonResponse({'code': 'success',
                                    'msg': 'update success for user: ' + username})
            else:
                todolist_db = TodoList(username=username, todolist=todolist)
                todolist_db.save()
                return JsonResponse({'code': 'success',
                                    'msg': 'create success for user: ' + username})
        except Exception as e:
            traceback.print_exc()
            tb = traceback.format_exc()
            return JsonResponse({'code': 'error',
                                 'msg': tb})
    else:
        return HttpResponseForbidden()


@login_required
@csrf_exempt
def get(request):
    if request.method == 'GET':
        try:
            username = request.user.get_username()
            todolist = TodoList.objects(username=username)
            if len(todolist) > 0:
                todolist = todolist[0]
                # sys.stderr.write(str(todolist))
                return JsonResponse({'code': 'success',
                                    'todolist': todolist.todolist})
            else:
                return JsonResponse({'code': 'error',
                                    'msg': 'dataset entry not found for user: ' + username})
        except Exception as e:
            traceback.print_exc()
            tb = traceback.format_exc()
            return JsonResponse({'code': 'error',
                                 'msg': tb})

    else:
        return HttpResponseForbidden()
