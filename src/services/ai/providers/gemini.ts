import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY } from "../../../config/env";

// Get API key from config
const API_KEY = GEMINI_API_KEY;
const genAI = new GoogleGenAI({ apiKey: API_KEY });

export async function askGemini(
  prompt: string,
  model = "gemini-1.5-flash"
): Promise<string> {
  try {
    // Check if using placeholder key
    if (API_KEY.includes("Dummy") || API_KEY === "your_gemini_key") {
      return (
        "⚠️ Please configure your Gemini API key in the .env file.\n\nGet your free API key from: https://makersuite.google.com/app/apikey\n\nMock answer for: " +
        prompt +
        " " +
        API_KEY
      );
    }

    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    // const response = await result.response;
    const text = result.text;

    return text || "No response generated.";
  } catch (error: any) {
    console.error("Gemini error:", error);

    if (error.message?.includes("API key")) {
      return "❌ Invalid API key. Please check your Gemini API key in .env file.\n\nGet your key from: https://makersuite.google.com/app/apikey";
    }

    if (error.message?.includes("quota")) {
      return "❌ API quota exceeded. Please check your Gemini API usage limits.";
    }

    return `Error: ${error.message || "Failed to generate answer with Gemini"}`;
  }
}
