// API client for Django backend integration
// Configure API_BASE_URL to point to your Django server

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

interface TokenPair {
  access: string;
  refresh: string;
}

interface AuthResponse {
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  tokens: TokenPair;
}

interface MeResponse {
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  profile: {
    id: number;
    phone: string;
    avatar_url: string;
  } | null;
  roles: string[];
}

type AccountUpdatePayload = {
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar_url?: string;
};

interface Service {
  id: number;
  title: string;
  category: string;
  duration: string;
  price: string;
  description: string;
  image_url: string;
}

interface Booking {
  id: number;
  user: number;
  service: number;
  service_title: string;
  user_name?: string;
  user_email?: string;
  stylist_name: string;
  booking_date: string;
  booking_time: string;
  status: string;
  payment_status: string;
  payment_amount?: string | null;
  payment_currency?: string;
  payment_provider?: string;
  payment_reference?: string;
  notes: string;
}

type BookingUpdatePayload = Partial<Pick<Booking, "stylist_name" | "booking_date" | "booking_time" | "notes" | "status">>;

type ContactMessage = {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
};

type CheckoutSessionResponse = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
};

type CheckoutVerificationResponse = {
  payment_status: string;
  checkout_status: string;
  booking: Booking | null;
};

export function setAuthTokens(tokens: TokenPair) {
  localStorage.setItem("access_token", tokens.access);
  localStorage.setItem("refresh_token", tokens.refresh);
}

export function clearAuthTokens() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

export function formatApiError(error: unknown) {
  if (!(error instanceof Error)) {
    return "Something went wrong. Please try again.";
  }

  try {
    const parsed = JSON.parse(error.message) as Record<string, string[] | string>;
    const firstEntry = Object.values(parsed)[0];
    if (Array.isArray(firstEntry)) {
      return firstEntry[0];
    }
    if (typeof firstEntry === "string") {
      return firstEntry;
    }
  } catch {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("access_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle token refresh
  if (res.status === 401 && token) {
    const refreshToken = localStorage.getItem("refresh_token");
    if (refreshToken) {
      try {
        const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh: refreshToken }),
        });
        if (refreshRes.ok) {
          const data = await refreshRes.json();
        localStorage.setItem("access_token", data.access);
          headers["Authorization"] = `Bearer ${data.access}`;
          const retryRes = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
          });
          if (!retryRes.ok) throw new Error(`API error: ${retryRes.status}`);
          return retryRes.json();
        }
      } catch {
        clearAuthTokens();
      }
    }
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(JSON.stringify(errorData) || `API error: ${res.status}`);
  }

  return res.json();
}

export const apiClient = {
  // Auth
  register: (data: { username: string; email: string; password: string; full_name?: string }) =>
    request<AuthResponse>("/auth/register/", { method: "POST", body: JSON.stringify(data) }),

  login: (identifier: string, password: string) =>
    request<{ access: string; refresh: string; user?: AuthResponse["user"] }>("/auth/login/", {
      method: "POST",
      body: JSON.stringify({ username: identifier, password }),
    }),

  me: () => request<MeResponse>("/auth/me/"),
  updateMe: (data: AccountUpdatePayload) =>
    request<MeResponse>("/auth/me/", { method: "PATCH", body: JSON.stringify(data) }),

  // Services
  getServices: () => request<Service[]>("/services/"),
  getService: (id: number) => request<Service>(`/services/${id}/`),

  // Bookings
  getBookings: () => request<Booking[]>("/bookings/"),
  createBooking: (data: {
    service_title?: string;
    stylist_name: string;
    booking_date: string;
    booking_time: string;
    notes?: string;
    service?: number;
  }) => request<Booking>("/bookings/", { method: "POST", body: JSON.stringify(data) }),
  updateBooking: (id: number, data: BookingUpdatePayload) =>
    request<Booking>(`/bookings/${id}/`, { method: "PATCH", body: JSON.stringify(data) }),
  createBookingCheckout: (data: {
    service: number;
    stylist_name: string;
    booking_date: string;
    booking_time: string;
    notes?: string;
  }) => request<CheckoutSessionResponse>("/payments/checkout/", { method: "POST", body: JSON.stringify(data) }),
  verifyBookingCheckout: (data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => request<CheckoutVerificationResponse>("/payments/verify/", { method: "POST", body: JSON.stringify(data) }),

  // Contact
  sendContact: (data: { name: string; email: string; phone?: string; message: string }) =>
    request<{ id: number }>("/contact/", { method: "POST", body: JSON.stringify(data) }),

  getContactMessages: () =>
    request<ContactMessage[]>("/contact/list/"),
};

export type {
  AuthResponse,
  MeResponse,
  Service,
  Booking,
  ContactMessage,
  AccountUpdatePayload,
  CheckoutSessionResponse,
  CheckoutVerificationResponse,
};
