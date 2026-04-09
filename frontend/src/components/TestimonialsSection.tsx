import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    name: "Isabella Monroe",
    service: "Signature Massage",
    rating: 5,
    text: "An absolutely transcendent experience. From the moment I walked in, every detail was perfect. The hot stone massage released tension I didn't even know I was carrying.",
    image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
    video: false,
  },
  {
    name: "Charlotte Williams",
    service: "Radiance Facial",
    rating: 5,
    text: "My skin has never looked this radiant. The esthetician was incredibly knowledgeable and the products used were divine. I've been glowing for weeks!",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150",
    video: false,
  },
  {
    name: "Olivia Johnson",
    service: "Luxury Hair Styling",
    rating: 5,
    text: "James transformed my hair completely. The consultation was thorough and the result exceeded my wildest expectations. Truly a master of his craft.",
    image: "https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=150",
    video: true,
  },
  {
    name: "Emma Davis",
    service: "Artisan Nail Design",
    rating: 5,
    text: "The attention to detail in my nail art was breathtaking. Each nail was a tiny masterpiece. The hand treatment that came with it was pure luxury.",
    image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150",
    video: false,
  },
];

const TestimonialsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".testimonial-heading", {
        y: 60, opacity: 0, duration: 1,
        scrollTrigger: { trigger: ".testimonial-heading", start: "top 85%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    gsap.from(".testimonial-card-active", {
      opacity: 0, y: 30, duration: 0.5, ease: "power2.out",
    });
  }, [active]);

  const next = () => setActive((a) => (a + 1) % testimonials.length);
  const prev = () => setActive((a) => (a - 1 + testimonials.length) % testimonials.length);
  const t = testimonials[active];

  return (
    <section ref={sectionRef} className="py-20 md:py-32 bg-gradient-luxury relative overflow-hidden">
      <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-blush/15 blur-3xl floating-blob pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="testimonial-heading text-center mb-16">
          <span className="font-body text-xs tracking-[0.3em] uppercase text-primary/60 block mb-4">Client Love</span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground">
            What They <span className="italic font-normal text-gradient-gold">Say</span>
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="testimonial-card-active bg-card/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-luxury border border-border/50 relative">
            <Quote size={48} className="absolute top-6 right-8 text-primary/10" />
            
            <div className="flex items-center gap-4 mb-6">
              <img
                src={t.image}
                alt={t.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                loading="lazy"
              />
              <div>
                <h4 className="font-display text-lg text-foreground">{t.name}</h4>
                <p className="font-body text-sm text-muted-foreground">{t.service}</p>
              </div>
              {t.video && (
                <span className="ml-auto px-3 py-1 bg-primary/10 text-primary text-xs font-body tracking-wider uppercase rounded-full">
                  🎥 Video
                </span>
              )}
            </div>

            <div className="flex gap-1 mb-4">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} size={16} className="fill-primary text-primary" />
              ))}
            </div>

            <p className="font-body text-foreground/80 leading-relaxed text-lg italic">
              "{t.text}"
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button onClick={prev} className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors duration-300">
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === active ? "bg-primary w-8" : "bg-border hover:bg-primary/40"}`}
                />
              ))}
            </div>
            <button onClick={next} className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors duration-300">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
