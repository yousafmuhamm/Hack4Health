// app/api/debug-env2/route.ts
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const allKeys = Object.keys(process.env || {});
  const matches = allKeys.filter((k) => k.toLowerCase().includes("openai"));

  return new Response(
    JSON.stringify({
      matches,
      entries: matches.map((k) => ({
        key: k,
        prefix: (process.env[k] || "").slice(0, 4),
        length: process.env[k]?.length || 0,
      })),
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
