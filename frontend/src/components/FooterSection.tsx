import { MapPin, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import SocialLinks from "@/components/SocialLinks";
import { businessInfo } from "@/lib/business";

const FooterSection = () => (
  <footer id="contact" className="py-20 bg-warm-brown text-cream">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="space-y-4">
          <h3 className="font-display text-3xl font-semibold text-gradient-gold">Aurelia</h3>
          <p className="font-body text-cream/60 text-sm leading-relaxed max-w-xs">
            A sanctuary where beauty meets tranquility. Every visit is a journey toward your most radiant self.
          </p>
          <SocialLinks className="[&_a]:border-cream/20 [&_a]:text-cream/40 [&_a:hover]:text-gold [&_a:hover]:border-gold" />
        </div>
        <div className="space-y-4">
          <h4 className="font-display text-lg text-cream">Quick Links</h4>
          <div className="space-y-2 font-body text-sm text-cream/60">
            <Link to="/about" className="block hover:text-gold transition-colors">About Us</Link>
            <a href="/#services" className="block hover:text-gold transition-colors">Services</a>
            <a href="/#gallery" className="block hover:text-gold transition-colors">Gallery</a>
            <Link to="/blog" className="block hover:text-gold transition-colors">Blog</Link>
            <Link to="/contact" className="block hover:text-gold transition-colors">Contact</Link>
          </div>
        </div>
        <div className="space-y-4">
          <h4 className="font-display text-lg text-cream">Visit Us</h4>
          <div className="space-y-3 font-body text-sm text-cream/60">
            <p className="flex items-center gap-3"><MapPin size={16} /> {businessInfo.locationFull}</p>
            <p className="flex items-center gap-3"><Phone size={16} /> {businessInfo.phoneDisplay}</p>
            <p className="flex items-center gap-3"><Mail size={16} /> {businessInfo.email}</p>
          </div>
        </div>
        <div className="space-y-4">
          <h4 className="font-display text-lg text-cream">Hours</h4>
          <div className="space-y-2 font-body text-sm text-cream/60">
            {businessInfo.hours.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-cream/10 pt-8 text-center">
        <p className="font-body text-xs text-cream/30 tracking-wider">
          © 2026 Aurelia Beauty & Spa. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default FooterSection;
