import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { type Booking } from "@/lib/api";

const BookingSuccess = () => {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const rawBooking = sessionStorage.getItem("latest_booking_success");
    if (!rawBooking) {
      setError("We could not find the latest verified booking details. Please check your dashboard.");
      setLoading(false);
      return;
    }

    try {
      setBooking(JSON.parse(rawBooking) as Booking);
    } catch {
      setError("We could not load the booking details. Please check your dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 py-32">
        <div className="mx-auto max-w-2xl rounded-3xl border border-border/50 bg-card/80 p-10 text-center shadow-luxury backdrop-blur-xl">
          {loading ? (
            <p className="font-body text-sm text-muted-foreground">Finalizing your booking...</p>
          ) : error ? (
            <>
              <h1 className="font-display text-3xl text-foreground">Payment Received</h1>
              <p className="mt-4 font-body text-sm text-muted-foreground">{error}</p>
              <div className="mt-8 flex justify-center gap-3">
                <Link to="/dashboard" className="rounded-full bg-gradient-gold px-6 py-3 font-body text-xs uppercase tracking-[0.15em] text-primary-foreground">
                  Go To Dashboard
                </Link>
                <Link to="/contact" className="rounded-full border border-border/50 px-6 py-3 font-body text-xs uppercase tracking-[0.15em] text-foreground">
                  Contact Support
                </Link>
              </div>
            </>
          ) : (
            <>
              <h1 className="font-display text-3xl text-foreground">Booking Confirmed</h1>
              <p className="mt-4 font-body text-sm text-muted-foreground">
                Your payment has been received and your appointment is awaiting admin confirmation.
              </p>
              {booking && (
                <div className="mt-8 rounded-2xl bg-muted/30 p-6 text-left font-body text-sm">
                  <p><strong>Service:</strong> {booking.service_title}</p>
                  <p><strong>Date:</strong> {booking.booking_date}</p>
                  <p><strong>Time:</strong> {booking.booking_time}</p>
                  <p><strong>Status:</strong> {booking.status}</p>
                  <p><strong>Payment:</strong> {booking.payment_status}</p>
                </div>
              )}
              <div className="mt-8 flex justify-center gap-3">
                <Link to="/dashboard" className="rounded-full bg-gradient-gold px-6 py-3 font-body text-xs uppercase tracking-[0.15em] text-primary-foreground">
                  View Dashboard
                </Link>
                <Link to="/" className="rounded-full border border-border/50 px-6 py-3 font-body text-xs uppercase tracking-[0.15em] text-foreground">
                  Back Home
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
      <FooterSection />
    </div>
  );
};

export default BookingSuccess;
