import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const blurRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(overlayRef.current, { opacity: 0, duration: 1.5 }, 0)
        .from(titleRef.current, { y: 80, opacity: 0, duration: 1.2 }, 0.8)
        .from(subtitleRef.current, { y: 40, opacity: 0, duration: 1 }, 1.2)
        .from(ctaRef.current, { y: 30, opacity: 0, scale: 0.9, duration: 0.8 }, 1.6);

      if (blurRef.current) {
        gsap.to(blurRef.current, {
          backdropFilter: "blur(20px)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
      }

      if (videoRef.current) {
        gsap.to(videoRef.current, {
          scale: 1.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover scale-105"
        poster="https://images.pexels.com/photos/3997993/pexels-photo-3997993.jpeg?auto=compress&cs=tinysrgb&w=1920"
      >
        <source
          src="https://videos.pexels.com/video-files/3188167/3188167-uhd_2560_1440_30fps.mp4"
          type="video/mp4"
        />
      </video>

      <div
        ref={blurRef}
        className="absolute inset-0 backdrop-blur-[2px] transition-all"
      />

      <div ref={overlayRef} className="absolute inset-0 hero-overlay" />

      <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-gold-glow/10 blur-3xl floating-blob pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-blush/20 blur-3xl floating-blob-2 pointer-events-none" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <h1
          ref={titleRef}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-semibold text-cream leading-tight mb-6"
        >
          Discover Your
          <br />
          <span className="italic font-normal text-gold-light">Inner Glow</span>
        </h1>
        <p
          ref={subtitleRef}
          className="font-body text-lg md:text-xl text-cream/80 max-w-xl tracking-wide font-light mb-10"
        >
          A sanctuary of beauty and tranquility, where every moment is crafted for your renewal
        </p>
        <a
          ref={ctaRef}
          href="#book"
          className="group relative px-10 py-4 bg-gradient-gold text-primary-foreground font-body text-sm tracking-[0.2em] uppercase rounded-full overflow-hidden transition-all duration-500 hover:scale-105 hover:glow-gold"
        >
          <span className="relative z-10">Book Your Experience</span>
          <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
