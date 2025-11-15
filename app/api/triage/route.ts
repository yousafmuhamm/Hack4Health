import { NextRequest } from "next/server";
import {openai} from "@/lib/openai";

type TriageResponse = {
      urgency: "emergency" | "urgent" | "soon" | "routine";
  recommendedCare: "ER" | "URGENT_CARE" | "WALK_IN" | "FAMILY_DOCTOR" | "SELF_CARE";
  summary: string; // short explanation to show in UI
  advice: string;  // patient-facing text
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { age, symptoms, onset, severity, redFlags, messages } = body;

    // `messages` = optional chat history array from the UI, like:
    // [{ role: "user", content: "..." }, { role: "assistant", content: "..." }, ...]
    // For now we’ll just use a single-turn if none is provided.

    const userDescription = `
Age: ${age}
Symptoms: ${symptoms}
Onset: ${onset}
Severity: ${severity}
Red-flag symptoms reported: ${redFlags ? "yes" : "no"}
    `.trim();

    const chatMessages = [
      {
        role: "system" as const,
        content: `
You are a cautious triage assistant for a healthcare navigation app in Canada.

CRITICAL RULES:
- You are NOT a doctor and do NOT give diagnoses.
- If there are any life-threatening or red-flag symptoms
  (e.g. severe chest pain, trouble breathing, stroke signs, major trauma,
  suicidal thoughts, severe bleeding, very high fever in very young or very old),
  you MUST recommend calling emergency services (911) or going to the ER immediately.
- If you are unsure, err on the side of safety and choose "ER".
- Never say things like "you don't need to see a doctor" or "you are safe".
- Always remind the user this is not medical advice and they should seek care
  urgently if they feel very unwell or are worried.

Return **ONLY** valid JSON in this exact TypeScript-like shape:

{
  "urgency": "emergency" | "urgent" | "soon" | "routine",
  "recommendedCare": "ER" | "URGENT_CARE" | "WALK_IN" | "FAMILY_DOCTOR" | "SELF_CARE",
  "summary": "1–3 sentence explanation of your reasoning.",
  "advice": "friendly, patient-facing guidance including a safety disclaimer."
}
        `.trim(),
      },
      ...(Array.isArray(messages) ? messages : []),
      {
        role: "user" as const,
        content: `Here is the patient's description:\n${userDescription}\n\nPlease respond in the JSON format described.`,
      },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-5.1-mini",
      temperature: 0,
      messages: chatMessages,
    });

    const raw = completion.choices[0].message.content ?? "";

    let parsed: TriageResponse;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      console.error("Failed to parse AI JSON:", raw);
      // Fail safe toward ER
      parsed = {
        urgency: "emergency",
        recommendedCare: "ER",
        summary:
          "There was a technical problem interpreting the AI response, so we are defaulting to the safest option.",
        advice:
          "Because we cannot reliably analyze your symptoms right now, please call emergency services (911) or go to the nearest emergency department if you feel very unwell or are worried. This tool does not replace a doctor.",
      };
    }

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Triage API error:", err);
    return new Response(
      JSON.stringify({
        urgency: "emergency",
        recommendedCare: "ER",
        summary:
          "A server error occurred while trying to analyze the situation.",
        advice:
          "Because of a technical issue, we cannot safely guide you right now. If you feel very unwell, have severe symptoms, or are worried, please call 911 or go to the nearest ER immediately.",
      } as TriageResponse),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}