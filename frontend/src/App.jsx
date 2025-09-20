import { useState, useEffect } from "react";
import { LanguageProvider } from "./context/LanguageContext";
import LanguagePage from "./pages/LanguagePage";
import LoginPage from "./pages/LoginPage";
import ChatPage from "./pages/ChatPage";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("language");
  const [theme, setTheme] = useState("light");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("appTheme");
    if (savedTheme) {
      setTheme(savedTheme);
    }

    // Check if user has selected language before
    const savedLang = localStorage.getItem("appLang");
    const authToken = localStorage.getItem("authToken");

    if (authToken) {
      setIsAuthenticated(true);
      setCurrentPage("chat");
    } else if (savedLang) {
      setCurrentPage("login");
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem("appTheme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleLanguageSelected = () => {
    setCurrentPage("login");
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setCurrentPage("chat");
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("appLang");
    localStorage.removeItem("translations");
    setIsAuthenticated(false);
    setCurrentPage("language");
  };

  return (
    <LanguageProvider>
      <div
        className={`min-h-screen transition-colors duration-300 ${
          theme === "dark"
            ? "bg-gray-900 text-white"
            : "bg-gray-50 text-gray-900"
        }`}
      >
        {currentPage === "language" && (
          <LanguagePage onLanguageSelected={handleLanguageSelected} />
        )}
        {currentPage === "login" && (
          <LoginPage
            onAuthSuccess={handleAuthSuccess}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        )}
        {currentPage === "chat" && (
          <ChatPage
            theme={theme}
            toggleTheme={toggleTheme}
            onLogout={handleLogout}
          />
        )}
      </div>
    </LanguageProvider>
  );
}

export default App;
