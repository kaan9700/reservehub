# Generated by Django 4.2.5 on 2023-09-29 19:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('reservehub_app', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='appuser',
            name='subscription_end',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='appuser',
            name='subscription_id',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
