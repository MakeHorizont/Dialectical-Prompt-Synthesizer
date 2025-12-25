import { translateWithGemini } from "./geminiService";

// Helper to check for API key exclusively from environment
const getApiKey = (): string | undefined => {
  return process.env.API_KEY;
};

const apiKey = getApiKey();

// --- PROVIDER 1: Google Cloud Official (Only works if API Key is valid) ---
const tryGoogleOfficial = async (text: string, target: string, source: string): Promise<string | null> => {
    if (!apiKey) return null;
    try {
        const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ q: text, target, source: source === 'auto' ? undefined : source, format: "text" }),
        });
        const data = await response.json();
        if (!data.error && data.data?.translations?.length > 0) {
            return data.data.translations[0].translatedText;
        }
    } catch (e) { /* ignore */ }
    return null;
};

// --- PROVIDER 2: Google GTX (Client API) - Free, Very Fast, High Quality ---
// This is the endpoint used by browser extensions.
const tryGoogleGTX = async (text: string, target: string, source: string): Promise<string | null> => {
    try {
        const sl = source === 'auto' ? 'auto' : source;
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;
        const response = await fetch(url);
        if (!response.ok) return null;
        const data = await response.json();
        // GTX returns nested arrays: [[["Translated text", "Source text", ...], ...], ...]
        if (data && data[0]) {
            return data[0].map((s: any) => s[0]).join("");
        }
    } catch (e) { console.warn("GTX failed", e); }
    return null;
};

// --- PROVIDER 3: Lingva (Google Proxy) - Privacy focused, Free ---
const tryLingva = async (text: string, target: string, source: string): Promise<string | null> => {
    try {
        const response = await fetch(`https://lingva.ml/api/v1/${source}/${target}/${encodeURIComponent(text)}`);
        if (!response.ok) return null;
        const data = await response.json();
        return data.translation || null;
    } catch (e) { /* ignore */ }
    return null;
};

// --- PROVIDER 4: SimplyTranslate (Another Proxy) ---
const trySimplyTranslate = async (text: string, target: string, source: string): Promise<string | null> => {
    try {
        // Using a reliable instance
        const url = `https://simplytranslate.org/api/translate/?engine=google&from=${source}&to=${target}&text=${encodeURIComponent(text)}`;
        const response = await fetch(url);
        if (!response.ok) return null;
        const data = await response.json();
        return data.translated_text || null;
    } catch (e) { /* ignore */ }
    return null;
};

// --- PROVIDER 5: MyMemory (Translated.net) - Translation Memory ---
const tryMyMemory = async (text: string, target: string, source: string): Promise<string | null> => {
    try {
        const pair = `${source === 'auto' ? '' : source}|${target}`;
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${pair}`;
        const response = await fetch(url);
        if (!response.ok) return null;
        const data = await response.json();
        if (data.responseStatus === 200 && data.responseData?.translatedText) {
             return data.responseData.translatedText;
        }
    } catch (e) { /* ignore */ }
    return null;
};

// --- PROVIDER 6: LibreTranslate (Public Instance) ---
const tryLibreTranslate = async (text: string, target: string, source: string): Promise<string | null> => {
    try {
        // LibreTranslate usually requires explicit source, 'auto' is flaky on some instances
        const finalSource = source === 'auto' ? 'en' : source; 
        const response = await fetch("https://de.libretranslate.com/translate", {
            method: "POST",
            body: JSON.stringify({ q: text, source: finalSource, target, format: "text" }),
            headers: { "Content-Type": "application/json" }
        });
        if (!response.ok) return null;
        const data = await response.json();
        return data.translatedText || null;
    } catch (e) { /* ignore */ }
    return null;
};


/**
 * Main Translation Orchestrator
 * Executes providers in sequence until one succeeds.
 */
export const translateText = async (text: string, targetLang: string, sourceLang: string = 'auto'): Promise<string | null> => {
  if (!text.trim()) return "";
  
  // Optimization: same lang
  if (sourceLang && sourceLang === targetLang) return text;

  // The Queue of Providers
  const providers = [
      { name: "Google Cloud", fn: tryGoogleOfficial }, // 1. Paid/Official (if key exists)
      { name: "Google GTX", fn: tryGoogleGTX },        // 2. Free, Fast (Browser API)
      { name: "Lingva", fn: tryLingva },               // 3. Robust Proxy
      { name: "SimplyTranslate", fn: trySimplyTranslate }, // 4. Robust Proxy
      { name: "MyMemory", fn: tryMyMemory },           // 5. Memory Database
      { name: "LibreTranslate", fn: tryLibreTranslate } // 6. Open Source Fallback
  ];

  for (const provider of providers) {
      const result = await provider.fn(text, targetLang, sourceLang);
      if (result) {
          return result;
      }
  }

  // --- FINAL FALLBACK: Gemini Intelligence ---
  console.warn("All traditional translation APIs failed. Requesting assistance from Gemini Intelligence.");
  return await translateWithGemini(text, targetLang);
};
