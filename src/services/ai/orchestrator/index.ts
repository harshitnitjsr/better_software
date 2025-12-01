import { askGemini } from "../providers/gemini";

export async function askAI(
  question: string,
  provider = "gemini"
): Promise<string> {
  // Stub orchestrator: route to different providers based on config
  if (provider === "gemini") {
    return await askGemini(question);
  }
  // Add OpenAI, Groq, Ollama here
  return "Provider not configured.";
}
