import { useEffect, useRef, useState } from "react";
import { Menu, X, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import logoImg from "@/assets/logo.svg";

const Navbar = () => {
  const navRef = useRef<HTMLElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 50);
      // Always keep navbar visible
      setVisible(true);
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "About", to: "/about" },
    { label: "Services", to: isHome ? "#services" : "/#services" },
    { label: "Gallery", to: isHome ? "#gallery" : "/#gallery" },
    { label: "Blog", to: "/blog" },
    { label: "Contact", to: "/contact" },
  ];

  const isActive = (to: string) => {
    if (to === "/") return location.pathname === "/";
    if (to.startsWith("#") || to.startsWith("/#")) return false;
    return location.pathname === to;
  };

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        visible ? "translate-y-0" : "-translate-y-full"
      } ${
        scrolled
          ? "bg-background/95 backdrop-blur-xl shadow-luxury py-2"
          : "bg-background/80 backdrop-blur-md py-4"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <img src={logoImg} alt="Aurelia" className="h-10 w-10 object-contain transition-transform duration-300 group-hover:scale-110" width={40} height={40} />
          <span className="font-display text-xl md:text-2xl font-semibold text-gradient-gold tracking-wide">
            Aurelia
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) =>
            link.to.startsWith("#") || link.to.startsWith("/#") ? (
              <a
                key={link.label}
                href={link.to}
                className="font-body text-xs tracking-[0.2em] uppercase text-foreground/70 hover:text-primary transition-colors duration-300 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.to}
                className={`font-body text-xs tracking-[0.2em] uppercase transition-colors duration-300 relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 ${
                  isActive(link.to)
                    ? "text-primary after:w-full"
                    : "text-foreground/70 hover:text-primary after:w-0 hover:after:w-full"
                }`}
              >
                {link.label}
              </Link>
            )
          )}
          <LanguageSwitcher />
          <Link
            to="/login"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-border/50 text-foreground/70 hover:text-primary hover:border-primary/50 transition-all duration-300 font-body text-xs tracking-wider"
          >
            <User size={14} />
            Profile
          </Link>
          <Link
            to={isHome ? "#book" : "/#book"}
            className="px-6 py-2.5 bg-gradient-gold text-primary-foreground font-body text-xs tracking-[0.15em] uppercase rounded-full hover:glow-gold transition-all duration-300 hover:scale-105"
          >
            Book Now
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-background/98 backdrop-blur-xl border-t border-border animate-scale-in">
          <div className="flex flex-col items-center gap-5 py-6">
            {navLinks.map((link) =>
              link.to.startsWith("#") || link.to.startsWith("/#") ? (
                <a
                  key={link.label}
                  href={link.to}
                  className="font-body text-sm tracking-[0.2em] uppercase text-foreground/70 hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.to}
                  className={`font-body text-sm tracking-[0.2em] uppercase transition-colors ${
                    isActive(link.to) ? "text-primary font-medium" : "text-foreground/70 hover:text-primary"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              )
            )}
            <Link
              to="/login"
              className="flex items-center gap-2 font-body text-sm tracking-[0.2em] uppercase text-foreground/70 hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              <User size={14} /> Profile
            </Link>
            <LanguageSwitcher />
            <Link
              to={isHome ? "#book" : "/#book"}
              className="px-6 py-2.5 bg-gradient-gold text-primary-foreground font-body text-xs tracking-[0.15em] uppercase rounded-full"
              onClick={() => setIsOpen(false)}
            >
              Book Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
