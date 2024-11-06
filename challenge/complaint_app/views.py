from rest_framework import viewsets
from .models import UserProfile, Complaint
from .serializers import UserSerializer, UserProfileSerializer, ComplaintSerializer
from rest_framework.response import Response
from rest_framework import status
from .utils import format_user_district
from django.db.models import Count

# Create your views here.


class ComplaintViewSet(viewsets.ModelViewSet):
    http_method_names = ["get"]
    serializer_class = ComplaintSerializer

    def list(self, request):
        # Get all complaints from the user's district
        user_district = request.user.userprofile.district
        all_complaints = Complaint.objects.filter(
            account=format_user_district(user_district)
        )
        serializer = self.serializer_class(all_complaints, many=True)
        print(len(all_complaints))
        return Response(serializer.data)


class OpenCasesViewSet(viewsets.ModelViewSet):
    http_method_names = ["get"]
    serializer_class = ComplaintSerializer

    def list(self, request):
        # Get only the open complaints from the user's district
        # Complaints are considered "open" if closedate is "None"/Null
        user_district = request.user.userprofile.district
        open_complaints = Complaint.objects.filter(
            account=format_user_district(
                user_district,
            ),
            closedate__isnull=True
        )
        serializer = self.serializer_class(open_complaints, many=True)
        print(len(open_complaints))
        return Response(serializer.data)


class ClosedCasesViewSet(viewsets.ModelViewSet):
    http_method_names = ["get"]
    serializer_class = ComplaintSerializer

    def list(self, request):
        # Get only complaints that are close from the user's district
        # Complaints are considered "open" if closedate is not None/Null
        user_district = request.user.userprofile.district
        closed_cases = Complaint.objects.filter(
            account=format_user_district(user_district), closedate__isnull=False
        )
        serializer = self.serializer_class(closed_cases, many=True)
        print(len(serializer.data))
        return Response(serializer.data)


class TopComplaintTypeViewSet(viewsets.ModelViewSet):
    http_method_names = ["get"]
    serializer_class = ComplaintSerializer

    def list(self, request):
        # Get the top 3 complaint types from the user's district
        user_district = request.user.userprofile.district
        top_complaint_types = (
            Complaint.objects.filter(account=format_user_district(user_district))
            .values("complaint_type")
            .annotate(count=Count("complaint_type"))
            .order_by("-count")[:3]
        )
        return Response(top_complaint_types)
