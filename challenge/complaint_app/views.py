from rest_framework import viewsets
from .models import UserProfile, Complaint
from .serializers import UserSerializer, UserProfileSerializer, ComplaintSerializer
from rest_framework.response import Response
from rest_framework import status
from .utils import format_user_district
from django.db.models import Count

# Create your views here.


class UserViewSet(viewsets.ModelViewSet):
    http_method_names = ["get"]
    serializer_class = UserProfileSerializer

    def list(self, request):
        queryset = UserProfile.objects.all()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data[0])


class ComplaintViewSet(viewsets.ModelViewSet):
    http_method_names = ["get"]
    serializer_class = ComplaintSerializer

    def list(self, request):
        # Get all complaints from the user's district
        user_district = request.user.userprofile.district
        queryset = Complaint.objects.filter(account=format_user_district(user_district))
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)


class OpenCasesViewSet(viewsets.ModelViewSet):
    http_method_names = ["get"]
    serializer_class = ComplaintSerializer

    def list(self, request):
        # Get only the open complaints from the user's district
        # Complaints are considered "open" if closedate is "None"/Null
        user_district = request.user.userprofile.district
        queryset = Complaint.objects.filter(
            account=format_user_district(
                user_district,
            ),
            closedate__isnull=True,
        )
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)


class ClosedCasesViewSet(viewsets.ModelViewSet):
    http_method_names = ["get"]
    serializer_class = ComplaintSerializer

    def list(self, request):
        # Get only complaints that are close from the user's district
        # Complaints are considered "open" if closedate is not None/Null
        user_district = request.user.userprofile.district
        queryset = Complaint.objects.filter(
            account=format_user_district(user_district), closedate__isnull=False
        )
        serializer = self.serializer_class(queryset, many=True)
        print(len(serializer.data))
        return Response(serializer.data)


class TopComplaintTypeViewSet(viewsets.ModelViewSet):
    http_method_names = ["get"]
    serializer_class = ComplaintSerializer

    def list(self, request):
        # Get the top 3 complaint types from the user's district
        user_district = request.user.userprofile.district
        queryset = (
            Complaint.objects.filter(account=format_user_district(user_district))
            .values("complaint_type")
            .annotate(count=Count("complaint_type"))
            .order_by("-count")[:3]
        )
        return Response(queryset)


class ConstituentsComplaintsViewSet(viewsets.ModelViewSet):
    # Get complaints made by constituents that live in user's district
    http_method_names = ["get"]
    serializer_class = ComplaintSerializer

    def list(self, request):
        user_district = request.user.userprofile.district
        queryset = Complaint.objects.filter(
            council_dist=format_user_district(user_district)
        )
        print(user_district)
        serialzer = self.serializer_class(queryset, many=True)
        return Response(serialzer.data)
