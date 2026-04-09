import base64
import hashlib
import hmac
import json
import urllib.error
import urllib.parse
import urllib.request

from django.conf import settings


class PaymentConfigError(Exception):
    pass


class PaymentAPIError(Exception):
    pass


def _build_auth_header() -> str:
    if not settings.RAZORPAY_KEY_ID or not settings.RAZORPAY_KEY_SECRET:
        raise PaymentConfigError(
            "Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to backend/.env."
        )

    token = base64.b64encode(
        f"{settings.RAZORPAY_KEY_ID}:{settings.RAZORPAY_KEY_SECRET}".encode("utf-8")
    ).decode("utf-8")
    return f"Basic {token}"


def _razorpay_request(method: str, path: str, data: dict[str, str] | None = None):
    headers = {
        "Authorization": _build_auth_header(),
    }
    payload = None
    if data is not None:
        payload = urllib.parse.urlencode(data).encode("utf-8")
        headers["Content-Type"] = "application/x-www-form-urlencoded"

    request = urllib.request.Request(
        f"https://api.razorpay.com{path}",
        data=payload,
        headers=headers,
        method=method,
    )

    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="ignore")
        try:
            parsed = json.loads(body)
            error_data = parsed.get("error", {})
            message = error_data.get("description") or error_data.get("message") or body or "Razorpay request failed."
        except json.JSONDecodeError:
            message = body or "Razorpay request failed."
        raise PaymentAPIError(message) from exc
    except urllib.error.URLError as exc:
        raise PaymentAPIError("Unable to reach Razorpay. Check your network and Razorpay keys.") from exc


def create_checkout_order(*, user, service, stylist_name: str, booking_date: str, booking_time: str, notes: str = ""):
    amount = int(service.price * 100)
    payload = {
        "amount": str(amount),
        "currency": settings.RAZORPAY_CURRENCY.upper(),
        "receipt": f"booking_{user.pk}_{service.pk}_{booking_date}_{booking_time}".replace(" ", "_")[:40],
        "payment_capture": "1",
        "notes[user_id]": str(user.pk),
        "notes[service_id]": str(service.pk),
        "notes[service_title]": service.title,
        "notes[stylist_name]": stylist_name,
        "notes[booking_date]": booking_date,
        "notes[booking_time]": booking_time,
        "notes[notes]": notes,
    }

    order = _razorpay_request("POST", "/v1/orders", payload)
    order["checkout"] = {
        "key": settings.RAZORPAY_KEY_ID,
        "amount": amount,
        "currency": settings.RAZORPAY_CURRENCY.upper(),
        "name": "Aurelia Beauty & Spa",
        "description": service.title,
        "order_id": order.get("id"),
        "prefill": {
            "name": user.get_full_name().strip() or user.username,
            "email": user.email,
        },
        "notes": {
            "service_title": service.title,
            "stylist_name": stylist_name,
            "booking_date": booking_date,
            "booking_time": booking_time,
        },
        "theme": {
            "color": "#b8860b",
        },
    }
    return order


def retrieve_payment(payment_id: str):
    return _razorpay_request("GET", f"/v1/payments/{payment_id}")


def retrieve_order(order_id: str):
    return _razorpay_request("GET", f"/v1/orders/{order_id}")


def verify_payment_signature(*, order_id: str, payment_id: str, signature: str):
    if not settings.RAZORPAY_KEY_SECRET:
        raise PaymentConfigError("Razorpay secret is not configured.")

    if not order_id or not payment_id or not signature:
        raise PaymentAPIError("Missing Razorpay payment verification fields.")

    signed_payload = f"{order_id}|{payment_id}"
    expected = hmac.new(
        settings.RAZORPAY_KEY_SECRET.encode("utf-8"),
        signed_payload.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()

    if not hmac.compare_digest(expected, signature):
        raise PaymentAPIError("Razorpay signature verification failed.")

    return True
