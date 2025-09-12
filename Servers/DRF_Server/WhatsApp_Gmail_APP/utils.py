from django.conf import settings

def normalize_whatsapp_number(msisdn):
    msisdn = (msisdn or "").strip()
    if not msisdn:
        raise ValueError("Empty number in RECEIVERS_WHATSAPP_NUMBERS")
    if not msisdn.startswith("+"):
        cc = getattr(settings, "DEFAULT_COUNTRY_CODE", "+91")
        msisdn = cc + msisdn
    return "whatsapp:" + msisdn
