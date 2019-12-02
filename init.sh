#!/bin/bash 
python3 -m pipenv install --skip-lock && python3 -m pipenv run python ./todolist/manage.py migrate
