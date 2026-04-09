
from rest_framework import serializers
from django.contrib.auth.models import User
from django.db.models import Q
from django.utils import timezone
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Profile, Service, Booking, ContactMessage

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Profile
        fields = '__all__'


class AccountUpdateSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    first_name = serializers.CharField(max_length=150, allow_blank=True, required=False)
    last_name = serializers.CharField(max_length=150, allow_blank=True, required=False)
    phone = serializers.CharField(max_length=20, allow_blank=True, required=False)
    avatar_url = serializers.URLField(allow_blank=True, required=False)

    def validate_username(self, value):
        normalized_username = value.strip()
        if User.objects.filter(username__iexact=normalized_username).exclude(pk=self.context["request"].user.pk).exists():
            raise serializers.ValidationError("This username is already taken.")
        return normalized_username

    def validate_email(self, value):
        normalized_email = value.strip().lower()
        if User.objects.filter(email__iexact=normalized_email).exclude(pk=self.context["request"].user.pk).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return normalized_email

    def update(self, instance, validated_data):
        profile, _ = Profile.objects.get_or_create(user=instance)
        instance.username = validated_data["username"]
        instance.email = validated_data["email"]
        instance.first_name = validated_data.get("first_name", "")
        instance.last_name = validated_data.get("last_name", "")
        instance.save()

        profile.phone = validated_data.get("phone", "")
        profile.avatar_url = validated_data.get("avatar_url", "")
        profile.save()
        return instance

class RegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True, min_length=6)
    full_name = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'full_name']

    def validate_username(self, value):
        normalized_username = value.strip()
        if User.objects.filter(username__iexact=normalized_username).exists():
            raise serializers.ValidationError('This username is already taken.')
        return normalized_username

    def validate_email(self, value):
        normalized_email = value.strip().lower()
        if User.objects.filter(email__iexact=normalized_email).exists():
            raise serializers.ValidationError('An account with this email already exists.')
        return normalized_email

    def create(self, validated_data):
        username = validated_data.pop('username')
        full_name = validated_data.pop('full_name', '')
        parts = full_name.split(' ', 1)
        user = User.objects.create_user(
            username=username,
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=parts[0] if parts else '',
            last_name=parts[1] if len(parts) > 1 else '',
        )
        return user


class EmailOrUsernameTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = User.USERNAME_FIELD

    def validate(self, attrs):
        identifier = attrs.get("username", "").strip()
        password = attrs.get("password")

        if not identifier or not password:
            raise serializers.ValidationError({"detail": "Username/email and password are required."})

        user = User.objects.filter(Q(username__iexact=identifier) | Q(email__iexact=identifier)).first()
        if not user:
            raise serializers.ValidationError({"detail": "No account matches that username or email."})

        attrs["username"] = user.username
        data = super().validate(attrs)
        data["user"] = UserSerializer(self.user).data
        return data

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    service_title = serializers.CharField(source='service.title', read_only=True)
    user_name = serializers.SerializerMethodField()
    user_email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ['user', 'payment_amount', 'payment_currency', 'payment_provider', 'payment_reference']

    def get_user_name(self, obj):
        full_name = obj.user.get_full_name().strip()
        return full_name or obj.user.username

    def validate(self, attrs):
        request = self.context.get("request")
        user = getattr(request, "user", None)
        is_admin = bool(
            user
            and user.is_authenticated
            and (user.is_staff or user.is_superuser or user.roles.filter(role="admin").exists())
        )

        instance = getattr(self, "instance", None)

        booking_date = attrs.get("booking_date", getattr(instance, "booking_date", None))
        booking_time = attrs.get("booking_time", getattr(instance, "booking_time", None))
        stylist_name = attrs.get("stylist_name", getattr(instance, "stylist_name", ""))
        service = attrs.get("service", getattr(instance, "service", None))
        if booking_date and booking_date < timezone.localdate():
            raise serializers.ValidationError({"booking_date": "Booking date must be today or later."})

        if booking_date and booking_time:
            conflicting_bookings = Booking.objects.exclude(status__in=["cancelled", "completed"])
            if instance:
                conflicting_bookings = conflicting_bookings.exclude(pk=instance.pk)

            if stylist_name:
                conflicting_bookings = conflicting_bookings.filter(
                    booking_date=booking_date,
                    booking_time=booking_time,
                    stylist_name__iexact=stylist_name,
                )
                if conflicting_bookings.exists():
                    raise serializers.ValidationError(
                        {"booking_time": "That stylist is already booked for the selected time slot."}
                    )
            elif service:
                conflicting_bookings = conflicting_bookings.filter(
                    booking_date=booking_date,
                    booking_time=booking_time,
                    service=service,
                )
                if conflicting_bookings.exists():
                    raise serializers.ValidationError(
                        {"booking_time": "This time slot is already occupied for the selected service."}
                    )

        if instance and not is_admin:
            if instance.status in {"completed", "cancelled"}:
                raise serializers.ValidationError("This booking can no longer be updated.")

            allowed_fields = {"stylist_name", "booking_date", "booking_time", "notes", "status"}
            unexpected_fields = set(attrs.keys()) - allowed_fields
            if unexpected_fields:
                raise serializers.ValidationError("You can only reschedule or cancel your own booking.")

            next_status = attrs.get("status")
            if next_status and next_status != "cancelled":
                raise serializers.ValidationError({"status": "You can only cancel a booking from your dashboard."})

        return attrs

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = '__all__'


class CheckoutSessionSerializer(serializers.Serializer):
    service = serializers.PrimaryKeyRelatedField(queryset=Service.objects.all())
    stylist_name = serializers.CharField(max_length=255)
    booking_date = serializers.DateField()
    booking_time = serializers.CharField(max_length=20)
    notes = serializers.CharField(allow_blank=True, required=False)
