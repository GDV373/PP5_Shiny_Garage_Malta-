from django.urls import path
from . import views

urlpatterns = [
    path('',
        views.forum_home,
        name='forum_home'),
    path('create/',
        views.create_thread,
        name='create_thread'),
    path('thread/<int:thread_id>/',
        views.thread_detail,
        name='forum_thread_detail'),
    path('thread/<int:thread_id>/comment/',
        views.create_comment,
        name='create_comment'),
    path('thread/<int:thread_id>/delete/',
        views.delete_thread,
        name='delete_thread'),
    path('comment/<int:comment_id>/delete/',
        views.delete_comment,
        name='delete_comment'),
]
