import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar, Bell, Clock, ChevronRight, Star, MapPin,
  User, LogOut, Home, History, CalendarDays, BellRing
} from "lucide-react";
import Navbar from "@/components/Navbar";
import logoImg from "@/assets/logo.svg";

const upcomingAppointments = [
  { id: 1, service: "Signature Massage", stylist: "Sofia Laurent", date: "Apr 8, 2026", time: "10:00 AM", status: "Confirmed", location: "Suite A" },
  { id: 2, service: "Radiance Facial", stylist: "Elena Martinez", date: "Apr 12, 2026", time: "2:30 PM", status: "Pending", location: "Suite B" },
  { id: 3, service: "Hair Styling", stylist: "James Chen", date: "Apr 18, 2026", time: "11:00 AM", status: "Confirmed", location: "Suite C" },
];

const bookingHistory = [
  { id: 1, service: "Deep Tissue Massage", date: "Mar 20, 2026", price: "$180", rating: 5 },
  { id: 2, service: "Luxury Manicure", date: "Mar 5, 2026", price: "$95", rating: 4 },
  { id: 3, service: "Aromatherapy Session", date: "Feb 18, 2026", price: "$150", rating: 5 },
  { id: 4, service: "Hair Color Treatment", date: "Feb 2, 2026", price: "$220", rating: 5 },
];

const notifications = [
  { id: 1, title: "Appointment Reminder", message: "Your Signature Massage is tomorrow at 10:00 AM", time: "1 hour ago", unread: true },
  { id: 2, title: "Special Offer", message: "20% off all facial treatments this weekend!", time: "3 hours ago", unread: true },
  { id: 3, title: "Booking Confirmed", message: "Your Hair Styling appointment has been confirmed", time: "Yesterday", unread: false },
  { id: 4, title: "New Service Available", message: "Try our new Crystal Healing therapy - Book now!", time: "2 days ago", unread: false },
];

const tabs = [
  { label: "Upcoming", icon: CalendarDays },
  { label: "History", icon: History },
  { label: "Notifications", icon: BellRing },
];

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("Upcoming");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-12">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-gold flex items-center justify-center">
                <User size={24} className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground">Welcome back, Sarah</h1>
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
                to="/"
                className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-border/50 text-foreground/70 hover:text-foreground hover:border-primary/50 transition-all font-body text-xs tracking-wider"
              >
                <Home size={14} /> Home
              </Link>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Upcoming", value: "3", icon: Calendar },
              { label: "This Month", value: "5", icon: CalendarDays },
              { label: "Total Visits", value: "27", icon: History },
              { label: "Notifications", value: "2", icon: Bell, highlight: true },
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

          {/* Tabs */}
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

          {/* Content */}
          <div className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 overflow-hidden">
            {activeTab === "Upcoming" && (
              <div>
                <div className="p-5 border-b border-border/50">
                  <h2 className="font-display text-lg font-semibold text-foreground">Upcoming Appointments</h2>
                </div>
                <div className="divide-y divide-border/30">
                  {upcomingAppointments.map((apt) => (
                    <div key={apt.id} className="p-5 hover:bg-primary/5 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="font-display text-base font-semibold text-foreground">{apt.service}</h3>
                          <div className="flex flex-wrap items-center gap-3 mt-1">
                            <span className="font-body text-sm text-muted-foreground flex items-center gap-1">
                              <User size={12} /> {apt.stylist}
                            </span>
                            <span className="font-body text-sm text-muted-foreground flex items-center gap-1">
                              <Calendar size={12} /> {apt.date}
                            </span>
                            <span className="font-body text-sm text-muted-foreground flex items-center gap-1">
                              <Clock size={12} /> {apt.time}
                            </span>
                            <span className="font-body text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin size={12} /> {apt.location}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full font-body text-xs ${
                            apt.status === "Confirmed" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
                          }`}>
                            {apt.status}
                          </span>
                          <button className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
                            <ChevronRight size={16} className="text-muted-foreground" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "History" && (
              <div>
                <div className="p-5 border-b border-border/50">
                  <h2 className="font-display text-lg font-semibold text-foreground">Booking History</h2>
                </div>
                <div className="divide-y divide-border/30">
                  {bookingHistory.map((booking) => (
                    <div key={booking.id} className="p-5 hover:bg-primary/5 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-display text-base font-semibold text-foreground">{booking.service}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="font-body text-sm text-muted-foreground">{booking.date}</span>
                            <span className="font-body text-sm font-medium text-foreground">{booking.price}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={14} className={i < booking.rating ? "text-primary fill-primary" : "text-border"} />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "Notifications" && (
              <div>
                <div className="p-5 border-b border-border/50 flex items-center justify-between">
                  <h2 className="font-display text-lg font-semibold text-foreground">Notifications</h2>
                  <button className="font-body text-xs text-primary hover:underline">Mark all read</button>
                </div>
                <div className="divide-y divide-border/30">
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
    </div>
  );
};

export default UserDashboard;
