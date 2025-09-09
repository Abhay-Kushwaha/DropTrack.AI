from django.urls import path
from .views_prediction import PredictSchoolView

urlpatterns = [
    path("predict/", PredictSchoolView.as_view(), name="predict-school"),
]
