from django.core.mail import send_mail
from django.conf import settings

def send_plain_email(subject, body, receivers):
    if not receivers:
        raise RuntimeError("RECEIVER_EMAILS is empty")
    from_email = getattr(settings, "DEFAULT_FROM_EMAIL", settings.EMAIL_HOST_USER)
    # Send a single message to all receivers (Django will handle list)
    return send_mail(subject, body, from_email, receivers, fail_silently=False)
