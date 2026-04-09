import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Home, Save, User, CalendarDays, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/auth";
import { apiClient, formatApiError } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";

const Profile = () => {
  const { user, profile, isAdmin, refreshUser } = useAuth();
  const [form, setForm] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    avatar_url: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({
      username: user?.username ?? "",
      email: user?.email ?? "",
      first_name: user?.first_name ?? "",
      last_name: user?.last_name ?? "",
      phone: profile?.phone ?? "",
      avatar_url: profile?.avatar_url ?? "",
    });
  }, [profile?.avatar_url, profile?.phone, user?.email, user?.first_name, user?.last_name, user?.username]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await apiClient.updateMe(form);
      await refreshUser();
      toast({
        title: "Profile updated",
        description: "Your account details were saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Unable to save profile",
        description: formatApiError(error),
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const fullName = `${form.first_name} ${form.last_name}`.trim() || form.username || "Aurelia Guest";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="grid gap-8 lg:grid-cols-[320px,1fr]">
            <aside className="rounded-3xl border border-border/50 bg-card/80 p-6 shadow-luxury">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-gold text-primary-foreground">
                  <User size={34} />
                </div>
                <h1 className="font-display text-2xl text-foreground">{fullName}</h1>
                <p className="font-body text-sm text-muted-foreground">@{form.username}</p>
              </div>
              <div className="mt-6 space-y-3">
                <Link to="/dashboard" className="flex items-center gap-3 rounded-2xl border border-border/50 px-4 py-3 font-body text-sm text-foreground hover:border-primary/50 hover:text-primary">
                  <CalendarDays size={16} />
                  My Bookings
                </Link>
                <Link to="/profile" className="flex items-center gap-3 rounded-2xl border border-primary/40 bg-primary/10 px-4 py-3 font-body text-sm text-primary">
                  <User size={16} />
                  Manage Profile
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="flex items-center gap-3 rounded-2xl border border-border/50 px-4 py-3 font-body text-sm text-foreground hover:border-primary/50 hover:text-primary">
                    <ShieldCheck size={16} />
                    Admin Dashboard
                  </Link>
                )}
                <Link to="/" className="flex items-center gap-3 rounded-2xl border border-border/50 px-4 py-3 font-body text-sm text-foreground hover:border-primary/50 hover:text-primary">
                  <Home size={16} />
                  Back To Home
                </Link>
              </div>
            </aside>

            <section className="rounded-3xl border border-border/50 bg-card/80 p-8 shadow-luxury">
              <div className="mb-8">
                <p className="font-body text-xs uppercase tracking-[0.3em] text-primary/60">Account Settings</p>
                <h2 className="mt-2 font-display text-3xl text-foreground">Manage Your Profile</h2>
                <p className="mt-2 font-body text-sm text-muted-foreground">
                  Keep your booking details, contact info, and profile settings up to date.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block font-body text-xs uppercase tracking-wider text-muted-foreground">First Name</span>
                    <input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} className="w-full rounded-xl border border-border/50 bg-background px-4 py-3 font-body text-sm focus:border-primary focus:outline-none" />
                  </label>
                  <label className="block">
                    <span className="mb-2 block font-body text-xs uppercase tracking-wider text-muted-foreground">Last Name</span>
                    <input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} className="w-full rounded-xl border border-border/50 bg-background px-4 py-3 font-body text-sm focus:border-primary focus:outline-none" />
                  </label>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block font-body text-xs uppercase tracking-wider text-muted-foreground">Username</span>
                    <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="w-full rounded-xl border border-border/50 bg-background px-4 py-3 font-body text-sm focus:border-primary focus:outline-none" required />
                  </label>
                  <label className="block">
                    <span className="mb-2 block font-body text-xs uppercase tracking-wider text-muted-foreground">Email</span>
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border border-border/50 bg-background px-4 py-3 font-body text-sm focus:border-primary focus:outline-none" required />
                  </label>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block font-body text-xs uppercase tracking-wider text-muted-foreground">Phone</span>
                    <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-xl border border-border/50 bg-background px-4 py-3 font-body text-sm focus:border-primary focus:outline-none" />
                  </label>
                  <label className="block">
                    <span className="mb-2 block font-body text-xs uppercase tracking-wider text-muted-foreground">Avatar URL</span>
                    <input value={form.avatar_url} onChange={(e) => setForm({ ...form, avatar_url: e.target.value })} className="w-full rounded-xl border border-border/50 bg-background px-4 py-3 font-body text-sm focus:border-primary focus:outline-none" />
                  </label>
                </div>
                <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-6 py-3 font-body text-sm uppercase tracking-[0.15em] text-primary-foreground disabled:opacity-70">
                  <Save size={16} />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
