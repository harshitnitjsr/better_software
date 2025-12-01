// Use legacy API to avoid deprecation crash with Expo SDK 54
import * as FileSystem from "expo-file-system/legacy";
import { GEMINI_API_KEY } from "../../config/env";

/**
 * OCR using Google Gemini Vision API with direct REST endpoint (works in React Native)
 */
export async function recognizeImage(imageUri: string): Promise<string> {
  try {
    if (GEMINI_API_KEY === "your_gemini_key") {
      return "⚠️ Please configure your Gemini API key in .env file to use OCR.\n\nThis is a demo text extraction result.";
    }

    // Read and encode image as base64
    const imageData = await FileSystem.readAsStringAsync(imageUri, {
      encoding: "base64",
    });

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inline_data: {
                    mime_type: "image/jpeg",
                    data: imageData,
                  },
                },
                {
                  text: "Extract all text from this image. Return only the extracted text without any additional commentary or formatting.",
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      const text = data.candidates[0].content.parts[0].text;
      return text.trim();
    }

    if (data.error) {
      return `❌ API Error: ${data.error.message}`;
    }

    return "Could not extract text from image.";
  } catch (error: any) {
    console.error("OCR error:", error);

    if (error.message?.includes("API key")) {
      return "❌ Invalid Gemini API key. Please check your .env file.";
    }

    return `OCR failed: ${error.message || "Unknown error"}`;
  }
}
