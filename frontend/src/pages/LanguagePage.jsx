import { useLanguage } from "../context/LanguageContext";
import { getLanguageCode } from "../utils/translator";
import React from "react";

const LanguagePage = ({ onLanguageSelected }) => {
  const { t, setLang, loading } = useLanguage();

  const languages = [
    { name: "english", display: "English", flag: "us" },
    { name: "hindi", display: "हिन्दी", flag: "in" },
    { name: "bengali", display: "বাংলা", flag: "in" },
    { name: "telugu", display: "తెలుగు", flag: "in" },
    { name: "marathi", display: "मराठी", flag: "in" },
    { name: "tamil", display: "தமிழ்", flag: "in" },
    { name: "gujarati", display: "ગુજરાતી", flag: "in" },
    { name: "urdu", display: "اردو", flag: "in" },
    { name: "kannada", display: "ಕನ್ನಡ", flag: "in" },
    { name: "odia", display: "ଓଡ଼ିଆ", flag: "in" },
    { name: "punjabi", display: "ਪੰਜਾਬੀ", flag: "in" },
    { name: "malayalam", display: "മലയാളം", flag: "in" },
  ];

  const handleLanguageSelect = (languageName) => {
    const langCode = getLanguageCode(languageName);
    setLang(langCode);

    setTimeout(() => {
      onLanguageSelected();
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t("languagePage.title") || "Welcome to AI Chat"}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {t("languagePage.subtitle") || "Choose your preferred language"}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {languages.map((language, index) => (
            <button
              key={language.name}
              onClick={() => handleLanguageSelect(language.name)}
              disabled={loading}
              className={`
                group relative p-6 rounded-xl border-2 transition-all duration-300
                hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/20
                ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700
                hover:border-blue-500 dark:hover:border-blue-400
                animate-slide-up
              `}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex flex-col items-center space-y-3">
                <span className="text-3xl">{language.flag}</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {language.display}
                </span>
              </div>

              <div className="absolute inset-0 rounded-xl bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          ))}
        </div>

        {loading && (
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
              <span>Loading translations...</span>
            </div>
          </div>
        )}

        <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
          Select your language to continue to the chat interface
        </div>
      </div>
    </div>
  );
};

export default LanguagePage;
