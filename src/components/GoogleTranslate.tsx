import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdTranslate } from "react-icons/md";

// List of languages to support
const LANGUAGES = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "de", label: "German", flag: "🇩🇪" },
  { code: "zh-CN", label: "Chinese", flag: "🇨🇳" },
  { code: "ja", label: "Japanese", flag: "🇯🇵" },
  { code: "ko", label: "Korean", flag: "🇰🇷" },
  { code: "ru", label: "Russian", flag: "🇷🇺" },
  { code: "pt", label: "Portuguese", flag: "🇵🇹" },
  { code: "it", label: "Italian", flag: "🇮🇹" },
  { code: "ar", label: "Arabic", flag: "🇸🇦" },
  { code: "hi", label: "Hindi", flag: "🇮🇳" },
  { code: "tr", label: "Turkish", flag: "🇹🇷" },
  { code: "vi", label: "Vietnamese", flag: "🇻🇳" },
  { code: "id", label: "Indonesian", flag: "🇮🇩" },
   { code: "es", label: "Spanish", flag: "🇪🇸" },
  { code: "fr", label: "French", flag: "🇫🇷" },
  { code: "ne", label: "Nepali", flag: "🇳🇵" },
];

const GoogleTranslate = () => {
  const [selectedLang, setSelectedLang] = useState("en");
  const [langDropdown, setLangDropdown] = useState(false);
  const [, setIsReady] = useState(false);
  const observerRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    // 1. Check/Set Cookie on Load
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
    };
    const currentCookie = getCookie("googtrans");
    if (currentCookie) {
      const langCode = currentCookie.split("/")[2];
      if (langCode) setSelectedLang(langCode);
    }

    // 2. Inject Styles to Hide Google Widget
    const styleId = "google-translate-hiding-style";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.innerHTML = `
        .goog-te-banner-frame { display: none !important; }
        .goog-te-combo { display: none !important; }
        .skiptranslate { display: none !important; }
        #google_translate_element { display: none !important; } 
        body { top: 0 !important; }
      `;
      document.head.appendChild(style);
    }

    // 3. Define the Global Callback
    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: LANGUAGES.map((l) => l.code).join(","),
          layout:
            (window as any).google.translate.TranslateElement.InlineLayout.VERTICAL,
          autoDisplay: false,
        },
        "google_translate_element",
      );
    };

    // 4. Inject the Script if not present
    if (!document.querySelector('script[src*="translate.google.com"]')) {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }

    // 5. Observer to Detect when the <select> is actually added to the DOM
    const targetNode = document.getElementById("google_translate_element");
    if (targetNode) {
      observerRef.current = new MutationObserver(() => {
        const select = targetNode.querySelector("select.goog-te-combo");
        if (select) {
          setIsReady(true);
          observerRef.current?.disconnect();
        }
      });
      observerRef.current.observe(targetNode, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  const handleLanguageChange = (code: string) => {
    setSelectedLang(code);
    setLangDropdown(false);

    // 1. Update the hidden Google Select
    const googleSelect = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (googleSelect) {
      googleSelect.value = code;
      googleSelect.dispatchEvent(new Event("change", { bubbles: true }));
    }

    // 2. Manually set the cookie
    document.cookie = `googtrans=/auto/${code}; path=/; domain=${window.location.hostname}`;
    document.cookie = `googtrans=/auto/${code}; path=/;`;
  };

  return (
    <div className="relative">
      <div id="google_translate_element" className="hidden absolute"></div>

      <button
        className="w-9 h-9 rounded-lg bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-foreground transition-all"
        onClick={() => setLangDropdown(!langDropdown)}
      >
        <MdTranslate size={20} className="text-foreground" />
      </button>

      <AnimatePresence>
        {langDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-48 max-h-[80vh] overflow-y-auto bg-popover/80 backdrop-blur-xl border border-border rounded-xl shadow-2xl z-50 scrollbar-thin"
          >
            <div className="py-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`flex items-center gap-3 px-4 py-2 w-full transition-all text-left hover:bg-accent ${
                    selectedLang === lang.code
                      ? "bg-accent text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="text-sm font-medium">{lang.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GoogleTranslate;
