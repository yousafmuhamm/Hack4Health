// app/api/triage/route.ts
import { NextRequest } from "next/server";
import { openai } from "@/lib/openai";

type TriageResponse = {
  urgency: "emergency" | "urgent" | "soon" | "routine";
  recommendedCare: "ER" | "URGENT_CARE" | "WALK_IN" | "FAMILY_DOCTOR" | "SELF_CARE";
  summary: string;
  advice: string;
};

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({
          urgency: "emergency",
          recommendedCare: "ER",
          summary: "AI triage unavailable (missing API key).",
          advice: "Please seek medical help if needed."
        }),
        { status: 500 }
      );
    }

    const body = await req.json();
    const { age, symptoms, onset, severity, redFlags } = body;

    const userDescription = `
Age: ${age}
Symptoms: ${symptoms}
Onset: ${onset}
Severity: ${severity}
Red-flag symptoms: ${redFlags ? "yes" : "no"}
`.trim();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0,
      response_format: { type: "json_object" },  // ⭐ REQUIRED
      messages: [
        {
          role: "system",
          content: `
You are a cautious Canadian triage assistant. 
Return ONLY valid JSON containing:

{
  "urgency": "emergency" | "urgent" | "soon" | "routine",
  "recommendedCare": "ER" | "URGENT_CARE" | "WALK_IN" | "FAMILY_DOCTOR" | "SELF_CARE",
  "summary": "short explanation",
  "advice": "safety advice for patient"
}
          `.trim()
        },
        {
          role: "user",
          content: userDescription
        }
      ]
    });

    const raw = completion.choices[0].message.content || "{}";
    const parsed: TriageResponse = JSON.parse(raw);

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error("Triage error:", err);
    return new Response(
      JSON.stringify({
        urgency: "emergency",
        recommendedCare: "ER",
        summary: "An internal server error occurred.",
        advice: "If symptoms are severe, please seek emergency care."
      }),
      { status: 500 }
    );
  }
}
