import dotenv from "dotenv";

export function loadOpenAIApiKey(): string {
  dotenv.config(); // Load .env file
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY in .env");
  }

  return apiKey;
}