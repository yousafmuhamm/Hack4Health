import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest){
  try{
    const { messages } = await req.json();

    // --- Replace with your preferred OpenAI SDK call ---
    const apiKey = process.env.OPENAI_API_KEY;
    if(!apiKey) {
      // Dev fallback so the UI still works
      return NextResponse.json({ reply: "Chat is not configured yet. Add OPENAI_API_KEY to .env and deploy." });
    }

    // Minimal fetch call (no SDK) — uses Responses API compatible models
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a friendly medical navigation helper. Give clear, non-diagnostic guidance and red-flag warnings. Keep answers short." },
          ...messages
        ],
        temperature: 0.3
      })
    });
    const data = await r.json();
    const reply = data.choices?.[0]?.message?.content ?? "…";
    return NextResponse.json({ reply });
  }catch(e){
    return NextResponse.json({ reply: "Sorry, something went wrong." }, { status: 500 });
  }
}
