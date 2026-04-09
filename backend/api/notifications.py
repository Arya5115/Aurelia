from django.conf import settings
from django.core.mail import send_mail


def send_booking_notification(booking, subject, lines):
    message = "\n".join(
        [
            f"Hello {booking.user.get_full_name().strip() or booking.user.username},",
            "",
            *lines,
            "",
            f"Service: {booking.service.title if booking.service else 'Aurelia booking'}",
            f"Date: {booking.booking_date}",
            f"Time: {booking.booking_time}",
            f"Status: {booking.status.replace('_', ' ')}",
            f"Payment: {booking.payment_status.replace('_', ' ')}",
            f"Location: {settings.BUSINESS_LOCATION}",
            f"Support: {settings.BUSINESS_EMAIL} | {settings.BUSINESS_PHONE}",
        ]
    )

    recipients = []
    if booking.user.email:
        recipients.append(booking.user.email)
    if settings.BUSINESS_EMAIL and settings.BUSINESS_EMAIL not in recipients:
        recipients.append(settings.BUSINESS_EMAIL)

    if recipients:
        send_mail(
          subject=subject,
          message=message,
          from_email=settings.DEFAULT_FROM_EMAIL,
          recipient_list=recipients,
          fail_silently=True,
        )


def send_contact_notification(contact_message):
    if settings.BUSINESS_EMAIL:
        admin_message = "\n".join(
            [
                "New contact enquiry received.",
                "",
                f"Name: {contact_message.name}",
                f"Email: {contact_message.email}",
                f"Phone: {contact_message.phone or 'Not provided'}",
                "",
                contact_message.message,
            ]
        )
        send_mail(
            subject="New Aurelia contact enquiry",
            message=admin_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.BUSINESS_EMAIL],
            fail_silently=True,
        )

    send_mail(
        subject="We received your message",
        message="\n".join(
            [
                f"Hello {contact_message.name},",
                "",
                "Thank you for contacting Aurelia Beauty & Spa.",
                "Our team will get back to you soon.",
                "",
                f"You can also reach us at {settings.BUSINESS_EMAIL} or {settings.BUSINESS_PHONE}.",
            ]
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[contact_message.email],
        fail_silently=True,
    )
