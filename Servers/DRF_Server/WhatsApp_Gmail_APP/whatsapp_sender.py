from django.conf import settings
from twilio.rest import Client
from .utils import normalize_whatsapp_number

def send_whatsapp_text(body, receivers):
    if not body or not str(body).strip():
        raise ValueError("Cannot send empty WhatsApp message")

    account_sid = getattr(settings, "TWILIO_ACCOUNT_SID", "")
    auth_token = getattr(settings, "TWILIO_AUTH_TOKEN", "")
    from_raw = getattr(settings, "SENDER_WHATSAPP_NUMBER", "")
    if not account_sid or not auth_token:
        raise RuntimeError("Twilio credentials missing in settings")
    if not from_raw:
        raise RuntimeError("SENDER_WHATSAPP_NUMBER missing in settings")
    if not receivers:
        raise RuntimeError("RECEIVERS_WHATSAPP_NUMBERS is empty")

    client = Client(account_sid, auth_token)
    sender = "whatsapp:" + from_raw

    results = []
    for raw in receivers:
        to_num = normalize_whatsapp_number(str(raw))
        msg = client.messages.create(from_=sender, to=to_num, body=body)
        results.append({"to": to_num, "sid": msg.sid})
    return results
