import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY } from "../../config/env";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export async function generateQuiz(
  topic: string,
  difficulty: string = "medium",
  numQuestions: number = 5
): Promise<QuizQuestion[]> {
  try {
    const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    // const model = genAI.({ model: "gemini-2.0-flash-exp" });

    const prompt = `Generate ${numQuestions} multiple choice quiz questions about "${topic}" with ${difficulty} difficulty level.

For each question, provide:
1. The question text
2. Four answer options (A, B, C, D)
3. The correct answer (indicate which option letter is correct)

Format your response EXACTLY as valid JSON array like this:
[
  {
    "question": "What is...",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0
  }
]

Where correctAnswer is the index (0-3) of the correct option.
Make questions educational and clear. Ensure only ONE response in valid JSON format.`;

    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    // const response = await result.response;
    let text = result.text;

    // Clean up markdown code blocks if present
    text = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    // Parse JSON
    const questions: QuizQuestion[] = JSON.parse(text);

    // Validate structure
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("Invalid quiz format");
    }

    return questions.slice(0, numQuestions);
  } catch (error: any) {
    console.error("Quiz generation error:", error);

    // Return fallback demo quiz
    return [
      {
        question: `What is the capital of France?`,
        options: ["London", "Berlin", "Paris", "Madrid"],
        correctAnswer: 2,
      },
      {
        question: `What is 2 + 2?`,
        options: ["3", "4", "5", "6"],
        correctAnswer: 1,
      },
      {
        question: `Which planet is known as the Red Planet?`,
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctAnswer: 1,
      },
      {
        question: `Who wrote "Romeo and Juliet"?`,
        options: [
          "Charles Dickens",
          "William Shakespeare",
          "Jane Austen",
          "Mark Twain",
        ],
        correctAnswer: 1,
      },
      {
        question: `What is the largest ocean on Earth?`,
        options: ["Atlantic", "Indian", "Arctic", "Pacific"],
        correctAnswer: 3,
      },
    ];
  }
}
