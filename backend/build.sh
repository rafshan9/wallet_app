#!/usr/bin/env bash
# exit on error
set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --noinput
python manage.py migrate

# Create superuser and ignore the error if it already exists
python manage.py createsuperuser --noinput || true