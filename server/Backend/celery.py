import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'first_django_server.settings')

app = Celery('first_django_server')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()