import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import relaxImg from "@/assets/relax.jpg";
import rejuvenateImg from "@/assets/rejuvenate.jpg";
import transformImg from "@/assets/transform.jpg";

gsap.registerPlugin(ScrollTrigger);

const stories = [
  {
    title: "Relax",
    subtitle: "Surrender to Stillness",
    description: "Let the weight of the world dissolve as gentle hands and warm aromas guide you into deep tranquility.",
    image: relaxImg,
  },
  {
    title: "Rejuvenate",
    subtitle: "Awaken Your Radiance",
    description: "Advanced treatments infused with nature's finest ingredients restore your skin's luminous vitality.",
    image: rejuvenateImg,
  },
  {
    title: "Transform",
    subtitle: "Emerge Renewed",
    description: "Step into a new chapter of confidence and beauty, where transformation begins from within.",
    image: transformImg,
  },
];

const ScrollStory = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>(".story-panel");

      sections.forEach((section, i) => {
        const img = section.querySelector(".story-image");
        const text = section.querySelector(".story-text");
        const number = section.querySelector(".story-number");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 20%",
            scrub: 0.5,
          },
        });

        tl.from(img, { x: i % 2 === 0 ? -100 : 100, opacity: 0, scale: 0.9, duration: 1 })
          .from(text, { x: i % 2 === 0 ? 100 : -100, opacity: 0, duration: 1 }, 0.2)
          .from(number, { scale: 0, opacity: 0, duration: 0.8 }, 0);

        gsap.to(img, {
          y: -50,
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="py-20 md:py-32 overflow-hidden">
      {stories.map((story, i) => (
        <section
          key={story.title}
          className="story-panel min-h-[80vh] flex items-center py-16 md:py-24"
        >
          <div className={`container mx-auto px-6 flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-12 md:gap-20`}>
            <div className="story-image relative w-full md:w-1/2">
              <div className="relative overflow-hidden rounded-2xl shadow-luxury">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-[400px] md:h-[500px] object-cover"
                  loading="lazy"
                  width={1024}
                  height={1024}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-warm-brown/20 to-transparent" />
              </div>
              <span className="story-number absolute -top-6 -left-4 md:-top-10 md:-left-8 font-display text-8xl md:text-[10rem] font-bold text-gold/10 select-none pointer-events-none">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>

            <div className="story-text w-full md:w-1/2 space-y-6">
              <span className="font-body text-xs tracking-[0.3em] uppercase text-primary/60">
                Step {i + 1}
              </span>
              <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold text-foreground">
                {story.title}
              </h2>
              <p className="font-display text-xl md:text-2xl italic text-primary/80">
                {story.subtitle}
              </p>
              <p className="font-body text-base text-muted-foreground leading-relaxed max-w-md">
                {story.description}
              </p>
              <div className="w-16 h-px bg-gradient-gold" />
            </div>
          </div>
        </section>
      ))}
    </div>
  );
};

export default ScrollStory;
