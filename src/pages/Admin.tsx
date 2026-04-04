import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar, Users, Scissors, Gift, BarChart3, TrendingUp, DollarSign, Clock,
  Search, Bell, Settings, LogOut, ChevronDown, Eye, Plus, Percent, Tag,
  UserPlus, Mail, Phone, MoreHorizontal, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import Navbar from "@/components/Navbar";
import logoImg from "@/assets/logo.svg";

const stats = [
  { label: "Today's Bookings", value: "12", change: "+3", trend: "up", icon: Calendar },
  { label: "Active Clients", value: "1,247", change: "+48", trend: "up", icon: Users },
  { label: "Revenue (Month)", value: "$34,520", change: "+12%", trend: "up", icon: DollarSign },
  { label: "Avg. Rating", value: "4.9", change: "+0.1", trend: "up", icon: TrendingUp },
];

const appointments = [
  { client: "Sarah Johnson", service: "Signature Massage", stylist: "Sofia Laurent", time: "9:00 AM", status: "Confirmed" },
  { client: "Emily Davis", service: "Radiance Facial", stylist: "Elena Martinez", time: "10:30 AM", status: "In Progress" },
  { client: "Rachel Kim", service: "Hair Styling", stylist: "James Chen", time: "12:00 PM", status: "Pending" },
  { client: "Maria Santos", service: "Nail Design", stylist: "Aria Thompson", time: "1:30 PM", status: "Confirmed" },
  { client: "Lisa Wang", service: "Deep Tissue Massage", stylist: "Sofia Laurent", time: "3:00 PM", status: "Confirmed" },
];

const clients = [
  { name: "Sarah Johnson", email: "sarah@email.com", phone: "+1 555-0123", visits: 12, lastVisit: "Mar 28", spending: "$2,160" },
  { name: "Emily Davis", email: "emily@email.com", phone: "+1 555-0456", visits: 8, lastVisit: "Mar 25", spending: "$1,440" },
  { name: "Rachel Kim", email: "rachel@email.com", phone: "+1 555-0789", visits: 15, lastVisit: "Mar 30", spending: "$2,850" },
  { name: "Maria Santos", email: "maria@email.com", phone: "+1 555-0321", visits: 6, lastVisit: "Mar 22", spending: "$960" },
];

const offers = [
  { name: "Spring Glow Package", type: "Package", discount: "25%", validUntil: "Apr 30", status: "Active", uses: 45 },
  { name: "First Visit Welcome", type: "Coupon", discount: "15%", validUntil: "Ongoing", status: "Active", uses: 128 },
  { name: "Couples Retreat", type: "Package", discount: "$50 off", validUntil: "May 15", status: "Active", uses: 22 },
  { name: "Birthday Special", type: "Coupon", discount: "20%", validUntil: "Ongoing", status: "Active", uses: 67 },
];

const revenueData = [
  { month: "Oct", value: 28000 },
  { month: "Nov", value: 31000 },
  { month: "Dec", value: 35000 },
  { month: "Jan", value: 29000 },
  { month: "Feb", value: 32000 },
  { month: "Mar", value: 34520 },
];

const tabs = [
  { label: "Appointments", icon: Calendar },
  { label: "Clients", icon: Users },
  { label: "Services", icon: Scissors },
  { label: "Offers", icon: Gift },
  { label: "Analytics", icon: BarChart3 },
];

