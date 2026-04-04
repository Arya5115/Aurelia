import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Instagram, Star } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const stylists = [
  {
    name: "Sofia Laurent",
    role: "Lead Massage Therapist",
    image: "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 4.9,
    specialties: ["Hot Stone", "Deep Tissue", "Aromatherapy"],
    bio: "15 years of experience in therapeutic massage techniques from around the world.",
  },
  {
    name: "Elena Martinez",
    role: "Senior Esthetician",
    image: "https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 4.8,
    specialties: ["Chemical Peels", "Microneedling", "LED Therapy"],
    bio: "Board-certified esthetician specializing in advanced skincare treatments.",
  },
  {
    name: "James Chen",
    role: "Master Stylist",
    image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 5.0,
    specialties: ["Color Correction", "Balayage", "Precision Cuts"],
    bio: "Award-winning stylist with a passion for transformative hair artistry.",
  },
  {
    name: "Aria Thompson",
    role: "Nail Artist",
    image: "https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 4.9,
    specialties: ["Gel Art", "3D Designs", "Japanese Nail Art"],
    bio: "Creative nail artist known for intricate hand-painted designs.",
  },
];

const StylistProfiles = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".stylist-heading", {
        y: 60, opacity: 0, duration: 1,
        scrollTrigger: { trigger: ".stylist-heading", start: "top 85%" },
      });
      gsap.utils.toArray<HTMLElement>(".stylist-card").forEach((card, i) => {
        gsap.from(card, {
          y: 60, opacity: 0, duration: 0.8, delay: i * 0.15,
          scrollTrigger: { trigger: card, start: "top 90%" },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 md:py-32 relative">
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-gold-glow/10 blur-3xl floating-blob-2 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="stylist-heading text-center mb-16">
          <span className="font-body text-xs tracking-[0.3em] uppercase text-primary/60 block mb-4">Our Experts</span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground">
            Meet Our <span className="italic font-normal text-gradient-gold">Artists</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stylists.map((stylist) => (
            <div key={stylist.name} className="stylist-card group">
              <div className="bg-card/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-border/50 transition-all duration-500 group-hover:shadow-luxury group-hover:-translate-y-2">
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={stylist.image}
                    alt={stylist.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-4 left-4 right-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex flex-wrap gap-1">
                      {stylist.specialties.map((s) => (
                        <span key={s} className="px-2 py-1 bg-background/80 backdrop-blur-sm text-[10px] tracking-wider uppercase text-foreground font-body rounded-full">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-lg font-semibold text-foreground">{stylist.name}</h3>
                    <button className="text-muted-foreground hover:text-primary transition-colors">
                      <Instagram size={16} />
                    </button>
                  </div>
                  <p className="font-body text-sm text-primary/70">{stylist.role}</p>
                  <div className="flex items-center gap-1">
                    <Star size={12} className="fill-primary text-primary" />
                    <span className="font-body text-sm text-foreground">{stylist.rating}</span>
                  </div>
                  <p className="font-body text-xs text-muted-foreground leading-relaxed">{stylist.bio}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StylistProfiles;
