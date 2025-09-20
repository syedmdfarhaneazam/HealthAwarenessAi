//to flatten nested objects for translation
function flattenObject(obj, prefix = "") {
  const flattened = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (typeof obj[key] === "object" && obj[key] !== null) {
        Object.assign(flattened, flattenObject(obj[key], newKey));
      } else {
        flattened[newKey] = obj[key];
      }
    }
  }

  return flattened;
}

//to unflatten object back to nested structure
function unflattenObject(flattened) {
  const result = {};

  for (const key in flattened) {
    if (flattened.hasOwnProperty(key)) {
      const keys = key.split(".");
      let current = result;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = flattened[key];
    }
  }

  return result;
}

//translation function
export async function translateDisplay(displayObject, targetLang) {
  try {
    //if translations are cached in localStorage
    const cacheKey = `translations_${targetLang}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      try {
        const parsedCache = JSON.parse(cached);
        //cache structure matches current display object
        if (parsedCache && typeof parsedCache === "object") {
          return parsedCache;
        }
      } catch (e) {
        console.warn("Failed to parse cached translations, fetching new ones");
        localStorage.removeItem(cacheKey);
      }
    }

    //flatten the display object for translation
    const flattened = flattenObject(displayObject);
    const textsToTranslate = Object.values(flattened);

    // call the backend translation API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch("/api/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        texts: textsToTranslate,
        targetLanguage: targetLang,
        sourceLanguage: "en",
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`);
    }

    const { translations } = await response.json();

    if (!translations || !Array.isArray(translations)) {
      throw new Error("Invalid translation response format");
    }

    const translatedFlattened = {};
    const keys = Object.keys(flattened);

    translations.forEach((translation, index) => {
      translatedFlattened[keys[index]] = translation || keys[index]; // Fallback to original key
    });

    const translatedObject = unflattenObject(translatedFlattened);

    const cacheData = {
      data: translatedObject,
      timestamp: Date.now(),
      expiry: 24 * 60 * 60 * 1000,
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));

    return translatedObject;
  } catch (error) {
    console.error("Translation error:", error);

    const cacheKey = `translations_${targetLang}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsedCache = JSON.parse(cached);
        if (parsedCache.data) {
          console.warn("Using expired cached translations as fallback");
          return parsedCache.data;
        }
      } catch (e) {}
    }

    return null; //to use English fallback
  }
}

export const languageMap = {
  english: "en",
  hindi: "hi",
  bengali: "bn",
  telugu: "te",
  marathi: "mr",
  tamil: "ta",
  gujarati: "gu",
  urdu: "ur",
  kannada: "kn",
  odia: "or",
  punjabi: "pa",
  malayalam: "ml",
};

// get language code from language name
export function getLanguageCode(languageName) {
  return languageMap[languageName.toLowerCase()] || "en";
}

// get language name from code
export function getLanguageName(languageCode) {
  const entry = Object.entries(languageMap).find(
    ([, code]) => code === languageCode,
  );
  return entry ? entry[0] : "english";
}
