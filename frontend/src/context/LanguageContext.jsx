import { createContext, useState, useEffect, useContext } from "react";
import display from "../constants/display";
import { translateDisplay } from "../utils/translator";

const LanguageContext = createContext({
  lang: "en",
  setLang: () => {},
  t: () => "",
  loading: false,
  texts: display,
});

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");
  const [texts, setTexts] = useState(display);
  const [loading, setLoading] = useState(false);

  // load persisted language
  useEffect(() => {
    const saved = localStorage.getItem("appLang");
    if (saved) setLang(saved);
  }, []);

  // when lang changes, fetch translations
  useEffect(() => {
    let mounted = true;
    async function doTranslate() {
      setLoading(true);
      try {
        if (!lang || lang === "en") {
          setTexts(display);
        } else {
          const translated = await translateDisplay(display, lang);
          if (mounted && translated) {
            setTexts(translated);
          } else {
            setTexts(display);
          }
        }
      } catch (err) {
        console.error("LanguageProvider translation error", err);
        setTexts(display);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    doTranslate();
    localStorage.setItem("appLang", lang);
    return () => {
      mounted = false;
    };
  }, [lang]);

  // helper t('loginPage.welcomeText') -> string
  function t(path) {
    if (!path) return "";
    const parts = path.split(".");
    let cur = texts;
    for (const p of parts) {
      if (!cur) return "";
      cur = cur[p];
    }
    if (typeof cur === "string") return cur;
    return "";
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, loading, texts }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
