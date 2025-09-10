from django.urls import path
from .views_prediction import PredictSchoolView
from .views_prediction_state import PredictStateView 

urlpatterns = [
    path("predict/school/", PredictSchoolView.as_view(), name="predict-school"),
    path("predict/state/", PredictStateView.as_view(), name="predict-state"),
]
