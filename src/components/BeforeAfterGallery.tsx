import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const comparisons = [
  {
    label: "Hair Transformation",
    before: "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=600",
    after: "https://images.pexels.com/photos/3992874/pexels-photo-3992874.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    label: "Facial Treatment",
    before: "https://images.pexels.com/photos/3764013/pexels-photo-3764013.jpeg?auto=compress&cs=tinysrgb&w=600",
    after: "https://images.pexels.com/photos/3762466/pexels-photo-3762466.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    label: "Nail Art",
    before: "https://images.pexels.com/photos/3997391/pexels-photo-3997391.jpeg?auto=compress&cs=tinysrgb&w=600",
    after: "https://images.pexels.com/photos/3997375/pexels-photo-3997375.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
];

const BeforeAfterSlider = ({ before, after, label }: { before: string; after: string; label: string }) => {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(0, Math.min(100, x)));
  };

  return (
    <div className="space-y-3">
      <h4 className="font-display text-lg text-foreground text-center">{label}</h4>
      <div
        ref={containerRef}
        className="relative h-80 md:h-96 rounded-2xl overflow-hidden cursor-ew-resize select-none shadow-luxury"
        onMouseMove={(e) => e.buttons === 1 && handleMove(e.clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      >
        {/* After (full) */}
        <img src={after} alt="After" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        {/* Before (clipped) */}
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
          <img src={before} alt="Before" className="absolute inset-0 w-full h-full object-cover" style={{ minWidth: containerRef.current?.offsetWidth || "100%" }} loading="lazy" />
        </div>
        {/* Slider line */}
        <div className="absolute top-0 bottom-0" style={{ left: `${position}%` }}>
          <div className="absolute top-0 bottom-0 w-0.5 bg-cream -translate-x-1/2" />
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-background/90 backdrop-blur-md border-2 border-primary flex items-center justify-center shadow-luxury">
            <span className="font-body text-xs text-foreground">⇔</span>
          </div>
        </div>
        {/* Labels */}
        <span className="absolute top-4 left-4 px-3 py-1 bg-foreground/60 backdrop-blur-sm text-cream text-xs font-body tracking-wider uppercase rounded-full">Before</span>
        <span className="absolute top-4 right-4 px-3 py-1 bg-primary/80 backdrop-blur-sm text-primary-foreground text-xs font-body tracking-wider uppercase rounded-full">After</span>
      </div>
    </div>
  );
};

const BeforeAfterGallery = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".ba-heading", {
        y: 60, opacity: 0, duration: 1,
        scrollTrigger: { trigger: ".ba-heading", start: "top 85%" },
      });
      gsap.utils.toArray<HTMLElement>(".ba-item").forEach((item, i) => {
        gsap.from(item, {
          y: 60, opacity: 0, duration: 0.8, delay: i * 0.2,
          scrollTrigger: { trigger: item, start: "top 90%" },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 md:py-32 bg-gradient-luxury relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="ba-heading text-center mb-16">
          <span className="font-body text-xs tracking-[0.3em] uppercase text-primary/60 block mb-4">Transformations</span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground">
            Before & <span className="italic font-normal text-gradient-gold">After</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {comparisons.map((c) => (
            <div key={c.label} className="ba-item">
              <BeforeAfterSlider {...c} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterGallery;
