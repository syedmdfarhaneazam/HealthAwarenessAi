// Mock translation API endpoint
// In a real application, this would call Google Cloud Translate or another service

const mockTranslations = {
  // Hindi translations
  hi: {
    "Welcome to AI Chat": "एआई चैट में आपका स्वागत है",
    "Choose your preferred language": "अपनी पसंदीदा भाषा चुनें",
    "Talk to your assistant": "अपने सहायक से बात करें",
    Login: "लॉग इन करें",
    "Sign Up": "साइन अप करें",
    "Phone number": "फोन नंबर",
    Password: "पासवर्ड",
    "Confirm password": "पासवर्ड की पुष्टि करें",
    "Choose language": "भाषा चुनें",
    "AI Chat": "एआई चैट",
    "Type a message...": "एक संदेश टाइप करें...",
    Send: "भेजें",
    Logout: "लॉग आउट",
    "Toggle theme": "थीम बदलें",
    "Phone number required": "फोन नंबर आवश्यक है",
    "Password required": "पासवर्ड आवश्यक है",
    "Passwords do not match": "पासवर्ड मेल नहीं खाते",
    Continue: "जारी रखें",
    "Hello! I'm your AI assistant. How can I help you today?":
      "नमस्ते! मैं आपका एआई सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?",
  },
  // Bengali translations
  bn: {
    "Welcome to AI Chat": "AI চ্যাটে স্বাগতম",
    "Choose your preferred language": "আপনার পছন্দের ভাষা বেছে নিন",
    "Talk to your assistant": "আপনার সহায়কের সাথে কথা বলুন",
    Login: "লগইন",
    "Sign Up": "সাইন আপ",
    "Phone number": "ফোন নম্বর",
    Password: "পাসওয়ার্ড",
    "Confirm password": "পাসওয়ার্ড নিশ্চিত করুন",
    "Choose language": "ভাষা বেছে নিন",
    "AI Chat": "AI চ্যাট",
    "Type a message...": "একটি বার্তা টাইপ করুন...",
    Send: "পাঠান",
    Logout: "লগআউট",
    "Toggle theme": "থিম পরিবর্তন করুন",
    "Phone number required": "ফোন নম্বর প্রয়োজন",
    "Password required": "পাসওয়ার্ড প্রয়োজন",
    "Passwords do not match": "পাসওয়ার্ড মিলছে না",
    Continue: "চালিয়ে যান",
    "Hello! I'm your AI assistant. How can I help you today?":
      "হ্যালো! আমি আপনার AI সহায়ক। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?",
  },
  // Tamil translations
  ta: {
    "Welcome to AI Chat": "AI அரட்டைக்கு வரவேற்கிறோம்",
    "Choose your preferred language":
      "உங்கள் விருப்பமான மொழியைத் தேர்ந்தெடுக்கவும்",
    "Talk to your assistant": "உங்கள் உதவியாளருடன் பேசுங்கள்",
    Login: "உள்நுழைய",
    "Sign Up": "பதிவு செய்க",
    "Phone number": "தொலைபேசி எண்",
    Password: "கடவுச்சொல்",
    "Confirm password": "கடவுச்சொல்லை உறுதிப்படுத்தவும்",
    "Choose language": "மொழியைத் தேர்ந்தெடுக்கவும்",
    "AI Chat": "AI அரட்டை",
    "Type a message...": "ஒரு செய்தியை தட்டச்சு செய்யுங்கள்...",
    Send: "அனுப்பு",
    Logout: "வெளியேறு",
    "Toggle theme": "தீம் மாற்று",
    "Phone number required": "தொலைபேசி எண் தேவை",
    "Password required": "கடவுச்சொல் தேவை",
    "Passwords do not match": "கடவுச்சொற்கள் பொருந்தவில்லை",
    Continue: "தொடர்க",
    "Hello! I'm your AI assistant. How can I help you today?":
      "வணக்கம்! நான் உங்கள் AI உதவியாளர். இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?",
  },
  // Add more languages as needed...
};

// Simulate Google Cloud Translate API
export async function translateText(
  texts,
  targetLanguage,
  sourceLanguage = "en",
) {
  // Simulate API delay
  await new Promise((resolve) =>
    setTimeout(resolve, 500 + Math.random() * 1000),
  );

  // Mock translation logic
  if (targetLanguage === "en" || targetLanguage === sourceLanguage) {
    return texts; // Return original if English or same language
  }

  const translations = mockTranslations[targetLanguage] || {};

  return texts.map((text) => {
    // Return translation if available, otherwise return original text
    return translations[text] || text;
  });
}

// API endpoint handler (for Vite dev server)
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { texts, targetLanguage, sourceLanguage = "en" } = req.body;

    if (!texts || !Array.isArray(texts)) {
      return res.status(400).json({ error: "Invalid texts array" });
    }

    if (!targetLanguage) {
      return res.status(400).json({ error: "Target language is required" });
    }

    const translations = await translateText(
      texts,
      targetLanguage,
      sourceLanguage,
    );

    res.status(200).json({ translations });
  } catch (error) {
    console.error("Translation API error:", error);
    res.status(500).json({ error: "Translation failed" });
  }
}
