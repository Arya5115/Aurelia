import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { X, Clock, IndianRupee } from "lucide-react";
import { apiClient, type Service } from "@/lib/api";
import { formatInrAmount } from "@/lib/currency";
import { defaultServices, getServiceImage } from "@/lib/servicePresentation";

gsap.registerPlugin(ScrollTrigger);

const ServicesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeService, setActiveService] = useState<number | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [serviceSource, setServiceSource] = useState<"backend" | "fallback">("backend");

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".section-heading", {
        y: 60, opacity: 0, duration: 1,
        scrollTrigger: { trigger: ".section-heading", start: "top 85%" },
      });

      gsap.utils.toArray<HTMLElement>(".service-card").forEach((card, i) => {
        gsap.from(card, {
          y: 80, opacity: 0, duration: 0.8, delay: i * 0.15,
          scrollTrigger: { trigger: card, start: "top 85%" },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    void (async () => {
      try {
        const backendServices = await apiClient.getServices();
        if (backendServices.length > 0) {
          setServices(backendServices);
          setServiceSource("backend");
          return;
        }
      } catch {
        // Fall back to curated defaults when the API is unavailable.
      }

      setServices(defaultServices);
      setServiceSource("fallback");
    })();
  }, []);

  useEffect(() => {
    if (activeService !== null) {
      gsap.from(".modal-content", { scale: 0.85, opacity: 0, duration: 0.5, ease: "back.out(1.7)" });
      gsap.from(".modal-backdrop", { opacity: 0, duration: 0.3 });
    }
  }, [activeService]);

  return (
    <section ref={sectionRef} id="services" className="py-20 md:py-32 bg-gradient-luxury relative">
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-blush/20 blur-3xl floating-blob pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-gold-glow/10 blur-3xl floating-blob-2 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="section-heading text-center mb-16">
          <span className="font-body text-xs tracking-[0.3em] uppercase text-primary/60 block mb-4">Our Offerings</span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-4">
            Curated <span className="italic font-normal text-gradient-gold">Experiences</span>
          </h2>
          <p className="font-body text-muted-foreground max-w-lg mx-auto">
            Each treatment is a journey, thoughtfully designed to nurture your body and soul
          </p>
        </div>

        {serviceSource === "fallback" && (
          <div className="mb-8 rounded-3xl border border-primary/20 bg-card/70 px-6 py-4 text-center">
            <p className="font-body text-sm text-muted-foreground">
              Showing curated services while the backend catalog is unavailable.
            </p>
          </div>
        )}

        {services.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => (
              <div
                key={service.id}
                className="service-card group cursor-pointer"
                onClick={() => setActiveService(i)}
              >
                <div className="relative overflow-hidden rounded-2xl bg-card transition-all duration-500 group-hover:shadow-luxury group-hover:-translate-y-2 group-hover:glow-soft">
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={getServiceImage(service)}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                      width={800}
                      height={1024}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <span className="absolute top-4 left-4 px-3 py-1 bg-background/80 backdrop-blur-md text-xs tracking-[0.15em] uppercase text-foreground font-body rounded-full">
                      {service.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg font-semibold text-foreground mb-1">{service.title}</h3>
                    <div className="flex items-center gap-4 text-muted-foreground text-sm font-body">
                      <span className="flex items-center gap-1"><Clock size={14} /> {service.duration || "Custom"}</span>
                      <span className="flex items-center gap-1"><IndianRupee size={14} /> {formatInrAmount(service.price)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {activeService !== null && services[activeService] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="modal-backdrop absolute inset-0 bg-foreground/60 backdrop-blur-sm" onClick={() => setActiveService(null)} />
          <div className="modal-content relative bg-background rounded-3xl overflow-hidden max-w-2xl w-full shadow-luxury">
            <button
              onClick={() => setActiveService(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-background/80 backdrop-blur-md flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
            >
              <X size={18} />
            </button>
            <div className="h-64 overflow-hidden">
              <img src={getServiceImage(services[activeService])} alt={services[activeService].title} className="w-full h-full object-cover" />
            </div>
            <div className="p-8 space-y-4">
              <span className="font-body text-xs tracking-[0.2em] uppercase text-primary/60">{services[activeService].category}</span>
              <h3 className="font-display text-3xl font-semibold text-foreground">{services[activeService].title}</h3>
              <p className="font-body text-muted-foreground leading-relaxed">{services[activeService].description || "A premium treatment curated by the Aurelia team."}</p>
              <div className="flex items-center gap-6 text-foreground font-body">
                <span className="flex items-center gap-2"><Clock size={16} /> {services[activeService].duration || "Custom duration"}</span>
                <span className="flex items-center gap-2"><IndianRupee size={16} /> {formatInrAmount(services[activeService].price)}</span>
              </div>
              <a
                href="#book"
                onClick={() => setActiveService(null)}
                className="inline-block mt-4 px-8 py-3 bg-gradient-gold text-primary-foreground font-body text-sm tracking-[0.15em] uppercase rounded-full hover:glow-gold hover:scale-105 transition-all duration-300"
              >
                Book This Treatment
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ServicesSection;
