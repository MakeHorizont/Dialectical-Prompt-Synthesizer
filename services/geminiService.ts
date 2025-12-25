
import { GoogleGenAI } from "@google/genai";
import { PromptFormat, LanguageCode } from "../types";

// Always use named parameter for apiKey and use process.env.API_KEY directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates an analytical review and improved version using systemic reasoning.
 * Complex Text Task: Use gemini-3-pro-preview.
 */
export const generateAntithesis = async (concept: string, targetLang: LanguageCode): Promise<string> => {
  if (!concept.trim()) return "";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `You are a professional system analyst and expert prompt architect. 
      Analyze the following prompt concept. 
      1. Identify missing parameters, logical inconsistencies, and structural weaknesses.
      2. Provide a significantly more detailed, robust, and structurally sound version that addresses all identified gaps.
      
      The input might be in any language, but you MUST write the Output Refined Prompt in this language: "${targetLang}".

      Concept: "${concept}"
      
      Return ONLY the refined prompt text in ${targetLang}. Do not include your reasoning or meta-talk.`,
    });
    return response.text || "Error generating analytical review.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error contacting intelligence source.";
  }
};

/**
 * Integrates initial and refined versions into a structured systemic prompt.
 * Complex Text Task: Use gemini-3-pro-preview.
 */
export const generateSynthesis = async (
  sourcePrompt: string, 
  format: PromptFormat, 
  targetLang: LanguageCode, 
  refinement?: string,
  initialContext?: string,
  analysisContext?: string
): Promise<string> => {
  if (!sourcePrompt.trim()) return "";

  // Formatting instructions based on format parameter
  let specificFormatInstruction = `Format this content strictly as ${format}.`;
  
  if (format === PromptFormat.TYPESCRIPT) {
    specificFormatInstruction = `
      Format the content as a TypeScript Module containing an interface AND a constant object implementing that interface.
      
      CRITICAL REQUIREMENT: 
      1. Define the Interface (e.g., interface PromptSystem { ... }).
      2. IMMEDIATELY follow it with a 'const' variable (e.g., const systemConfig: PromptSystem = { ... }) that contains the ACTUAL CREATIVE CONTENT of the prompt.
      3. Do NOT just write 'string' for the values. Fill the strings with the detailed prompt text.
    `;
  }

  let promptContent = "";

  if (refinement) {
    // OPTIMIZATION MODE
    promptContent = `
    ROLE: You are an expert system architect and infrastructure engineer.
    TASK: Optimize the "Current Draft" based on the "Update Request" and the "Project History".

    === PROJECT HISTORY ===
    1. Initial Concept: "${initialContext || 'N/A'}"
    2. Analytical Review: "${analysisContext || 'N/A'}"
    
    === CURRENT DRAFT ===
    "${sourcePrompt}"

    === UPDATE REQUEST ===
    "${refinement}"

    === OUTPUT INSTRUCTION ===
    1. Apply the update request to the Current Draft, ensuring all structural improvements from history are preserved.
    2. ${specificFormatInstruction}
    3. The Final Output MUST be in the language: "${targetLang}".
    4. Return ONLY the code/formatted text.
    `;
  } else {
    // INITIAL SYSTEMIC INTEGRATION
    promptContent = `
    Content: "${sourcePrompt}". 
    Task: ${specificFormatInstruction}
    IMPORTANT: The Final Output MUST be in the language: "${targetLang}".
    `;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: promptContent,
    });
    return response.text || "Error generating systemic prompt.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error synthesizing prompt.";
  }
};

/**
 * Fallback translation using Gemini for high-quality semantic accuracy.
 * Basic Text Task: Use gemini-3-flash-preview.
 */
export const translateWithGemini = async (text: string, targetLang: string): Promise<string | null> => {
    if (!text.trim()) return null;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Translate the following text strictly into ${targetLang}. Return ONLY the translated text, no explanations, no wrappers, no markdown. Text: "${text}"`
        });
        const result = response.text?.trim();
        if (!result || result.startsWith("Error")) return null;
        return result;
    } catch (e) {
        console.error("Gemini Translation Fallback Error", e);
        return null;
    }
}
