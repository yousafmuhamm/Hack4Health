// lib/openai.ts
import OpenAI from "openai";

let cachedClient: OpenAI | null = null;

/**
 * Lazy OpenAI client creator.
 * - Returns null if OPENAI_API_KEY is missing.
 * - Avoids throwing at import time (which was breaking your API route in prod).
 */
export function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error(
      "[OpenAI] Missing OPENAI_API_KEY in environment. Falling back to safe triage defaults."
    );
    return null;
  }

  if (!cachedClient) {
    cachedClient = new OpenAI({ apiKey });
  }

  return cachedClient;
}
