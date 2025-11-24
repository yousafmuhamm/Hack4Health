// app/api/debug-env/route.ts
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const key = process.env.OPENAI_API_KEY;

  return new Response(
    JSON.stringify({
      hasKey: !!key,
      length: key?.length || 0,
      // remove this line if you don't want to see any part of the key:
      prefix: key ? key.slice(0, 4) : null,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
