import { useState } from "react";
import { MessageCircle, X, Phone, Mail, Send } from "lucide-react";

const WhatsAppChat = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 bg-card/95 backdrop-blur-xl rounded-2xl shadow-luxury border border-border/50 overflow-hidden animate-scale-in">
          <div className="bg-gradient-gold p-4">
            <h4 className="font-display text-lg text-primary-foreground">Chat with us</h4>
            <p className="font-body text-xs text-primary-foreground/80">We typically reply within minutes</p>
          </div>

          <div className="p-4 space-y-3">
            <a
              href="https://wa.me/13105550189?text=Hello%20Aurelia!%20I'd%20like%20to%20book%20an%20appointment."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 transition-colors duration-300 group"
            >
              <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center">
                <Phone size={18} className="text-cream" />
              </div>
              <div>
                <p className="font-body text-sm font-medium text-foreground">WhatsApp</p>
                <p className="font-body text-xs text-muted-foreground">Chat instantly</p>
              </div>
              <Send size={14} className="ml-auto text-muted-foreground group-hover:text-foreground transition-colors" />
            </a>

            <a
              href="mailto:hello@aurelia-spa.com"
              className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors duration-300 group"
            >
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <Mail size={18} className="text-primary-foreground" />
              </div>
              <div>
                <p className="font-body text-sm font-medium text-foreground">Email Us</p>
                <p className="font-body text-xs text-muted-foreground">hello@aurelia-spa.com</p>
              </div>
              <Send size={14} className="ml-auto text-muted-foreground group-hover:text-foreground transition-colors" />
            </a>

            <a
              href="tel:+13105550189"
              className="flex items-center gap-3 p-3 rounded-xl bg-accent/30 hover:bg-accent/50 transition-colors duration-300 group"
            >
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                <Phone size={18} className="text-accent-foreground" />
              </div>
              <div>
                <p className="font-body text-sm font-medium text-foreground">Call Us</p>
                <p className="font-body text-xs text-muted-foreground">+1 (310) 555-0189</p>
              </div>
              <Send size={14} className="ml-auto text-muted-foreground group-hover:text-foreground transition-colors" />
            </a>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-luxury transition-all duration-300 hover:scale-110 ${
          isOpen ? "bg-foreground text-background rotate-0" : "bg-gradient-gold text-primary-foreground glow-gold"
        }`}
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
};

export default WhatsAppChat;
