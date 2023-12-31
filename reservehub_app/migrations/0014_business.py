# Generated by Django 4.2.5 on 2023-11-01 19:09

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('reservehub_app', '0013_appuser_newsletter_notifications_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Business',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('street', models.CharField(max_length=255)),
                ('street_number', models.CharField(max_length=255)),
                ('zip_code', models.CharField(max_length=255)),
                ('city', models.CharField(max_length=255)),
                ('opening_hours', models.CharField(max_length=255)),
                ('closing_hours', models.CharField(max_length=255)),
                ('phone', models.CharField(max_length=255)),
                ('app_user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
