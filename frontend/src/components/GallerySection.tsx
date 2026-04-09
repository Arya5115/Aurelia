import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { X } from "lucide-react";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import heroSpa from "@/assets/hero-spa.jpg";
import relaxImg from "@/assets/relax.jpg";

gsap.registerPlugin(ScrollTrigger);

const images = [
  { src: gallery1, alt: "Spa essentials", label: "Aromatherapy" },
  { src: gallery2, alt: "Spa pool", label: "Hydrotherapy" },
  { src: gallery3, alt: "Beauty products", label: "Premium Care" },
  { src: gallery4, alt: "Relaxation", label: "Wellness" },
  { src: heroSpa, alt: "Spa interior", label: "Our Space" },
  { src: relaxImg, alt: "Zen space", label: "Serenity" },
];

const GallerySection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [fullscreen, setFullscreen] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".gallery-heading", {
        y: 60, opacity: 0, duration: 1,
        scrollTrigger: { trigger: ".gallery-heading", start: "top 85%" },
      });

      const scrollContainer = scrollRef.current;
      if (scrollContainer) {
        const totalWidth = scrollContainer.scrollWidth - window.innerWidth;

        gsap.to(scrollContainer, {
          x: -totalWidth,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${totalWidth}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (fullscreen !== null) {
      gsap.from(".fullscreen-modal", { scale: 0.8, opacity: 0, duration: 0.5, ease: "power3.out" });
    }
  }, [fullscreen]);

  return (
    <section ref={sectionRef} id="gallery" className="relative bg-gradient-luxury">
      <div className="pt-20 md:pt-32 pb-8 container mx-auto px-6">
        <div className="gallery-heading text-center mb-12">
          <span className="font-body text-xs tracking-[0.3em] uppercase text-primary/60 block mb-4">Visual Journey</span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground">
            Our <span className="italic font-normal text-gradient-gold">Gallery</span>
          </h2>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-6 px-6 pb-20 will-change-transform">
        {images.map((img, i) => (
          <div
            key={i}
            className="gallery-item group relative flex-shrink-0 cursor-pointer"
            style={{ width: i % 3 === 0 ? "500px" : i % 3 === 1 ? "400px" : "350px" }}
            onClick={() => setFullscreen(i)}
          >
            <div className="relative overflow-hidden rounded-2xl h-[400px] md:h-[500px]">
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-all duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <span className="font-display text-xl text-cream">{img.label}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {fullscreen !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 backdrop-blur-md" onClick={() => setFullscreen(null)}>
          <div className="fullscreen-modal relative max-w-5xl w-full mx-6">
            <button
              onClick={() => setFullscreen(null)}
              className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-background/20 flex items-center justify-center text-cream hover:bg-background/40 transition-colors"
            >
              <X size={20} />
            </button>
            <img src={images[fullscreen].src} alt={images[fullscreen].alt} className="w-full rounded-2xl object-contain max-h-[80vh]" />
            <p className="text-center mt-4 font-display text-xl text-cream">{images[fullscreen].label}</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;
