
from types import SimpleNamespace
from rest_framework import viewsets, generics, permissions, status, serializers, exceptions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
from django.conf import settings
from .models import Profile, UserRole, Service, Booking, ContactMessage
from .notifications import send_booking_notification, send_contact_notification
from .payments import (
    PaymentAPIError,
    PaymentConfigError,
    create_checkout_order,
    retrieve_order,
    retrieve_payment,
    verify_payment_signature,
)
from .serializers import (
    ProfileSerializer, RegisterSerializer, ServiceSerializer,
    BookingSerializer, ContactMessageSerializer, UserSerializer,
    EmailOrUsernameTokenObtainPairSerializer, AccountUpdateSerializer,
    CheckoutSessionSerializer,
)

class EmailOrUsernameTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailOrUsernameTokenObtainPairSerializer


class IsAdminRole(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return request.user.is_staff or request.user.is_superuser or UserRole.objects.filter(user=request.user, role='admin').exists()


def _is_admin_user(user):
    return bool(
        user
        and user.is_authenticated
        and (user.is_staff or user.is_superuser or UserRole.objects.filter(user=user, role='admin').exists())
    )


def _ensure_paid_booking_from_payment(order_data, payment_data, acting_user=None):
    order_id = order_data.get("id")
    payment_id = payment_data.get("id")
    if not order_id or not payment_id:
        raise serializers.ValidationError({"detail": "Razorpay payment is missing required identifiers."})

    existing = Booking.objects.select_related("user", "service").filter(payment_reference=payment_id).first()
    if existing:
        if acting_user and not _is_admin_user(acting_user) and existing.user_id != acting_user.id:
            raise exceptions.PermissionDenied("This payment session does not belong to you.")
        return existing

    metadata = order_data.get("notes") or {}
    user_id = metadata.get("user_id")
    service_id = metadata.get("service_id")
    if not user_id or not service_id:
        raise serializers.ValidationError({"detail": "Razorpay order notes are incomplete."})

    user = User.objects.get(pk=user_id)
    if acting_user and not _is_admin_user(acting_user) and user.pk != acting_user.pk:
        raise exceptions.PermissionDenied("This payment session does not belong to you.")

    serializer = BookingSerializer(
        data={
            "service": service_id,
            "stylist_name": metadata.get("stylist_name", ""),
            "booking_date": metadata.get("booking_date", ""),
            "booking_time": metadata.get("booking_time", ""),
            "notes": metadata.get("notes", ""),
        },
        context={"request": SimpleNamespace(user=user)},
    )
    serializer.is_valid(raise_exception=True)

    booking = serializer.save(
        user=user,
        status="pending",
        payment_status="paid",
        payment_amount=(payment_data.get("amount") or order_data.get("amount") or 0) / 100,
        payment_currency=(payment_data.get("currency") or order_data.get("currency") or settings.RAZORPAY_CURRENCY).upper(),
        payment_provider="razorpay",
        payment_reference=payment_id,
    )
    send_booking_notification(
        booking,
        "Aurelia booking created",
        ["Your payment was received and your booking is now awaiting confirmation."],
    )
    return booking

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PATCH'])
def me(request):
    profile, _ = Profile.objects.get_or_create(user=request.user)

    if request.method == 'PATCH':
        serializer = AccountUpdateSerializer(instance=request.user, data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        profile.refresh_from_db()

    roles = list(UserRole.objects.filter(user=request.user).values_list('role', flat=True))
    if (request.user.is_staff or request.user.is_superuser) and 'admin' not in roles:
        roles.append('admin')
    return Response({
        'user': UserSerializer(request.user).data,
        'profile': ProfileSerializer(profile).data if profile else None,
        'roles': roles,
    })

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all().order_by('title')
    serializer_class = ServiceSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [IsAdminRole()]

class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer

    def get_queryset(self):
        queryset = Booking.objects.select_related('user', 'service').order_by('booking_date', 'booking_time')
        if IsAdminRole().has_permission(self.request, self):
            return queryset
        return queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        booking = serializer.save(user=self.request.user)
        send_booking_notification(
            booking,
            "Aurelia booking confirmed",
            ["Your booking request has been created successfully."],
        )

    def perform_update(self, serializer):
        previous_booking = self.get_object()
        previous_state = {
            'booking_date': previous_booking.booking_date,
            'booking_time': previous_booking.booking_time,
            'status': previous_booking.status,
            'stylist_name': previous_booking.stylist_name,
        }
        booking = serializer.save()

        changes = []
        if previous_state['booking_date'] != booking.booking_date or previous_state['booking_time'] != booking.booking_time:
            changes.append("Your appointment schedule has been updated.")
        if previous_state['stylist_name'] != booking.stylist_name and booking.stylist_name:
            changes.append(f"Your stylist is now {booking.stylist_name}.")
        if previous_state['status'] != booking.status:
            changes.append(f"Your booking status is now {booking.status.replace('_', ' ')}.")

        if changes:
            send_booking_notification(
                booking,
                "Aurelia booking update",
                changes,
            )

class ContactMessageView(generics.CreateAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        contact_message = serializer.save()
        send_contact_notification(contact_message)

class ContactMessageListView(generics.ListAPIView):
    queryset = ContactMessage.objects.all().order_by('-created_at')
    serializer_class = ContactMessageSerializer
    permission_classes = [IsAdminRole]


@api_view(['POST'])
def create_booking_checkout(request):
    serializer = CheckoutSessionSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    booking_validator = BookingSerializer(data=request.data, context={"request": request})
    booking_validator.is_valid(raise_exception=True)

    try:
        order = create_checkout_order(
            user=request.user,
            service=serializer.validated_data["service"],
            stylist_name=serializer.validated_data["stylist_name"],
            booking_date=str(serializer.validated_data["booking_date"]),
            booking_time=serializer.validated_data["booking_time"],
            notes=serializer.validated_data.get("notes", ""),
        )
    except (PaymentConfigError, PaymentAPIError) as exc:
        return Response({"detail": str(exc)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

    return Response(order.get("checkout", {}))


@api_view(['POST'])
def verify_booking_checkout(request):
    order_id = request.data.get("razorpay_order_id")
    payment_id = request.data.get("razorpay_payment_id")
    signature = request.data.get("razorpay_signature")

    if not order_id or not payment_id or not signature:
        return Response({"detail": "Payment verification fields are required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        verify_payment_signature(order_id=order_id, payment_id=payment_id, signature=signature)
        payment = retrieve_payment(payment_id)
        order_data = retrieve_order(order_id)
    except PaymentConfigError as exc:
        return Response({"detail": str(exc)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
    except PaymentAPIError as exc:
        return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

    order_notes = order_data.get("notes") or {}
    if not _is_admin_user(request.user) and str(request.user.pk) != order_notes.get("user_id"):
        return Response({"detail": "This payment session does not belong to you."}, status=status.HTTP_403_FORBIDDEN)

    booking = None
    if payment.get("status") in {"authorized", "captured"}:
        booking = _ensure_paid_booking_from_payment(order_data, payment, acting_user=request.user)

    return Response(
        {
            "payment_status": "paid" if booking else payment.get("status", "created"),
            "checkout_status": payment.get("status", "created"),
            "booking": BookingSerializer(booking).data if booking else None,
        }
    )
