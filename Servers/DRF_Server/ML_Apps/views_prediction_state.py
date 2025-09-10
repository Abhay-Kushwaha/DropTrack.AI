# ML_Apps/views_prediction_state.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .pymongo_client import get_db
from .summary import generate_gemini_insights  
from .prediction_state_pipeline import resolve_state_oid, predict_for_state

class PredictStateView(APIView):
    """
    POST /ML_api/predict/state/
    Body:
      {
        "state_name": "Rajasthan",
        "fees_months_denom": 12,        # optional, default 12
        "with_gemini": true,            # optional, default false
        "gemini_max_students": 10,      # optional
        "gemini_max_chars": 1800        # optional
      }
    Rule: Never accept ObjectIds from client.
    """

    def post(self, request):
        # Hard rule: reject any raw ObjectId param
        if "state_id" in request.data:
            return Response(
                {"detail": "Do not send ObjectId. Use state_name (string)."},
                status=status.HTTP_400_BAD_REQUEST
            )

        state_name = request.data.get("state_name")
        if not state_name:
            return Response({"detail": "state_name is required."}, status=status.HTTP_400_BAD_REQUEST)

        with_gemini = bool(request.data.get("with_gemini", False))
        g_max_students = int(request.data.get("gemini_max_students", 10))
        g_max_chars = int(request.data.get("gemini_max_chars", 1800))

        try:
            denom = int(request.data.get("fees_months_denom", 12))
        except Exception:
            denom = 12

        try:
            db = get_db()
            state_oid = resolve_state_oid(db, state_name=state_name)
            payload = predict_for_state(db, state_oid, fees_months_denom=denom)

            # Optional Gemini insights for the state view
            if with_gemini and payload.get("results"):
                insights, g_status = generate_gemini_insights(
                    results=payload["results"],
                    school_label=state_name,   # label shown in the brief header
                    max_students=g_max_students,
                    max_chars=g_max_chars,
                )
                payload["gemini"] = {"status": g_status, "insights": insights or ""}

            return Response(payload, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"detail": f"State prediction failed: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
