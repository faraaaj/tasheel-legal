// src/app/api/cron/ticker/route.ts
// AI-powered ticker news collector.
// TODO: Implement RSS fetching, AI analysis, and database insertion.
// For now, this is a placeholder that returns a success message.

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Ticker cron placeholder. AI news collection not yet implemented.",
    todo: [
      "Fetch RSS feeds from Saudi legal sources",
      "Filter and reframe headlines via LLM",
      "Save sanitized items to ticker_items table",
    ],
  });
}
