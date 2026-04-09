import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, ChevronRight, ChevronLeft, Calendar, User, Sparkles } from "lucide-react";
import { apiClient, formatApiError, type Service } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { formatInrAmount } from "@/lib/currency";
import { toast } from "@/components/ui/use-toast";
import { defaultServices } from "@/lib/servicePresentation";

gsap.registerPlugin(ScrollTrigger);

const stylistOptions = ["Sofia Laurent", "Elena Martinez", "James Chen", "Aria Thompson"];
const timeSlots = ["9:00 AM", "10:30 AM", "12:00 PM", "1:30 PM", "3:00 PM", "4:30 PM"];
const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

type RazorpaySuccessPayload = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
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
  modal?: {
    ondismiss?: () => void;
  };
  handler: (response: RazorpaySuccessPayload) => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void };
  }
}

const BookingSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [step, setStep] = useState(0);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [stylist, setStylist] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const selectedService = useMemo(
    () => services.find(service => service.id === selectedServiceId) ?? null,
    [selectedServiceId, services]
  );

  const steps = ["Service", "Stylist", "Date & Time", "Confirm"];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".booking-heading", {
        y: 60, opacity: 0, duration: 1,
        scrollTrigger: { trigger: ".booking-heading", start: "top 85%" },
      });
      gsap.from(".booking-card", {
        y: 80, opacity: 0, scale: 0.95, duration: 1,
        scrollTrigger: { trigger: ".booking-card", start: "top 85%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    void (async () => {
      try {
        setLoadingServices(true);
        const backendServices = await apiClient.getServices();
        setServices(backendServices.length > 0 ? backendServices : defaultServices);
      } catch (error) {
        setServices(defaultServices);
        toast({
          title: "Using curated service list",
          description: formatApiError(error),
        });
      } finally {
        setLoadingServices(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      gsap.from(contentRef.current.children, {
        y: 20, opacity: 0, duration: 0.4, stagger: 0.05, ease: "power2.out",
      });
    }
  }, [step]);

  const nextStep = () => step < 3 && setStep(step + 1);
  const prevStep = () => step > 0 && setStep(step - 1);

  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push(d.toISOString().split("T")[0]);
    }
    return dates;
  };

  const resetBooking = () => {
    setStep(0);
    setSelectedServiceId(null);
    setStylist("");
    setDate("");
    setTime("");
    setNotes("");
  };

  const ensureRazorpayLoaded = async () => {
    if (window.Razorpay) {
      return true;
    }

    await new Promise<void>((resolve, reject) => {
      const existingScript = document.querySelector(`script[src="${RAZORPAY_SCRIPT_URL}"]`) as HTMLScriptElement | null;
      if (existingScript) {
        existingScript.addEventListener("load", () => resolve(), { once: true });
        existingScript.addEventListener("error", () => reject(new Error("Unable to load Razorpay checkout.")), { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = RAZORPAY_SCRIPT_URL;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Unable to load Razorpay checkout."));
      document.body.appendChild(script);
    });

    return Boolean(window.Razorpay);
  };

  const handleConfirm = async () => {
    if (!selectedService) return;

    setSubmitting(true);
    try {
      const checkout = await apiClient.createBookingCheckout({
        service: selectedService.id,
        stylist_name: stylist,
        booking_date: date,
        booking_time: time,
        notes,
      });

      const loaded = await ensureRazorpayLoaded();
      if (!loaded || !window.Razorpay) {
        throw new Error("Unable to load Razorpay checkout.");
      }

      const razorpay = new window.Razorpay({
        ...checkout,
        modal: {
          ondismiss: () => {
            setSubmitting(false);
            navigate("/booking/cancel");
          },
        },
        handler: async (response) => {
          try {
            const result = await apiClient.verifyBookingCheckout(response);
            if (!result.booking) {
              throw new Error(JSON.stringify({ detail: "Payment was received, but booking confirmation is still pending." }));
            }

            sessionStorage.setItem("latest_booking_success", JSON.stringify(result.booking));
            resetBooking();
            navigate("/booking/success");
            toast({
              title: "Payment received",
              description: "Your booking is now in your dashboard and awaiting confirmation.",
            });
          } catch (error) {
            toast({
              title: "Payment verification failed",
              description: formatApiError(error),
              variant: "destructive",
            });
          } finally {
            setSubmitting(false);
          }
        },
      });

      razorpay.open();
    } catch (error) {
      toast({
        title: "Unable to start checkout",
        description: formatApiError(error),
        variant: "destructive",
      });
      setSubmitting(false);
    }
  };

  return (
    <section ref={sectionRef} id="book" className="py-20 md:py-32 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blush/15 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="booking-heading text-center mb-16">
          <span className="font-body text-xs tracking-[0.3em] uppercase text-primary/60 block mb-4">Reserve Your Moment</span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground">
            Book Your <span className="italic font-normal text-gradient-gold">Experience</span>
          </h2>
        </div>

        {!isAuthenticated ? (
          <div className="booking-card mx-auto max-w-2xl rounded-3xl border border-border/50 bg-card/80 p-10 text-center shadow-luxury backdrop-blur-xl">
            <p className="font-body text-xs uppercase tracking-[0.3em] text-primary/60">Members Only Booking</p>
            <h3 className="mt-4 font-display text-3xl text-foreground">Sign in to reserve an appointment</h3>
            <p className="mx-auto mt-4 max-w-xl font-body text-sm text-muted-foreground">
              Booking is available only for signed-in members. Create your account first, then you can reserve treatments, manage appointments, and update your profile like a professional client portal.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/login" state={{ from: { pathname: "/dashboard" } }} className="rounded-full bg-gradient-gold px-8 py-3 font-body text-sm uppercase tracking-[0.15em] text-primary-foreground">
                Sign In
              </Link>
              <Link to="/login" className="rounded-full border border-primary px-8 py-3 font-body text-sm uppercase tracking-[0.15em] text-primary">
                Create Account
              </Link>
            </div>
          </div>
        ) : (
          <div className="booking-card max-w-2xl mx-auto bg-card/80 backdrop-blur-xl rounded-3xl shadow-luxury overflow-hidden border border-border/50">
            <div className="flex items-center justify-between px-8 py-6 border-b border-border/50">
              {steps.map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-body transition-all duration-500 ${
                    i < step ? "bg-gradient-gold text-primary-foreground" :
                    i === step ? "bg-primary text-primary-foreground scale-110" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {i < step ? <Check size={14} /> : i + 1}
                  </div>
                  <span className="hidden md:block text-xs font-body tracking-wider uppercase text-muted-foreground">{s}</span>
                  {i < steps.length - 1 && <ChevronRight size={14} className="text-border mx-2 hidden md:block" />}
                </div>
              ))}
            </div>

            <div ref={contentRef} className="p-8 min-h-[300px]">
              {step === 0 && (
                <div className="space-y-3">
                  <p className="font-display text-xl text-foreground mb-6">Choose your treatment</p>
                  {loadingServices && <p className="font-body text-sm text-muted-foreground">Loading services from the spa database...</p>}
                  {!loadingServices && services.length === 0 && (
                    <p className="font-body text-sm text-muted-foreground">No services are available yet. Add a few in the backend admin and they will appear here.</p>
                  )}
                  {services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => { setSelectedServiceId(service.id); nextStep(); }}
                      className={`w-full text-left p-4 rounded-xl border transition-all duration-300 font-body flex items-center justify-between group hover:border-primary hover:glow-soft ${
                        selectedServiceId === service.id ? "border-primary bg-primary/5" : "border-border"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Sparkles size={16} className="text-primary" />
                        <span>
                          <span className="block text-foreground">{service.title}</span>
                          <span className="block text-xs text-muted-foreground">{service.category} - {service.duration} - {formatInrAmount(service.price)}</span>
                        </span>
                      </span>
                      <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    </button>
                  ))}
                </div>
              )}

              {step === 1 && (
                <div className="space-y-3">
                  <p className="font-display text-xl text-foreground mb-6">Select your stylist</p>
                  {stylistOptions.map((s) => (
                    <button
                      key={s}
                      onClick={() => { setStylist(s); nextStep(); }}
                      className={`w-full text-left p-4 rounded-xl border transition-all duration-300 font-body flex items-center justify-between group hover:border-primary hover:glow-soft ${
                        stylist === s ? "border-primary bg-primary/5" : "border-border"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <User size={16} className="text-primary" />
                        {s}
                      </span>
                      <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    </button>
                  ))}
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <p className="font-display text-xl text-foreground">Pick a date & time</p>
                  <div>
                    <p className="font-body text-sm text-muted-foreground mb-3 flex items-center gap-2"><Calendar size={14} /> Available dates</p>
                    <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                      {generateDates().map((d) => {
                        const day = new Date(d);
                        return (
                          <button
                            key={d}
                            onClick={() => setDate(d)}
                            className={`p-2 rounded-xl text-center transition-all duration-300 font-body text-sm hover:glow-soft ${
                              date === d ? "bg-gradient-gold text-primary-foreground" : "bg-muted/50 text-foreground hover:bg-primary/10"
                            }`}
                          >
                            <div className="text-[10px] uppercase">{day.toLocaleDateString("en", { weekday: "short" })}</div>
                            <div className="font-semibold">{day.getDate()}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {date && (
                    <div>
                      <p className="font-body text-sm text-muted-foreground mb-3">Available times</p>
                      <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map((t) => (
                          <button
                            key={t}
                            onClick={() => { setTime(t); nextStep(); }}
                            className={`p-3 rounded-xl text-center transition-all duration-300 font-body text-sm hover:glow-soft ${
                              time === t ? "bg-gradient-gold text-primary-foreground" : "bg-muted/50 text-foreground hover:bg-primary/10"
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {step === 3 && selectedService && (
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-gold mx-auto flex items-center justify-center">
                    <Check size={28} className="text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-2xl text-foreground">Confirm Your Booking</h3>
                  <div className="bg-muted/30 rounded-2xl p-6 space-y-3 text-left font-body text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Service</span><span className="text-foreground font-medium">{selectedService.title}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Stylist</span><span className="text-foreground font-medium">{stylist}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="text-foreground font-medium">{new Date(date).toLocaleDateString("en", { month: "long", day: "numeric", year: "numeric" })}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span className="text-foreground font-medium">{time}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Payment</span><span className="text-foreground font-medium">Secure online checkout</span></div>
                  </div>
                  <textarea
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    rows={3}
                    maxLength={500}
                    placeholder="Notes for your appointment (optional)"
                    className="w-full rounded-2xl border border-border/50 bg-background px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  />
                  <button
                    onClick={handleConfirm}
                    disabled={submitting}
                    className="px-10 py-4 bg-gradient-gold text-primary-foreground font-body text-sm tracking-[0.15em] uppercase rounded-full hover:glow-gold hover:scale-105 transition-all duration-300 disabled:opacity-50"
                  >
                    {submitting ? "Opening Checkout..." : "Proceed To Payment"}
                  </button>
                </div>
              )}
            </div>

            {step > 0 && step < 3 && (
              <div className="px-8 pb-6">
                <button onClick={prevStep} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-body text-sm">
                  <ChevronLeft size={16} /> Back
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default BookingSection;
