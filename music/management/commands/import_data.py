from django.core.management.base import BaseCommand
from music.models import Music


SONGS = [
    {
        "title": "Skylike - Dawn",
        "link": "https://raw.githubusercontent.com/himalayasingh/music-player-1/master/music/2.mp3",
        "cover_img": "https://raw.githubusercontent.com/himalayasingh/music-player-1/master/img/_1.jpg",
    },
    {
        "title": "Alex Skrindo - Me & You",
        "link": "https://raw.githubusercontent.com/himalayasingh/music-player-1/master/music/1.mp3",
        "cover_img": "https://raw.githubusercontent.com/himalayasingh/music-player-1/master/img/_2.jpg",
    },
    {
        "title": "Kaaze - Electro Boy",
        "link": "https://raw.githubusercontent.com/himalayasingh/music-player-1/master/music/3.mp3",
        "cover_img": "https://raw.githubusercontent.com/himalayasingh/music-player-1/master/img/_3.jpg",
    },
    {
        "title": "Jordan Schor - Home",
        "link": "https://raw.githubusercontent.com/himalayasingh/music-player-1/master/music/4.mp3",
        "cover_img": "https://raw.githubusercontent.com/himalayasingh/music-player-1/master/img/_4.jpg",
    },
    {
        "title": "Martin Garrix - Proxy",
        "link": "https://raw.githubusercontent.com/himalayasingh/music-player-1/master/music/5.mp3",
        "cover_img": "https://raw.githubusercontent.com/himalayasingh/music-player-1/master/img/_5.jpg",
    },
]


class Command(BaseCommand):
    help = "Import some musics to the database"
    command = "python manage.py import_data"

    def handle(self, *args, **kwargs):
        try:
            for song in SONGS:
                Music.objects.create(
                    title=song["title"], link=song["link"], cover_img=song["cover_img"]
                )
            self.stdout.write(self.style.SUCCESS("Data import successful."))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"An error occurred: {str(e)}"))