const Admin = () => {
  const [activeTab, setActiveTab] = useState("Appointments");

  const maxRevenue = Math.max(...revenueData.map(d => d.value));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-12">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground">Admin Dashboard</h1>
              <p className="font-body text-sm text-muted-foreground">Manage your spa operations</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-border/50 text-foreground/70 hover:text-foreground hover:border-primary/50 transition-all font-body text-xs tracking-wider"
              >
                <Eye size={14} /> View Site
              </Link>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-destructive/30 text-destructive hover:bg-destructive/10 transition-all font-body text-xs tracking-wider">
                <LogOut size={14} /> Log Out
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map(({ label, value, change, trend, icon: Icon }) => (
              <div key={label} className="bg-card/80 backdrop-blur-xl rounded-2xl p-5 border border-border/50 hover:shadow-luxury transition-shadow duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <span className="font-body text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    {trend === "up" ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                    {change}
                  </span>
                </div>
                <p className="font-display text-2xl font-semibold text-foreground">{value}</p>
                <p className="font-body text-xs text-muted-foreground mt-1">{label}</p>
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

          {/* Tab Content */}
          <div className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 overflow-hidden">
            {/* Appointments */}
            {activeTab === "Appointments" && (
              <div>
                <div className="flex items-center justify-between p-5 border-b border-border/50">
                  <h2 className="font-display text-lg font-semibold text-foreground">Today's Appointments</h2>
                  <button className="px-4 py-2 bg-gradient-gold text-primary-foreground font-body text-xs tracking-wider uppercase rounded-full hover:glow-gold transition-all duration-300 flex items-center gap-1.5">
                    <Plus size={12} /> New Booking
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/50">
                        {["Client", "Service", "Stylist", "Time", "Status", ""].map(h => (
                          <th key={h} className="text-left px-5 py-3 font-body text-xs tracking-wider uppercase text-muted-foreground">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((a, i) => (
                        <tr key={i} className="border-b border-border/30 hover:bg-primary/5 transition-colors">
                          <td className="px-5 py-4 font-body text-sm text-foreground font-medium">{a.client}</td>
                          <td className="px-5 py-4 font-body text-sm text-muted-foreground">{a.service}</td>
                          <td className="px-5 py-4 font-body text-sm text-muted-foreground">{a.stylist}</td>
                          <td className="px-5 py-4 font-body text-sm text-foreground flex items-center gap-1"><Clock size={12} /> {a.time}</td>
                          <td className="px-5 py-4">
                            <span className={`px-3 py-1 rounded-full font-body text-xs ${
                              a.status === "Confirmed" ? "bg-green-50 text-green-700" :
                              a.status === "In Progress" ? "bg-primary/10 text-primary" :
                              "bg-yellow-50 text-yellow-700"
                            }`}>{a.status}</span>
                          </td>
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

            {/* Clients */}
            {activeTab === "Clients" && (
              <div>
                <div className="flex items-center justify-between p-5 border-b border-border/50">
                  <h2 className="font-display text-lg font-semibold text-foreground">Client Management</h2>
                  <button className="px-4 py-2 bg-gradient-gold text-primary-foreground font-body text-xs tracking-wider uppercase rounded-full hover:glow-gold transition-all duration-300 flex items-center gap-1.5">
                    <UserPlus size={12} /> Add Client
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/50">
                        {["Client", "Contact", "Visits", "Last Visit", "Total Spent", ""].map(h => (
                          <th key={h} className="text-left px-5 py-3 font-body text-xs tracking-wider uppercase text-muted-foreground">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {clients.map((c, i) => (
                        <tr key={i} className="border-b border-border/30 hover:bg-primary/5 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-gold flex items-center justify-center text-primary-foreground font-body text-xs font-bold">
                                {c.name.charAt(0)}
                              </div>
                              <span className="font-body text-sm text-foreground font-medium">{c.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex flex-col gap-0.5">
                              <span className="font-body text-xs text-muted-foreground flex items-center gap-1"><Mail size={10} /> {c.email}</span>
                              <span className="font-body text-xs text-muted-foreground flex items-center gap-1"><Phone size={10} /> {c.phone}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4 font-body text-sm text-foreground">{c.visits}</td>
                          <td className="px-5 py-4 font-body text-sm text-muted-foreground">{c.lastVisit}</td>
                          <td className="px-5 py-4 font-body text-sm font-medium text-foreground">{c.spending}</td>
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

            {/* Services */}
            {activeTab === "Services" && (
              <div>
                <div className="flex items-center justify-between p-5 border-b border-border/50">
                  <h2 className="font-display text-lg font-semibold text-foreground">Service Management</h2>
                  <button className="px-4 py-2 bg-gradient-gold text-primary-foreground font-body text-xs tracking-wider uppercase rounded-full hover:glow-gold transition-all duration-300 flex items-center gap-1.5">
                    <Plus size={12} /> Add Service
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5">
                  {[
                    { name: "Signature Massage", category: "Body", price: "$180", duration: "90 min", bookings: 45 },
                    { name: "Radiance Facial", category: "Skin", price: "$150", duration: "75 min", bookings: 38 },
                    { name: "Luxury Hair Styling", category: "Hair", price: "$220", duration: "120 min", bookings: 32 },
                    { name: "Artisan Nail Design", category: "Nails", price: "$95", duration: "60 min", bookings: 28 },
                  ].map((s, i) => (
                    <div key={i} className="p-4 rounded-xl border border-border/50 hover:shadow-luxury transition-all duration-300 group">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-body text-[10px] tracking-[0.2em] uppercase text-primary/60">{s.category}</span>
                          <h3 className="font-display text-base font-semibold text-foreground">{s.name}</h3>
                        </div>
                        <button className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors opacity-0 group-hover:opacity-100">
                          <MoreHorizontal size={14} className="text-muted-foreground" />
                        </button>
                      </div>
                      <div className="flex items-center gap-4 mt-3 font-body text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><DollarSign size={12} /> {s.price}</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {s.duration}</span>
                        <span className="flex items-center gap-1"><Calendar size={12} /> {s.bookings} bookings</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Offers */}
            {activeTab === "Offers" && (
              <div>
                <div className="flex items-center justify-between p-5 border-b border-border/50">
                  <h2 className="font-display text-lg font-semibold text-foreground">Offers & Coupons</h2>
                  <button className="px-4 py-2 bg-gradient-gold text-primary-foreground font-body text-xs tracking-wider uppercase rounded-full hover:glow-gold transition-all duration-300 flex items-center gap-1.5">
                    <Plus size={12} /> Create Offer
                  </button>
                </div>
                <div className="divide-y divide-border/30">
                  {offers.map((o, i) => (
                    <div key={i} className="p-5 hover:bg-primary/5 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            o.type === "Package" ? "bg-primary/10" : "bg-accent/30"
                          }`}>
                            {o.type === "Package" ? <Gift size={16} className="text-primary" /> : <Percent size={16} className="text-accent-foreground" />}
                          </div>
                          <div>
                            <h3 className="font-body text-sm font-medium text-foreground">{o.name}</h3>
                            <div className="flex items-center gap-3 mt-0.5">
                              <span className="font-body text-xs text-muted-foreground flex items-center gap-1">
                                <Tag size={10} /> {o.type}
                              </span>
                              <span className="font-body text-xs text-primary font-medium">{o.discount}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-body text-xs text-muted-foreground">Valid: {o.validUntil}</span>
                          <span className="font-body text-xs text-muted-foreground">{o.uses} uses</span>
                          <span className="px-3 py-1 rounded-full font-body text-xs bg-green-50 text-green-700">{o.status}</span>
                          <button className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors">
                            <MoreHorizontal size={14} className="text-muted-foreground" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Analytics */}
            {activeTab === "Analytics" && (
              <div className="p-5">
                <h2 className="font-display text-lg font-semibold text-foreground mb-6">Revenue Overview</h2>
                <div className="h-64 flex items-end gap-4">
                  {revenueData.map((d) => (
                    <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                      <span className="font-body text-xs text-muted-foreground">${(d.value / 1000).toFixed(0)}k</span>
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
                    { label: "Top Service", value: "Signature Massage", sub: "45 bookings this month" },
                    { label: "Best Stylist", value: "Sofia Laurent", sub: "4.95 avg rating" },
                    { label: "Peak Hours", value: "10AM - 2PM", sub: "68% of bookings" },
                  ].map((item, i) => (
                    <div key={i} className="p-4 rounded-xl border border-border/50 bg-muted/30">
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
