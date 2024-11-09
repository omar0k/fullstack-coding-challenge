from django.urls import path
from rest_framework import routers
from .views import (
    ComplaintViewSet,
    OpenCasesViewSet,
    ClosedCasesViewSet,
    TopComplaintTypeViewSet,
    ConstituentsComplaintsViewSet,
    UserViewSet,
)

router = routers.SimpleRouter()
router.register(r"allComplaints", ComplaintViewSet, basename="complaint")
router.register(r"openCases", OpenCasesViewSet, basename="openCases")
router.register(r"closedCases", ClosedCasesViewSet, basename="closedCases")
router.register(r"topComplaints", TopComplaintTypeViewSet, basename="topComplaints")
router.register(
    r"constituentsComplaints",
    ConstituentsComplaintsViewSet,
    basename="contituentsComplaints",
)
router.register(r"userProfiles", UserViewSet, basename="userProfiles")
urlpatterns = []
urlpatterns += router.urls
