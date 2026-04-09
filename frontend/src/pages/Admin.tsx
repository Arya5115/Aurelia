import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar, Users, Scissors, Mail, BarChart3, TrendingUp, IndianRupee, Clock,
  Eye, Plus, ArrowUpRight, LogOut, CheckCircle2, PlayCircle, BadgeCheck, Ban, MoreHorizontal
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { apiClient, formatApiError, type Booking, type ContactMessage, type Service } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { formatInrAmount, formatInrCompact } from "@/lib/currency";
import { toast } from "@/components/ui/use-toast";

const tabs = [
  { label: "Appointments", icon: Calendar },
  { label: "Clients", icon: Users },
  { label: "Services", icon: Scissors },
  { label: "Messages", icon: Mail },
  { label: "Analytics", icon: BarChart3 },
];

const Admin = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState("Appointments");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingBookingId, setSavingBookingId] = useState<number | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const [nextBookings, nextServices, nextMessages] = await Promise.all([
          apiClient.getBookings(),
          apiClient.getServices(),
          apiClient.getContactMessages(),
        ]);
        setBookings(nextBookings);
        setServices(nextServices);
        setMessages(nextMessages);
      } catch (error) {
        toast({
          title: "Unable to load admin data",
          description: formatApiError(error),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const clients = useMemo(() => {
    const grouped = new Map<string, { name: string; email: string; visits: number; lastVisit: string; spending: number }>();

    bookings.forEach((booking) => {
      const email = booking.user_email || `user-${booking.user}@aurelia.local`;
      const existing = grouped.get(email);
      const nextName = booking.user_name || email;
      const estimatedSpend = Number(services.find(service => service.id === booking.service)?.price || 0);

      if (existing) {
        existing.visits += 1;
        existing.lastVisit = booking.booking_date > existing.lastVisit ? booking.booking_date : existing.lastVisit;
        existing.spending += estimatedSpend;
      } else {
        grouped.set(email, {
          name: nextName,
          email,
          visits: 1,
          lastVisit: booking.booking_date,
          spending: estimatedSpend,
        });
      }
    });

    return Array.from(grouped.values());
  }, [bookings, services]);

  const stats = [
    { label: "Today's Bookings", value: String(bookings.filter(booking => booking.booking_date === new Date().toISOString().split("T")[0]).length), change: `${bookings.length}`, icon: Calendar },
    { label: "Active Clients", value: String(clients.length), change: `${messages.length}`, icon: Users },
    { label: "Revenue Potential", value: formatInrAmount(bookings.reduce((sum, booking) => sum + Number(services.find(service => service.id === booking.service)?.price || 0), 0)), change: `${services.length} services`, icon: IndianRupee },
    { label: "Unread Messages", value: String(messages.length), change: "Inbox", icon: TrendingUp },
  ];

  const revenueData = useMemo(() => {
    const monthMap = new Map<string, number>();
    bookings.forEach((booking) => {
      const month = new Date(booking.booking_date).toLocaleDateString("en", { month: "short" });
      const amount = Number(services.find(service => service.id === booking.service)?.price || 0);
      monthMap.set(month, (monthMap.get(month) ?? 0) + amount);
    });
    return Array.from(monthMap.entries()).map(([month, value]) => ({ month, value }));
  }, [bookings, services]);

  const maxRevenue = Math.max(...revenueData.map(d => d.value), 1);

  const handleBookingStatusUpdate = async (booking: Booking, status: Booking["status"]) => {
    setSavingBookingId(booking.id);
    try {
      const updated = await apiClient.updateBooking(booking.id, { status });
      setBookings(current => current.map(item => (item.id === updated.id ? updated : item)));
      toast({
        title: "Booking updated",
        description: `${booking.service_title} is now ${status.replace("_", " ")}.`,
      });
    } catch (error) {
      toast({
        title: "Unable to update booking",
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
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground">Admin Dashboard</h1>
              <p className="font-body text-sm text-muted-foreground">Manage bookings, clients, services, and messages</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-border/50 text-foreground/70 hover:text-foreground hover:border-primary/50 transition-all font-body text-xs tracking-wider"
              >
                <Eye size={14} /> View Site
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map(({ label, value, change, icon: Icon }) => (
              <div key={label} className="bg-card/80 backdrop-blur-xl rounded-2xl p-5 border border-border/50 hover:shadow-luxury transition-shadow duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <span className="font-body text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    <ArrowUpRight size={10} />
                    {change}
                  </span>
                </div>
                <p className="font-display text-2xl font-semibold text-foreground">{value}</p>
                <p className="font-body text-xs text-muted-foreground mt-1">{label}</p>
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
              <div className="p-6">
                <p className="font-body text-sm text-muted-foreground">Loading admin data...</p>
              </div>
            )}

            {!loading && activeTab === "Appointments" && (
              <div>
                <div className="flex items-center justify-between p-5 border-b border-border/50">
                  <h2 className="font-display text-lg font-semibold text-foreground">Appointments</h2>
                  <Link to="/#book" className="px-4 py-2 bg-gradient-gold text-primary-foreground font-body text-xs tracking-wider uppercase rounded-full hover:glow-gold transition-all duration-300 flex items-center gap-1.5">
                    <Plus size={12} /> New Booking
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/50">
                        {["Client", "Service", "Stylist", "Time", "Status", "Payment", "Actions"].map(h => (
                          <th key={h} className="text-left px-5 py-3 font-body text-xs tracking-wider uppercase text-muted-foreground">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.length === 0 && (
                        <tr>
                          <td className="px-5 py-4 font-body text-sm text-muted-foreground" colSpan={7}>No bookings found yet.</td>
                        </tr>
                      )}
                      {bookings.map((a) => (
                        <tr key={a.id} className="border-b border-border/30 hover:bg-primary/5 transition-colors">
                          <td className="px-5 py-4 font-body text-sm text-foreground font-medium">{a.user_name || a.user_email || `User #${a.user}`}</td>
                          <td className="px-5 py-4 font-body text-sm text-muted-foreground">{a.service_title}</td>
                          <td className="px-5 py-4 font-body text-sm text-muted-foreground">{a.stylist_name || "Assigned soon"}</td>
                          <td className="px-5 py-4 font-body text-sm text-foreground flex items-center gap-1"><Clock size={12} /> {a.booking_date} {a.booking_time}</td>
                          <td className="px-5 py-4">
                            <span className={`px-3 py-1 rounded-full font-body text-xs ${
                              a.status === "confirmed" ? "bg-green-50 text-green-700" :
                              a.status === "in_progress" ? "bg-primary/10 text-primary" :
                              a.status === "completed" ? "bg-emerald-50 text-emerald-700" :
                              a.status === "cancelled" ? "bg-destructive/10 text-destructive" :
                              "bg-yellow-50 text-yellow-700"
                            }`}>{a.status.replace("_", " ")}</span>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`px-3 py-1 rounded-full font-body text-xs ${
                              a.payment_status === "paid"
                                ? "bg-emerald-50 text-emerald-700"
                                : a.payment_status === "refunded"
                                  ? "bg-slate-100 text-slate-700"
                                  : a.payment_status === "failed"
                                    ? "bg-destructive/10 text-destructive"
                                    : "bg-yellow-50 text-yellow-700"
                            }`}>
                              {a.payment_status}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex flex-wrap gap-2">
                              {a.status === "pending" && (
                                <button
                                  type="button"
                                  onClick={() => void handleBookingStatusUpdate(a, "confirmed")}
                                  disabled={savingBookingId === a.id}
                                  className="inline-flex items-center gap-1 rounded-full border border-border/50 px-3 py-1.5 font-body text-[11px] uppercase tracking-[0.15em] text-foreground hover:border-primary/50 hover:text-primary disabled:opacity-50"
                                >
                                  <CheckCircle2 size={12} />
                                  Confirm
                                </button>
                              )}
                              {a.status === "confirmed" && (
                                <button
                                  type="button"
                                  onClick={() => void handleBookingStatusUpdate(a, "in_progress")}
                                  disabled={savingBookingId === a.id}
                                  className="inline-flex items-center gap-1 rounded-full border border-border/50 px-3 py-1.5 font-body text-[11px] uppercase tracking-[0.15em] text-foreground hover:border-primary/50 hover:text-primary disabled:opacity-50"
                                >
                                  <PlayCircle size={12} />
                                  Start
                                </button>
                              )}
                              {a.status === "in_progress" && (
                                <button
                                  type="button"
                                  onClick={() => void handleBookingStatusUpdate(a, "completed")}
                                  disabled={savingBookingId === a.id}
                                  className="inline-flex items-center gap-1 rounded-full border border-border/50 px-3 py-1.5 font-body text-[11px] uppercase tracking-[0.15em] text-foreground hover:border-primary/50 hover:text-primary disabled:opacity-50"
                                >
                                  <BadgeCheck size={12} />
                                  Complete
                                </button>
                              )}
                              {a.status !== "cancelled" && a.status !== "completed" && (
                                <button
                                  type="button"
                                  onClick={() => void handleBookingStatusUpdate(a, "cancelled")}
                                  disabled={savingBookingId === a.id}
                                  className="inline-flex items-center gap-1 rounded-full border border-destructive/30 px-3 py-1.5 font-body text-[11px] uppercase tracking-[0.15em] text-destructive hover:bg-destructive/10 disabled:opacity-50"
                                >
                                  <Ban size={12} />
                                  Cancel
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {!loading && activeTab === "Clients" && (
              <div>
                <div className="flex items-center justify-between p-5 border-b border-border/50">
                  <h2 className="font-display text-lg font-semibold text-foreground">Client Management</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/50">
                        {["Client", "Email", "Visits", "Last Visit", "Estimated Spend", ""].map(h => (
                          <th key={h} className="text-left px-5 py-3 font-body text-xs tracking-wider uppercase text-muted-foreground">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {clients.length === 0 && (
                        <tr>
                          <td className="px-5 py-4 font-body text-sm text-muted-foreground" colSpan={6}>Clients will appear here once bookings exist.</td>
                        </tr>
                      )}
                      {clients.map((client) => (
                        <tr key={client.email} className="border-b border-border/30 hover:bg-primary/5 transition-colors">
                          <td className="px-5 py-4 font-body text-sm text-foreground font-medium">{client.name}</td>
                          <td className="px-5 py-4 font-body text-sm text-muted-foreground">{client.email}</td>
                          <td className="px-5 py-4 font-body text-sm text-foreground">{client.visits}</td>
                          <td className="px-5 py-4 font-body text-sm text-muted-foreground">{client.lastVisit}</td>
                          <td className="px-5 py-4 font-body text-sm font-medium text-foreground">{formatInrAmount(client.spending)}</td>
                          <td className="px-5 py-4">
                            <button className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors">
                              <MoreHorizontal size={14} className="text-muted-foreground" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {!loading && activeTab === "Services" && (
              <div>
                <div className="flex items-center justify-between p-5 border-b border-border/50">
                  <h2 className="font-display text-lg font-semibold text-foreground">Service Management</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5">
                  {services.length === 0 && (
                    <p className="font-body text-sm text-muted-foreground">Create services in the backend and they will appear here.</p>
                  )}
                  {services.map((service) => (
                    <div key={service.id} className="p-4 rounded-xl border border-border/50 hover:shadow-luxury transition-all duration-300 group">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-body text-[10px] tracking-[0.2em] uppercase text-primary/60">{service.category}</span>
                          <h3 className="font-display text-base font-semibold text-foreground">{service.title}</h3>
                        </div>
                        <button className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors opacity-0 group-hover:opacity-100">
                          <MoreHorizontal size={14} className="text-muted-foreground" />
                        </button>
                      </div>
                      <div className="flex items-center gap-4 mt-3 font-body text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><IndianRupee size={12} /> {formatInrAmount(service.price)}</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {service.duration || "Custom"}</span>
                        <span className="flex items-center gap-1"><Calendar size={12} /> {bookings.filter(booking => booking.service === service.id).length} bookings</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!loading && activeTab === "Messages" && (
              <div>
                <div className="flex items-center justify-between p-5 border-b border-border/50">
                  <h2 className="font-display text-lg font-semibold text-foreground">Contact Messages</h2>
                </div>
                <div className="divide-y divide-border/30">
                  {messages.length === 0 && (
                    <div className="p-5">
                      <p className="font-body text-sm text-muted-foreground">No contact messages yet.</p>
                    </div>
                  )}
                  {messages.map((message) => (
                    <div key={message.id} className="p-5 hover:bg-primary/5 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div>
                          <h3 className="font-body text-sm font-medium text-foreground">{message.name}</h3>
                          <p className="font-body text-xs text-muted-foreground">{message.email}{message.phone ? ` | ${message.phone}` : ""}</p>
                          <p className="font-body text-sm text-muted-foreground mt-2">{message.message}</p>
                        </div>
                        <span className="font-body text-xs text-muted-foreground">{new Date(message.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!loading && activeTab === "Analytics" && (
              <div className="p-5">
                <h2 className="font-display text-lg font-semibold text-foreground mb-6">Revenue Overview</h2>
                <div className="h-64 flex items-end gap-4">
                  {revenueData.length === 0 && <p className="font-body text-sm text-muted-foreground">Revenue charts will populate once bookings exist.</p>}
                  {revenueData.map((d) => (
                    <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                      <span className="font-body text-xs text-muted-foreground">{formatInrCompact(d.value)}</span>
                      <div
                        className="w-full bg-gradient-gold rounded-t-lg transition-all duration-500 hover:glow-gold"
                        style={{ height: `${(d.value / maxRevenue) * 100}%` }}
                      />
                      <span className="font-body text-xs text-muted-foreground">{d.month}</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  {[
                    { label: "Top Service", value: services[0]?.title || "No data yet", sub: `${services.length} active services` },
                    { label: "Total Messages", value: String(messages.length), sub: "Messages from the contact form" },
                    { label: "Client Base", value: String(clients.length), sub: "Unique clients with bookings" },
                  ].map((item) => (
                    <div key={item.label} className="p-4 rounded-xl border border-border/50 bg-muted/30">
                      <span className="font-body text-xs tracking-wider uppercase text-muted-foreground">{item.label}</span>
                      <p className="font-display text-lg font-semibold text-foreground mt-1">{item.value}</p>
                      <p className="font-body text-xs text-muted-foreground mt-0.5">{item.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
