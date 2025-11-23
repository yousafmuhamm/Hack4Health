import { NextRequest } from "next/server";
import { openai } from "@/lib/openai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0,
      messages: [
        {
          role: "system",
          content: "Return JSON only. No extra text."
        },
        {
          role: "user",
          content: JSON.stringify(body)
        }
      ]
    });

    const raw = completion.choices[0].message.content;

    return new Response(raw, {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error("Triage API error:", err);
    return new Response(
      JSON.stringify({ error: "OpenAI request failed" }),
      { status: 500 }
    );
  }
}
