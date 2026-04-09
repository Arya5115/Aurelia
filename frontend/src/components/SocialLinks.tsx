import { Instagram, Facebook, Youtube } from "lucide-react";

const platforms = [
  { icon: Instagram, label: "Instagram", url: "#" },
  { icon: Facebook, label: "Facebook", url: "#" },
  { icon: Youtube, label: "YouTube", url: "#" },
];

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.52a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.73a8.19 8.19 0 004.77 1.53V6.79a4.85 4.85 0 01-1.01-.1z" />
  </svg>
);

const PinterestIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.15 9.42 7.6 11.21-.1-.95-.2-2.41.04-3.45.22-.94 1.4-5.96 1.4-5.96s-.36-.72-.36-1.78c0-1.67.97-2.91 2.17-2.91 1.02 0 1.52.77 1.52 1.69 0 1.03-.65 2.56-.99 3.99-.28 1.19.6 2.16 1.77 2.16 2.12 0 3.76-2.24 3.76-5.47 0-2.86-2.06-4.87-5-4.87-3.4 0-5.4 2.55-5.4 5.19 0 1.03.39 2.13.89 2.73a.36.36 0 01.08.34c-.09.38-.29 1.19-.33 1.36-.05.22-.17.27-.4.16-1.46-.68-2.37-2.82-2.37-4.54 0-3.69 2.68-7.08 7.73-7.08 4.06 0 7.21 2.89 7.21 6.76 0 4.03-2.54 7.28-6.07 7.28-1.19 0-2.3-.61-2.68-1.34l-.73 2.78c-.26 1.01-.97 2.28-1.45 3.05A12 12 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const SocialLinks = ({ className = "" }: { className?: string }) => (
  <div className={`flex gap-3 ${className}`}>
    {platforms.map(({ icon: Icon, label, url }) => (
      <a
        key={label}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary hover:glow-soft transition-all duration-300"
      >
        <Icon size={18} />
      </a>
    ))}
    <a href="#" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary hover:glow-soft transition-all duration-300">
      <TikTokIcon />
    </a>
    <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Pinterest" className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary hover:glow-soft transition-all duration-300">
      <PinterestIcon />
    </a>
  </div>
);

export default SocialLinks;
