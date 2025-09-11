from django.urls import path
from .views_prediction import PredictSchoolView
from .views_prediction_state import PredictStateView 
from .views_prediction_region import PredictDistrictView, PredictTalukaView, PredictCityView
    
from .views_prediction_aggregate import (
    PredictStateAggregateDistrictsView,
    PredictStateAggregateTalukasView,
    PredictStateAggregateCitiesView,
)

urlpatterns = [
    path("predict/school/", PredictSchoolView.as_view(), name="predict-school"),
    path("predict/state/", PredictStateView.as_view(), name="predict-state"),

    path("predict/district/", PredictDistrictView.as_view(), name="predict-district"),
    path("predict/taluka/", PredictTalukaView.as_view(), name="predict-taluka"),
    path("predict/city/", PredictCityView.as_view(), name="predict-city"),

    path("predict/state/aggregate/districts/", PredictStateAggregateDistrictsView.as_view(), name="predict-state-agg-districts"),
    path("predict/state/aggregate/talukas/",  PredictStateAggregateTalukasView.as_view(),  name="predict-state-agg-talukas"),
    path("predict/state/aggregate/cities/",   PredictStateAggregateCitiesView.as_view(),   name="predict-state-agg-cities"),
]



"""
-----------------------------------------------------
// to generate the .pkl file (run only onces! )
# in all json inputs below : 

"force_retrain": true    
-----------------------------------------------------

http://127.0.0.1:8000/ML_api/predict/school/
{
  "school_name": "Jaipur Public School",
  "fees_months_denom": 12,
  "with_gemini": true,
  "gemini_max_students": 8,
  "gemini_max_chars": 1500
}
// Body (Option B - by name):
{
  "school_name": "Jaipur Public School",
  "with_gemini": false
}

http://127.0.0.1:8000/ML_api/predict/state/
{
    "state_name": "Rajasthan",
    "fees_months_denom": 12,        
    "with_gemini": true,            
    "gemini_max_students": 10,      
    "gemini_max_chars": 1800,       
    "force_retrain": false          
}

http://127.0.0.1:8000/ML_api/predict/district/
{
  "district_name": "Jaipur",
  "fees_months_denom": 12,
  "with_gemini": true,
  "force_retrain": false
}


# select  taluka which has students 
http://127.0.0.1:8000/ML_api/predict/taluka/
{
  "taluka_name": "Bhubaneswar",
  "with_gemini": false
}


http://127.0.0.1:8000/ML_api/predict/city/
{
  "city_name": "Jaipur",
  "with_gemini": true
}



#  Aggregated — Per-district summaries for a state
http://127.0.0.1:8000/ML_api/predict/state/aggregate/districts/
{
  "state_name": "Rajasthan",
  "with_top_students": true,
  "top_n": 3,
  "force_retrain": false
}

# Aggregated — Per-taluka summaries for a state
http://127.0.0.1:8000/ML_api/predict/state/aggregate/talukas/
{
  "state_name": "Rajasthan",
  "with_top_students": false
}

# Aggregated — Per-city summaries for a state
http://127.0.0.1:8000/ML_api/predict/state/aggregate/cities/
{
  "state_name": "Rajasthan",
  "top_n": 5,
  "with_top_students": true
}



"""
