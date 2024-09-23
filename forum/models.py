from django.db import models
from django.contrib.auth.models import User

class Thread(models.Model):
    """
    Model to represent a discussion thread
    """
    title = models.CharField(max_length=255)
    body = models.TextField()
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class Comment(models.Model):
    """
    Model to represent comments on a thread
    """
    thread = models.ForeignKey(Thread, related_name='comments', on_delete=models.CASCADE)
    body = models.TextField()
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return f'Comment by {self.created_by} on {self.thread.title}'

    def display_body(self):
        """
        If the comment is deleted, display a standard message
        """
        if self.is_deleted:
            return "The user deleted this comment"
        return self.body
