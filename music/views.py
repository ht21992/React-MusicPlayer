
from django.shortcuts import render
from django.http import JsonResponse
from .models import Music
from .serializers import MusicSerializer
from rest_framework import viewsets
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny


@permission_classes([AllowAny])
class MusicViewSet(viewsets.ModelViewSet):
    queryset = Music.objects.all().order_by('-created')
    lookup_body_field = 'id'
    serializer_class = MusicSerializer
