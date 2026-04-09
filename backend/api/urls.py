
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

router = DefaultRouter()
router.register(r'services', views.ServiceViewSet)
router.register(r'bookings', views.BookingViewSet, basename='booking')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.EmailOrUsernameTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', views.me, name='me'),
    path('payments/checkout/', views.create_booking_checkout, name='payments-checkout'),
    path('payments/verify/', views.verify_booking_checkout, name='payments-verify'),
    path('contact/', views.ContactMessageView.as_view(), name='contact'),
    path('contact/list/', views.ContactMessageListView.as_view(), name='contact-list'),
]
