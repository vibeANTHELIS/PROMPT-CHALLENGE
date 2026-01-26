import { GoogleGenAI, Type } from "@google/genai";
import { Language } from "../types";

// Helper to get safe API client
const getAiClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("VITE_GEMINI_API_KEY not found in environment.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const translateText = async (
  text: string,
  targetLang: Language = 'en'
): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "[Simulation] Translation (API Key Missing)";

  try {
    const prompt = `Translate the following text to ${targetLang === 'en' ? 'English' : targetLang}. 
    Only return the translated text. Do not add explanations.
    Text: "${text}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text?.trim() || text;
  } catch (error) {
    console.error("Translation error:", error);
    return text; // Fallback to original
  }
};

export const extractListingDetails = async (text: string): Promise<any> => {
  const ai = getAiClient();
  if (!ai) {
    // Mock fallback for simulation if no API key
    return {
      item: "Unknown Item",
      quantity: "Unknown Qty",
      price: 0,
      description: text,
      category: "Other"
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Extract the item name, quantity, price (numeric only), category (Vegetables, Fruits, Grains, or Other) and a short description from the following text.
      Return JSON.
      Text: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            item: { type: Type.STRING },
            quantity: { type: Type.STRING },
            price: { type: Type.NUMBER },
            description: { type: Type.STRING },
            category: { type: Type.STRING, enum: ["Vegetables", "Fruits", "Grains", "Other"] },
          },
          required: ["item", "price", "category"]
        }
      }
    });

    const jsonStr = response.text?.trim();
    if (jsonStr) {
      return JSON.parse(jsonStr);
    }
  } catch (error) {
    console.error("Extraction error:", error);
  }
  return null;
};

export const getMarketInsight = async (item: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "Market conditions appear stable based on historical data.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Give a one sentence market insight for ${item} prices in Indian wholesale markets today. Keep it concise.`,
    });
    return response.text?.trim() || "Market data unavailable.";
  } catch (error) {
    return "Market data unavailable.";
  }
};