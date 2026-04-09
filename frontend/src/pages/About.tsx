import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Heart, Award, Users, Leaf } from "lucide-react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import StylistProfiles from "@/components/StylistProfiles";

gsap.registerPlugin(ScrollTrigger);

const values = [
  { icon: Heart, title: "Passion", desc: "Every touch, every detail is crafted with love and dedication to your well-being." },
  { icon: Award, title: "Excellence", desc: "Only the finest products and techniques make it into our sanctuary." },
  { icon: Users, title: "Community", desc: "We believe beauty flourishes when shared in a warm, welcoming space." },
  { icon: Leaf, title: "Sustainability", desc: "Eco-conscious practices and cruelty-free products protect our planet." },
];

const About = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".about-hero-text", { y: 60, opacity: 0, duration: 1, stagger: 0.2 });
      gsap.utils.toArray<HTMLElement>(".value-card").forEach((card, i) => {
        gsap.from(card, {
          y: 60, opacity: 0, duration: 0.8, delay: i * 0.15,
          scrollTrigger: { trigger: card, start: "top 90%" },
        });
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="bg-background overflow-x-hidden">
      <Navbar />
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 relative">
        <div className="absolute inset-0 bg-gradient-luxury" />
        <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-blush/15 blur-3xl floating-blob pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10 text-center max-w-3xl">
          <span className="about-hero-text font-body text-xs tracking-[0.3em] uppercase text-primary/60 block mb-4">Our Story</span>
          <h1 className="about-hero-text font-display text-5xl md:text-6xl lg:text-7xl font-semibold text-foreground mb-6">
            About <span className="italic font-normal text-gradient-gold">Aurelia</span>
          </h1>
          <p className="about-hero-text font-body text-lg text-muted-foreground leading-relaxed">
            Founded in 2018, Aurelia was born from a simple belief: everyone deserves a moment of luxury.
            Based in Patna, Bihar, our sanctuary combines ancient healing traditions with
            cutting-edge beauty innovation.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
                Where Beauty Meets <span className="italic font-normal text-gradient-gold">Tranquility</span>
              </h2>
              <p className="font-body text-muted-foreground leading-relaxed">
                Our founder, Sofia Laurent, traveled the world studying massage therapies, skincare rituals,
                and beauty traditions from Japan to Scandinavia. She envisioned a space where these diverse
                practices would converge into one transformative experience.
              </p>
              <p className="font-body text-muted-foreground leading-relaxed">
                Today, Aurelia is home to 12 world-class practitioners, each a master of their craft.
                We've served over 15,000 clients, and every visit is as personal as the first.
              </p>
              <div className="flex gap-8 pt-4">
                <div><span className="font-display text-3xl text-primary font-semibold">15K+</span><p className="font-body text-xs text-muted-foreground">Happy Clients</p></div>
                <div><span className="font-display text-3xl text-primary font-semibold">12</span><p className="font-body text-xs text-muted-foreground">Expert Artists</p></div>
                <div><span className="font-display text-3xl text-primary font-semibold">6</span><p className="font-body text-xs text-muted-foreground">Years of Excellence</p></div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3997993/pexels-photo-3997993.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Aurelia spa interior"
                className="w-full h-[500px] object-cover rounded-2xl shadow-luxury"
                loading="lazy"
              />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-2xl bg-gradient-gold flex items-center justify-center shadow-luxury">
                <span className="font-display text-2xl text-primary-foreground font-semibold">Est.<br/>2018</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 md:py-32 bg-gradient-luxury">
        <div className="container mx-auto px-6">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground text-center mb-16">
            Our <span className="italic font-normal text-gradient-gold">Values</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="value-card bg-card/80 backdrop-blur-xl rounded-2xl p-6 border border-border/50 hover:shadow-luxury hover:-translate-y-1 transition-all duration-500">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Icon size={20} className="text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{title}</h3>
                <p className="font-body text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <StylistProfiles />
      <FooterSection />
    </div>
  );
};

export default About;
