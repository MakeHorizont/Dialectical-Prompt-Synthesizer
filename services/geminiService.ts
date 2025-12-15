import { GoogleGenAI } from "@google/genai";
import { PromptFormat, LanguageCode } from "../types";

// Helper to check for API key without UI
const getApiKey = (): string | undefined => {
  // Accessing environment variable as per instructions
  // In a Vite environment, this is typically import.meta.env.VITE_API_KEY
  // or process.env.API_KEY depending on config. We check both.
  // @ts-ignore
  const apiKey = typeof process !== 'undefined' && process.env ? process.env.API_KEY : (import.meta as any).env?.VITE_API_KEY;
  return apiKey;
};

const apiKey = getApiKey();
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const generateAntithesis = async (thesis: string, targetLang: LanguageCode): Promise<string> => {
  if (!thesis.trim()) return "";

  if (!ai) {
    // Fallback/Simulation mode if no key is present
    await new Promise(resolve => setTimeout(resolve, 1500));
    return `[SIMULATED GEMINI OUTPUT - NO API KEY DETECTED]

CRITIQUE:
The initial prompt lacks specific context regarding the persona, constraints, and output format.

IMPROVED PROMPT (${targetLang}):
${thesis} (Refined)`;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a strict dialectical materialist and expert prompt engineer. 
      Analyze the following prompt (Thesis). 
      1. Identify its weaknesses.
      2. Apply dialectical negation to create a stronger, more concrete version (Antithesis).
      
      The input might be in any language, but you MUST write the Output Improved Prompt in this language: "${targetLang}".

      Thesis: "${thesis}"
      
      Return ONLY the improved Antithesis prompt text in ${targetLang}. Do not include your reasoning.`,
    });
    return response.text || "Error generating response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error contacting intelligence source.";
  }
};

export const generateSynthesis = async (sourcePrompt: string, format: PromptFormat, targetLang: LanguageCode, refinement?: string): Promise<string> => {
  if (!sourcePrompt.trim()) return "";

  if (!ai) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return `[SIMULATED SYNTHESIS - ${format}]
    
${sourcePrompt}

(Refinement applied: ${refinement || 'None'})`;
  }

  const promptContent = refinement 
    ? `Original Content: "${sourcePrompt}". 
       Refinement Request: "${refinement}". 
       Task: Refine the content based on the request, then format it strictly as ${format}.
       IMPORTANT: The Final Output MUST be in the language: "${targetLang}".`
    : `Content: "${sourcePrompt}". 
       Task: Format this content strictly as ${format}.
       IMPORTANT: The Final Output MUST be in the language: "${targetLang}".`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptContent,
    });
    return response.text || "Error generating synthesis.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error synthesizing prompt.";
  }
};

export const translateWithGemini = async (text: string, targetLang: string): Promise<string | null> => {
    if (!ai || !text.trim()) return null;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Translate the following text strictly into ${targetLang}. Return ONLY the translated text, no explanations, no wrappers, no markdown. Text: "${text}"`
        });
        const result = response.text?.trim();
        // Check if result looks like an error or is empty
        if (!result || result.startsWith("Error")) return null;
        return result;
    } catch (e) {
        console.error("Gemini Translation Fallback Error", e);
        return null;
    }
}