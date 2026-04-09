import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { User, ShieldCheck, Mail, Lock, ArrowRight, AtSign } from "lucide-react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import logoImg from "@/assets/logo.svg";
import { useAuth } from "@/lib/auth";
import { formatApiError } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, logout, isAuthenticated, isAdmin, isLoading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"user" | "admin">("user");
  const [identifier, setIdentifier] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;

  useEffect(() => {
    if (from === "/admin") {
      setSelectedRole("admin");
    }

    if (!isLoading && isAuthenticated) {
      navigate(from || (isAdmin ? "/admin" : "/dashboard"), { replace: true });
    }
  }, [from, isAdmin, isAuthenticated, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    try {
      const session = isSignUp
        ? await register({ username, email, password, full_name: name })
        : await login(identifier, password);

      if (!isSignUp && selectedRole === "admin" && !session.roles.includes("admin")) {
        logout();
        throw new Error(JSON.stringify({ detail: "This account does not have admin access." }));
      }

      const destination = isSignUp
        ? "/dashboard"
        : from || (selectedRole === "admin" ? "/admin" : "/dashboard");

      toast({
        title: isSignUp ? "Account created" : "Welcome back",
        description: isSignUp
          ? "Your account is ready to use."
          : selectedRole === "admin"
            ? "You are now signed in as admin."
            : "You are now signed in.",
      });
      navigate(destination, { replace: true });
    } catch (error) {
      const message = formatApiError(error);
      setErrorMessage(message);
      toast({
        title: "Unable to continue",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <div className="min-h-screen flex items-center justify-center px-6 pt-24 pb-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img src={logoImg} alt="Aurelia" className="h-16 w-16 mx-auto mb-4 object-contain" width={64} height={64} />
            <h1 className="font-display text-3xl font-semibold text-foreground mb-2">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="font-body text-sm text-muted-foreground">
              {isSignUp ? "Join our luxury experience" : "Sign in to manage your appointments"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-card/80 backdrop-blur-xl rounded-2xl p-8 border border-border/50 shadow-luxury space-y-5">
            {!isSignUp && (
              <div className="space-y-3">
                <label className="font-body text-xs tracking-wider uppercase text-muted-foreground block">Login Role</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedRole("user")}
                    className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                      selectedRole === "user"
                        ? "border-primary bg-primary/10"
                        : "border-border/50 bg-background"
                    }`}
                  >
                    <span className="flex items-center gap-2 font-body text-sm text-foreground">
                      <User size={16} className="text-primary" />
                      User
                    </span>
                    <span className="mt-1 block font-body text-xs text-muted-foreground">Bookings and personal dashboard</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole("admin")}
                    className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                      selectedRole === "admin"
                        ? "border-primary bg-primary/10"
                        : "border-border/50 bg-background"
                    }`}
                  >
                    <span className="flex items-center gap-2 font-body text-sm text-foreground">
                      <ShieldCheck size={16} className="text-primary" />
                      Admin
                    </span>
                    <span className="mt-1 block font-body text-xs text-muted-foreground">Operations dashboard and inbox</span>
                  </button>
                </div>
              </div>
            )}
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
                    required={isSignUp}
                  />
                </div>
              </div>
            )}
            {isSignUp && (
              <div>
                <label className="font-body text-xs tracking-wider uppercase text-muted-foreground block mb-2">Username</label>
                <div className="relative">
                  <AtSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-border/50 font-body text-sm focus:outline-none focus:border-primary transition-colors"
                    placeholder="Choose a username"
                    required={isSignUp}
                  />
                </div>
              </div>
            )}
            {!isSignUp && (
              <div>
                <label className="font-body text-xs tracking-wider uppercase text-muted-foreground block mb-2">Username Or Email</label>
                <div className="relative">
                  <AtSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-border/50 font-body text-sm focus:outline-none focus:border-primary transition-colors"
                    placeholder="Enter username or email"
                    required={!isSignUp}
                  />
                </div>
              </div>
            )}
            {isSignUp && (
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
                    required={isSignUp}
                  />
                </div>
              </div>
            )}
            <div>
              <label className="font-body text-xs tracking-wider uppercase text-muted-foreground block mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-border/50 font-body text-sm focus:outline-none focus:border-primary transition-colors"
                  placeholder="Enter your password"
                  minLength={6}
                  required
                />
              </div>
            </div>

            {errorMessage && (
              <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 font-body text-sm text-destructive">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-gradient-gold text-primary-foreground font-body text-sm tracking-[0.15em] uppercase rounded-xl hover:glow-gold transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {submitting ? "Please wait" : isSignUp ? "Create Account" : `Sign In As ${selectedRole === "admin" ? "Admin" : "User"}`}
              <ArrowRight size={16} />
            </button>
          </form>

          <p className="text-center mt-6 font-body text-sm text-muted-foreground">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-primary hover:underline font-medium" type="button">
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
