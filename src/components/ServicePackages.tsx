import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, Sparkles, Crown, Gift } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const packages = [
  {
    name: "Serenity",
    price: "$199",
    original: "$280",
    icon: Sparkles,
    features: ["60-min Relaxation Massage", "Express Facial", "Aromatherapy Add-on", "Herbal Tea Service"],
    popular: false,
  },
  {
    name: "Radiance",
    price: "$349",
    original: "$450",
    icon: Crown,
    features: ["90-min Signature Massage", "Radiance Facial", "Luxury Hair Treatment", "Nail Polish Change", "Complimentary Champagne"],
    popular: true,
  },
  {
    name: "Royal",
    price: "$549",
    original: "$720",
    icon: Gift,
    features: ["Full Day Spa Access", "120-min Custom Massage", "Premium Facial", "Hair Styling", "Artisan Nail Design", "Gourmet Lunch"],
    popular: false,
  },
];

const ServicePackages = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".pkg-heading", {
        y: 60, opacity: 0, duration: 1,
        scrollTrigger: { trigger: ".pkg-heading", start: "top 85%" },
      });
      gsap.utils.toArray<HTMLElement>(".pkg-card").forEach((card, i) => {
        gsap.from(card, {
          y: 80, opacity: 0, scale: 0.95, duration: 0.8, delay: i * 0.15,
          scrollTrigger: { trigger: card, start: "top 90%" },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 md:py-32 relative">
      <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-gold-glow/10 blur-3xl floating-blob pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="pkg-heading text-center mb-16">
          <span className="font-body text-xs tracking-[0.3em] uppercase text-primary/60 block mb-4">Special Offers</span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground">
            Spa <span className="italic font-normal text-gradient-gold">Packages</span>
          </h2>
          <p className="font-body text-muted-foreground max-w-lg mx-auto mt-4">
            Save more with our curated bundles designed for the ultimate pampering experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {packages.map((pkg) => {
            const Icon = pkg.icon;
            return (
              <div
                key={pkg.name}
                className={`pkg-card group relative bg-card/80 backdrop-blur-xl rounded-3xl border transition-all duration-500 hover:shadow-luxury hover:-translate-y-2 ${
                  pkg.popular ? "border-primary shadow-luxury scale-105" : "border-border/50"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-gold text-primary-foreground text-xs font-body tracking-[0.2em] uppercase rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="p-8 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Icon size={20} className="text-primary" />
                    </div>
                    <h3 className="font-display text-2xl font-semibold text-foreground">{pkg.name}</h3>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-4xl font-semibold text-foreground">{pkg.price}</span>
                    <span className="font-body text-sm text-muted-foreground line-through">{pkg.original}</span>
                  </div>

                  <div className="space-y-3">
                    {pkg.features.map((f) => (
                      <div key={f} className="flex items-center gap-3 font-body text-sm text-foreground/80">
                        <Check size={14} className="text-primary flex-shrink-0" />
                        {f}
                      </div>
                    ))}
                  </div>

                  <a
                    href="#book"
                    className={`block text-center py-3 rounded-full font-body text-sm tracking-[0.15em] uppercase transition-all duration-300 hover:scale-105 ${
                      pkg.popular
                        ? "bg-gradient-gold text-primary-foreground hover:glow-gold"
                        : "border border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    }`}
                  >
                    Book Package
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicePackages;
