from .models import UserProfile
from django.core.exceptions import ObjectDoesNotExist


def format_user_district(user_district):
    return f"NYCC{int(user_district):02}"
