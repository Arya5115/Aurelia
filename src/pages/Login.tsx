import { useState } from "react";
import { Link } from "react-router-dom";
import { User, ShieldCheck, Mail, Lock, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import logoImg from "@/assets/logo.svg";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder - would integrate with auth
  };

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <div className="min-h-screen flex items-center justify-center px-6 pt-24 pb-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <img src={logoImg} alt="Aurelia" className="h-16 w-16 mx-auto mb-4 object-contain" width={64} height={64} />
            <h1 className="font-display text-3xl font-semibold text-foreground mb-2">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="font-body text-sm text-muted-foreground">
              {isSignUp ? "Join our luxury experience" : "Sign in to manage your appointments"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-card/80 backdrop-blur-xl rounded-2xl p-8 border border-border/50 shadow-luxury space-y-5">
            {isSignUp && (
              <div>
                <label className="font-body text-xs tracking-wider uppercase text-muted-foreground block mb-2">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-border/50 font-body text-sm focus:outline-none focus:border-primary transition-colors"
                    placeholder="Your name"
                  />
                </div>
              </div>
            )}
            <div>
              <label className="font-body text-xs tracking-wider uppercase text-muted-foreground block mb-2">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-border/50 font-body text-sm focus:outline-none focus:border-primary transition-colors"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div>
              <label className="font-body text-xs tracking-wider uppercase text-muted-foreground block mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-border/50 font-body text-sm focus:outline-none focus:border-primary transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-gold text-primary-foreground font-body text-sm tracking-[0.15em] uppercase rounded-xl hover:glow-gold transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              {isSignUp ? "Create Account" : "Sign In"}
              <ArrowRight size={16} />
            </button>

            {/* Dashboard links */}
            <div className="pt-4 border-t border-border/50 space-y-3">
              <Link
                to="/dashboard"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <User size={16} className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-body text-sm font-medium text-foreground">User Dashboard</p>
                  <p className="font-body text-xs text-muted-foreground">Bookings, appointments & more</p>
                </div>
                <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
              <Link
                to="/admin"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-accent/30 flex items-center justify-center">
                  <ShieldCheck size={16} className="text-accent-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-body text-sm font-medium text-foreground">Admin Dashboard</p>
                  <p className="font-body text-xs text-muted-foreground">Manage clients, analytics & offers</p>
                </div>
                <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            </div>
          </form>

          <p className="text-center mt-6 font-body text-sm text-muted-foreground">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-primary hover:underline font-medium">
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
      <FooterSection />
    </div>
  );
};

export default Login;
