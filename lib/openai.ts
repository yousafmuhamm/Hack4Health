// lib/openai.ts
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("[FATAL] OPENAI_API_KEY is missing in server environment.");
}

export const openai = new OpenAI({ apiKey });
