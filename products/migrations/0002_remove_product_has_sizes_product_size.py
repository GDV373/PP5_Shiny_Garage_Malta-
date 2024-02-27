# Generated by Django 5.0.2 on 2024-02-27 21:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='product',
            name='has_sizes',
        ),
        migrations.AddField(
            model_name='product',
            name='size',
            field=models.CharField(default='DefaultSizeValue', max_length=50),
        ),
    ]
