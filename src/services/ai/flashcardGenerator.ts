import { GEMINI_API_KEY } from "../../config/env";

export interface Flashcard {
  front: string;
  back: string;
}

export async function generateFlashcards(
  subject: string,
  topic: string | undefined,
  numCards: number
): Promise<Flashcard[]> {
  try {
    const topicText = topic ? ` specifically about ${topic}` : "";
    const prompt = `Generate exactly ${numCards} educational flashcards for the subject: ${subject}${topicText}.

Each flashcard should have:
- front: A question, term, or concept to learn
- back: The answer, definition, or explanation

Return ONLY a valid JSON array with this structure:
[
  {
    "front": "Question or term here",
    "back": "Answer or explanation here"
  }
]

Make the flashcards educational, clear, and appropriate for studying. Cover different aspects of the topic.`;

    console.log("Generating flashcards with Gemini API...");

    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`,
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
                  text: prompt,
                },
              ],
            },
          ],
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API error response:", errorText);
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("API response received");
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!text) {
      console.error("No text in API response:", data);
      throw new Error("No content received from API");
    }

    // Clean up markdown code blocks
    let cleanedText = text.trim();
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText
        .replace(/^```json\s*/, "")
        .replace(/```\s*$/, "");
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/^```\s*/, "").replace(/```\s*$/, "");
    }

    console.log("Parsing flashcards...");
    const flashcards: Flashcard[] = JSON.parse(cleanedText);

    if (!Array.isArray(flashcards) || flashcards.length === 0) {
      throw new Error("Invalid flashcard format received");
    }

    console.log(`Successfully generated ${flashcards.length} flashcards`);
    return flashcards;
  } catch (error: any) {
    console.error("Error generating flashcards:", error);

    // Check if it's a timeout or network error
    if (error.name === "AbortError") {
      throw new Error(
        "Request timeout. Please check your internet connection and try again."
      );
    }

    if (
      error.message?.includes("Failed to fetch") ||
      error.message?.includes("Network")
    ) {
      throw new Error("Network error. Please check your internet connection.");
    }

    // For other errors, return fallback flashcards
    console.log("Returning fallback flashcards");
    return generateFallbackFlashcards(subject, numCards);
  }
}

function generateFallbackFlashcards(
  subject: string,
  numCards: number
): Flashcard[] {
  const fallback: Flashcard[] = [
    {
      front: `What is the main focus of ${subject}?`,
      back: `${subject} is a field of study that explores various concepts and principles.`,
    },
    {
      front: `Why is ${subject} important?`,
      back: `${subject} helps us understand fundamental concepts and apply them in practical situations.`,
    },
    {
      front: `Name a key concept in ${subject}`,
      back: `There are many important concepts in ${subject} that form the foundation of the subject.`,
    },
  ];

  return fallback.slice(0, Math.min(numCards, fallback.length));
}
