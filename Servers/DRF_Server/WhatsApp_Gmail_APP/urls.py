from django.urls import path
from .views import EmailNotifyView, WhatsAppNotifyView

urlpatterns = [
    path('notify/email/', EmailNotifyView.as_view(), name='notify-email'),
    path('notify/whatsapp/', WhatsAppNotifyView.as_view(), name='notify-whatsapp'),
]


"""
POST Methods : 

http://localhost:8000/DRF_Gmail_WhatsApp_Api/notify/email/

{
    "message": "Hello from DRF Email endpoint\nLine 2  "
}





http://localhost:8000/DRF_Gmail_WhatsApp_Api/notify/whatsapp/

{
    "message": "Hello from DRF WhatsApp endpoint 🚀"
}



"""
