import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import SocialLinks from "@/components/SocialLinks";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="bg-background overflow-x-hidden">
      <Navbar />
      <section className="pt-32 pb-12 md:pt-40">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <span className="font-body text-xs tracking-[0.3em] uppercase text-primary/60 block mb-4">Get in Touch</span>
          <h1 className="font-display text-5xl md:text-6xl font-semibold text-foreground mb-6">
            Contact <span className="italic font-normal text-gradient-gold">Us</span>
          </h1>
        </div>
      </section>

      <section className="pb-20 md:pb-32">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="bg-card/80 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-border/50 shadow-luxury">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-6">Send a Message</h2>
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-gold mx-auto flex items-center justify-center">
                    <Send size={24} className="text-primary-foreground" />
                  </div>
                  <p className="font-display text-xl text-foreground">Message Sent!</p>
                  <p className="font-body text-sm text-muted-foreground">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Your Name"
                      required
                      maxLength={100}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border/50 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      required
                      maxLength={255}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border/50 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <input
                    type="tel"
                    placeholder="Phone (optional)"
                    maxLength={20}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border/50 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                  <textarea
                    placeholder="How can we help you?"
                    required
                    maxLength={1000}
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border/50 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-gold text-primary-foreground font-body text-sm tracking-[0.15em] uppercase rounded-full hover:glow-gold hover:scale-[1.02] transition-all duration-300"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Info + Map */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg text-foreground mb-1">Visit Us</h3>
                    <p className="font-body text-sm text-muted-foreground">123 Serenity Boulevard, Beverly Hills, CA 90210</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg text-foreground mb-1">Call Us</h3>
                    <p className="font-body text-sm text-muted-foreground">+1 (310) 555-0189</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg text-foreground mb-1">Email</h3>
                    <p className="font-body text-sm text-muted-foreground">hello@aurelia-spa.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg text-foreground mb-1">Hours</h3>
                    <p className="font-body text-sm text-muted-foreground">Mon–Fri: 9AM–8PM · Sat: 10AM–6PM · Sun: 10AM–4PM</p>
                  </div>
                </div>
              </div>

              <SocialLinks />

              {/* Google Map */}
              <div className="rounded-2xl overflow-hidden shadow-luxury border border-border/50 h-64">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.7152203584424!2d-118.40015672346096!3d34.06338611806741!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2bc04d6d147ab%3A0xd6c7c379fd081ed1!2sBeverly%20Hills%2C%20CA%2090210!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Aurelia Spa Location"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <FooterSection />
    </div>
  );
};

export default Contact;
