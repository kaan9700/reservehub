# Generated by Django 4.2.5 on 2023-10-29 22:02

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('reservehub_app', '0010_appuser_registereddate'),
    ]

    operations = [
        migrations.AlterField(
            model_name='appuser',
            name='registeredDate',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]