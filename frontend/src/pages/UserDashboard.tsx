import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar, Bell, Clock, Star, MapPin,
  User, LogOut, Home, History, CalendarDays, BellRing, CalendarClock, Ban
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/auth";
import { apiClient, formatApiError, type Booking } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { businessInfo } from "@/lib/business";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const tabs = [
  { label: "Upcoming", icon: CalendarDays },
  { label: "History", icon: History },
  { label: "Notifications", icon: BellRing },
];

const timeSlots = ["9:00 AM", "10:30 AM", "12:00 PM", "1:30 PM", "3:00 PM", "4:30 PM"];

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [rescheduleBooking, setRescheduleBooking] = useState<Booking | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [savingBookingId, setSavingBookingId] = useState<number | null>(null);

  useEffect(() => {
    void loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setBookings(await apiClient.getBookings());
    } catch (error) {
      toast({
        title: "Unable to load bookings",
        description: formatApiError(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const { upcomingBookings, previousBookings, notifications } = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const upcoming = bookings.filter(booking => booking.booking_date >= today && booking.status !== "cancelled");
    const previous = bookings.filter(booking => booking.booking_date < today || booking.status === "completed" || booking.status === "cancelled");
    const items = bookings.slice(0, 8).map(booking => ({
      id: booking.id,
      title:
        booking.status === "confirmed"
          ? "Booking Confirmed"
          : booking.status === "cancelled"
            ? "Booking Cancelled"
            : "Booking Update",
      message: `${booking.service_title} is currently ${booking.status.replace("_", " ")} for ${booking.booking_date} at ${booking.booking_time}.`,
      time: booking.booking_date,
      unread: booking.status !== "completed",
    }));

    return {
      upcomingBookings: upcoming,
      previousBookings: previous,
      notifications: items,
    };
  }, [bookings]);

  const displayName = user?.first_name || user?.username || "Guest";

  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 21; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push(d.toISOString().split("T")[0]);
    }
    return dates;
  };

  const startReschedule = (booking: Booking) => {
    setRescheduleBooking(booking);
    setRescheduleDate(booking.booking_date);
    setRescheduleTime(booking.booking_time);
  };

  const handleReschedule = async () => {
    if (!rescheduleBooking) return;

    setSavingBookingId(rescheduleBooking.id);
    try {
      const updated = await apiClient.updateBooking(rescheduleBooking.id, {
        booking_date: rescheduleDate,
        booking_time: rescheduleTime,
      });
      setBookings(current => current.map(booking => (booking.id === updated.id ? updated : booking)));
      setRescheduleBooking(null);
      toast({
        title: "Booking rescheduled",
        description: "Your appointment date and time were updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Unable to reschedule",
        description: formatApiError(error),
        variant: "destructive",
      });
    } finally {
      setSavingBookingId(null);
    }
  };

  const handleCancelBooking = async (booking: Booking) => {
    setSavingBookingId(booking.id);
    try {
      const updated = await apiClient.updateBooking(booking.id, { status: "cancelled" });
      setBookings(current => current.map(item => (item.id === updated.id ? updated : item)));
      toast({
        title: "Booking cancelled",
        description: "This appointment has been cancelled.",
      });
    } catch (error) {
      toast({
        title: "Unable to cancel booking",
        description: formatApiError(error),
        variant: "destructive",
      });
    } finally {
      setSavingBookingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-gold flex items-center justify-center">
                <User size={24} className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground">Welcome back, {displayName}</h1>
                <p className="font-body text-sm text-muted-foreground">Manage your spa experience</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/#book"
                className="px-6 py-2.5 bg-gradient-gold text-primary-foreground font-body text-xs tracking-[0.15em] uppercase rounded-full hover:glow-gold transition-all duration-300 hover:scale-105"
              >
                New Booking
              </Link>
              <Link
                to="/profile"
                className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-border/50 text-foreground/70 hover:text-foreground hover:border-primary/50 transition-all font-body text-xs tracking-wider"
              >
                <User size={14} /> Profile
              </Link>
              <Link
                to="/"
                className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-border/50 text-foreground/70 hover:text-foreground hover:border-primary/50 transition-all font-body text-xs tracking-wider"
              >
                <Home size={14} /> Home
              </Link>
              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-destructive/30 text-destructive hover:bg-destructive/10 transition-all font-body text-xs tracking-wider"
              >
                <LogOut size={14} /> Log Out
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Upcoming", value: String(upcomingBookings.length), icon: Calendar },
              { label: "This Month", value: String(bookings.filter(booking => booking.booking_date.slice(0, 7) === new Date().toISOString().slice(0, 7)).length), icon: CalendarDays },
              { label: "Total Visits", value: String(bookings.length), icon: History },
              { label: "Notifications", value: String(notifications.filter(notification => notification.unread).length), icon: Bell, highlight: true },
            ].map(({ label, value, icon: Icon, highlight }) => (
              <div key={label} className="bg-card/80 backdrop-blur-xl rounded-2xl p-5 border border-border/50 hover:shadow-luxury transition-shadow duration-300">
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${highlight ? "bg-accent/30" : "bg-primary/10"}`}>
                    <Icon size={16} className={highlight ? "text-accent-foreground" : "text-primary"} />
                  </div>
                </div>
                <p className="font-display text-2xl font-semibold text-foreground">{value}</p>
                <p className="font-body text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mb-6 overflow-x-auto">
            {tabs.map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => setActiveTab(label)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-body text-sm transition-all duration-300 whitespace-nowrap ${
                  activeTab === label
                    ? "bg-primary text-primary-foreground shadow-luxury"
                    : "bg-card/80 text-muted-foreground hover:text-foreground border border-border/50"
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>

          <div className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 overflow-hidden">
            {loading && (
              <div className="p-8">
                <p className="font-body text-sm text-muted-foreground">Loading your bookings...</p>
              </div>
            )}

            {!loading && activeTab === "Upcoming" && (
              <div>
                <div className="p-5 border-b border-border/50">
                  <h2 className="font-display text-lg font-semibold text-foreground">Upcoming Appointments</h2>
                </div>
                <div className="divide-y divide-border/30">
                  {upcomingBookings.length === 0 && (
                    <div className="p-5">
                      <p className="font-body text-sm text-muted-foreground">No upcoming appointments yet.</p>
                    </div>
                  )}
                  {upcomingBookings.map((apt) => (
                    <div key={apt.id} className="p-5 hover:bg-primary/5 transition-colors">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex-1">
                          <h3 className="font-display text-base font-semibold text-foreground">{apt.service_title}</h3>
                          <div className="flex flex-wrap items-center gap-3 mt-1">
                            <span className="font-body text-sm text-muted-foreground flex items-center gap-1">
                              <User size={12} /> {apt.stylist_name || "Assigned soon"}
                            </span>
                            <span className="font-body text-sm text-muted-foreground flex items-center gap-1">
                              <Calendar size={12} /> {new Date(apt.booking_date).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })}
                            </span>
                            <span className="font-body text-sm text-muted-foreground flex items-center gap-1">
                              <Clock size={12} /> {apt.booking_time}
                            </span>
                            <span className="font-body text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin size={12} /> {businessInfo.locationShort}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-start gap-3 lg:items-end">
                          <span className={`px-3 py-1 rounded-full font-body text-xs ${
                            apt.status === "confirmed" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
                          }`}>
                            {apt.status.replace("_", " ")}
                          </span>
                          <div className="flex flex-wrap gap-2">
                            <span className={`inline-flex items-center rounded-full px-3 py-1 font-body text-xs ${
                              apt.payment_status === "paid" ? "bg-emerald-50 text-emerald-700" : "bg-yellow-50 text-yellow-700"
                            }`}>
                              Payment: {apt.payment_status}
                            </span>
                            <button
                              type="button"
                              onClick={() => startReschedule(apt)}
                              disabled={savingBookingId === apt.id}
                              className="inline-flex items-center gap-2 rounded-full border border-border/50 px-4 py-2 font-body text-xs uppercase tracking-[0.15em] text-foreground hover:border-primary/50 hover:text-primary disabled:opacity-50"
                            >
                              <CalendarClock size={14} />
                              Reschedule
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleCancelBooking(apt)}
                              disabled={savingBookingId === apt.id}
                              className="inline-flex items-center gap-2 rounded-full border border-destructive/30 px-4 py-2 font-body text-xs uppercase tracking-[0.15em] text-destructive hover:bg-destructive/10 disabled:opacity-50"
                            >
                              <Ban size={14} />
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!loading && activeTab === "History" && (
              <div>
                <div className="p-5 border-b border-border/50">
                  <h2 className="font-display text-lg font-semibold text-foreground">Booking History</h2>
                </div>
                <div className="divide-y divide-border/30">
                  {previousBookings.length === 0 && (
                    <div className="p-5">
                      <p className="font-body text-sm text-muted-foreground">Your completed history will show up here once appointments pass.</p>
                    </div>
                  )}
                  {previousBookings.map((booking) => (
                    <div key={booking.id} className="p-5 hover:bg-primary/5 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-display text-base font-semibold text-foreground">{booking.service_title}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="font-body text-sm text-muted-foreground">
                              {new Date(booking.booking_date).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })}
                            </span>
                            <span className="font-body text-sm font-medium text-foreground">{booking.status.replace("_", " ")}</span>
                            <span className="font-body text-sm text-muted-foreground">Payment: {booking.payment_status}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={14} className={i < 4 ? "text-primary fill-primary" : "text-border"} />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!loading && activeTab === "Notifications" && (
              <div>
                <div className="p-5 border-b border-border/50 flex items-center justify-between">
                  <h2 className="font-display text-lg font-semibold text-foreground">Notifications</h2>
                </div>
                <div className="divide-y divide-border/30">
                  {notifications.length === 0 && (
                    <div className="p-5">
                      <p className="font-body text-sm text-muted-foreground">Booking updates will appear here.</p>
                    </div>
                  )}
                  {notifications.map((notif) => (
                    <div key={notif.id} className={`p-5 hover:bg-primary/5 transition-colors ${notif.unread ? "bg-primary/[0.03]" : ""}`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${notif.unread ? "bg-primary" : "bg-transparent"}`} />
                        <div className="flex-1">
                          <h3 className="font-body text-sm font-medium text-foreground">{notif.title}</h3>
                          <p className="font-body text-sm text-muted-foreground mt-0.5">{notif.message}</p>
                          <span className="font-body text-xs text-muted-foreground/60 mt-1 block">{notif.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={Boolean(rescheduleBooking)} onOpenChange={(open) => !open && setRescheduleBooking(null)}>
        <DialogContent className="rounded-3xl border-border/50 bg-card/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-foreground">Reschedule Booking</DialogTitle>
            <DialogDescription className="font-body text-sm text-muted-foreground">
              Choose a new date and time for {rescheduleBooking?.service_title}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <div>
              <p className="mb-3 font-body text-xs uppercase tracking-wider text-muted-foreground">Select Date</p>
              <div className="grid grid-cols-4 gap-2">
                {generateDates().map((date) => {
                  const day = new Date(date);
                  return (
                    <button
                      key={date}
                      type="button"
                      onClick={() => setRescheduleDate(date)}
                      className={`rounded-xl p-2 text-center font-body text-sm transition-colors ${
                        rescheduleDate === date ? "bg-gradient-gold text-primary-foreground" : "bg-muted/40 text-foreground hover:bg-primary/10"
                      }`}
                    >
                      <div className="text-[10px] uppercase">{day.toLocaleDateString("en", { weekday: "short" })}</div>
                      <div className="font-semibold">{day.getDate()}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="mb-3 font-body text-xs uppercase tracking-wider text-muted-foreground">Select Time</p>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setRescheduleTime(slot)}
                    className={`rounded-xl px-3 py-3 font-body text-sm transition-colors ${
                      rescheduleTime === slot ? "bg-gradient-gold text-primary-foreground" : "bg-muted/40 text-foreground hover:bg-primary/10"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <button
              type="button"
              onClick={() => setRescheduleBooking(null)}
              className="rounded-full border border-border/50 px-5 py-2.5 font-body text-xs uppercase tracking-[0.15em] text-foreground"
            >
              Close
            </button>
            <button
              type="button"
              disabled={!rescheduleDate || !rescheduleTime || savingBookingId === rescheduleBooking?.id}
              onClick={() => void handleReschedule()}
              className="rounded-full bg-gradient-gold px-5 py-2.5 font-body text-xs uppercase tracking-[0.15em] text-primary-foreground disabled:opacity-50"
            >
              {savingBookingId === rescheduleBooking?.id ? "Saving..." : "Save Changes"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserDashboard;
