// POST /api/auth/otp/send
// body: { method: "email" | "sms", identifier: string }
// identifier is an email address when method is "email", or an
// E.164-ish phone number when method is "sms". Sends the code via
// Authentica; does not touch Supabase at all.
import { NextRequest, NextResponse } from "next/server";
import { sendOtp } from "@/lib/authentica";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { method, identifier } = body as { method?: "email" | "sms"; identifier?: string };

  if (!method || !identifier) {
    return NextResponse.json({ error: "method and identifier are required." }, { status: 400 });
  }

  const result = await sendOtp(
    method === "email" ? { email: identifier, method: "email" } : { phone: identifier, method: "sms" },
  );

  if (!result.success) {
    return NextResponse.json({ error: result.error ?? "Failed to send code." }, { status: 502 });
  }

  return NextResponse.json({ sent: true });
}
