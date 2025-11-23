// app/api/triage/route.ts
import { NextRequest } from "next/server";
import { getOpenAIClient } from "@/lib/openai";

type TriageResponse = {
  urgency: "emergency" | "urgent" | "soon" | "routine";
  recommendedCare:
    | "ER"
    | "URGENT_CARE"
    | "WALK_IN"
    | "FAMILY_DOCTOR"
    | "SELF_CARE";
  summary: string; // short explanation to show in UI
  advice: string; // patient-facing text
};

// 🚑 Safe fallback used when OpenAI or JSON parsing fails
const SAFE_FALLBACK: TriageResponse = {
  urgency: "emergency",
  recommendedCare: "ER",
  summary:
    "There was a technical problem analyzing your symptoms, so we are defaulting to the safest option.",
  advice:
    "Because we cannot reliably analyze your symptoms right now, please call emergency services (911) or go to the nearest emergency department if you feel very unwell or are worried. This tool does not replace a doctor.",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { age, symptoms, onset, severity, redFlags, messages } = body;

    const client = getOpenAIClient();

    // If there is no API key in this environment, immediately return safe fallback
    if (!client) {
      return new Response(JSON.stringify(SAFE_FALLBACK), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

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

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0,
      messages: chatMessages,
    });

    const raw = completion.choices[0].message.content ?? "";

    // 🧹 Try to extract the JSON part even if the model adds extra text
    let jsonText = raw;
    const firstBrace = raw.indexOf("{");
    const lastBrace = raw.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1) {
      jsonText = raw.slice(firstBrace, lastBrace + 1);
    }

    let parsed: TriageResponse;

    try {
      parsed = JSON.parse(jsonText);

      // quick validation of shape
      const validUrgency = ["emergency", "urgent", "soon", "routine"];
      const validCare = [
        "ER",
        "URGENT_CARE",
        "WALK_IN",
        "FAMILY_DOCTOR",
        "SELF_CARE",
      ];

      if (
        !validUrgency.includes(parsed.urgency) ||
        !validCare.includes(parsed.recommendedCare) ||
        typeof parsed.summary !== "string" ||
        typeof parsed.advice !== "string"
      ) {
        throw new Error("Invalid triage JSON shape");
      }
    } catch (e) {
      console.error("Failed to parse AI JSON:", raw, e);
      parsed = SAFE_FALLBACK;
    }

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Triage API error:", err);
    // Final safety net: still return valid JSON, not a 500 HTML page
    return new Response(JSON.stringify(SAFE_FALLBACK), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}
