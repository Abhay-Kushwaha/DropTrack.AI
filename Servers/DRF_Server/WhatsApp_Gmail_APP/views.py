from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings

from .serializers import MessageSerializer
from .email_sender import send_plain_email
from .whatsapp_sender import send_whatsapp_text

class EmailNotifyView(APIView):
    def post(self, request):
        ser = MessageSerializer(data=request.data)
        if not ser.is_valid():
            return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)

        body = ser.validated_data['message']
        subject = body.split("\n", 1)[0][:78] or "Notification"
        receivers = getattr(settings, "RECEIVER_EMAILS", [])
        try:
            count = send_plain_email(subject, body, receivers)
            return Response(
                {"ok": True, "sent": count, "receivers": receivers},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response({"ok": False, "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class WhatsAppNotifyView(APIView):
    def post(self, request):
        ser = MessageSerializer(data=request.data)
        if not ser.is_valid():
            return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)

        body = ser.validated_data['message']
        receivers = getattr(settings, "RECEIVERS_WHATSAPP_NUMBERS", [])
        try:
            res = send_whatsapp_text(body, receivers)
            return Response({"ok": True, "results": res}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"ok": False, "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
