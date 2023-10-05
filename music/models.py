from django.db import models


class Music(models.Model):
    title = models.CharField(blank=False, max_length=255)
    genre = models.CharField(default="Not specified", max_length=255)
    link = models.URLField(default="")
    cover_img = models.URLField(default="")
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.title
