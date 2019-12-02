# models use MongoDB
from mongoengine import *


class TodoList(Document):
    username = StringField(required=True, primary_key=True) 
    todolist = DictField()
