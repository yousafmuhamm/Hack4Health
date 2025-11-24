// lib/openai.ts
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  // Don't crash the whole app — just log.
  console.error("❌ OPENAI_API_KEY is missing on the server.");
}

// We still create the client, but if apiKey is empty the call will fail,
// and the route.ts try/catch will handle it.
export const openai = new OpenAI({
  apiKey: apiKey ?? "",
});
