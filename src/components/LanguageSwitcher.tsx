import { useState, createContext, useContext, type ReactNode } from "react";
import { Globe } from "lucide-react";

type Lang = "en" | "es" | "fr" | "ar" | "hi";

const translations: Record<Lang, Record<string, string>> = {
  en: { home: "Home", services: "Services", gallery: "Gallery", book: "Book", contact: "Contact", about: "About", blog: "Blog" },
  es: { home: "Inicio", services: "Servicios", gallery: "Galería", book: "Reservar", contact: "Contacto", about: "Acerca", blog: "Blog" },
  fr: { home: "Accueil", services: "Services", gallery: "Galerie", book: "Réserver", contact: "Contact", about: "À propos", blog: "Blog" },
  ar: { home: "الرئيسية", services: "الخدمات", gallery: "المعرض", book: "حجز", contact: "اتصل", about: "حول", blog: "مدونة" },
  hi: { home: "होम", services: "सेवाएं", gallery: "गैलरी", book: "बुक", contact: "संपर्क", about: "हमारे बारे में", blog: "ब्लॉग" },
};

const langLabels: Record<Lang, string> = { en: "EN", es: "ES", fr: "FR", ar: "AR", hi: "HI" };

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const LangContext = createContext<LangCtx>({
  lang: "en",
  setLang: () => {},
  t: (k) => k,
});

export const useLang = () => useContext(LangContext);

export const LangProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>("en");
  const t = (key: string) => translations[lang]?.[key] || key;
  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
};

const LanguageSwitcher = () => {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const langs = Object.keys(langLabels) as Lang[];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/50 text-foreground/70 hover:text-foreground hover:border-primary/50 transition-colors duration-300 font-body text-xs tracking-wider"
      >
        <Globe size={14} />
        {langLabels[lang]}
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-2 bg-card/95 backdrop-blur-xl rounded-xl shadow-luxury border border-border/50 py-1 min-w-[100px] animate-scale-in z-50">
          {langs.map((l) => (
            <button
              key={l}
              onClick={() => { setLang(l); setOpen(false); }}
              className={`w-full text-left px-4 py-2 font-body text-sm hover:bg-primary/10 transition-colors ${l === lang ? "text-primary font-medium" : "text-foreground/70"}`}
            >
              {langLabels[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
