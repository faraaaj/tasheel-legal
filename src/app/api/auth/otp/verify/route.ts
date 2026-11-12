// POST /api/auth/otp/verify
// body: { method: "email" | "sms", identifier: string, otp: string, userId: string }
// Verifies the code with Authentica, and on success flips the matching
// profiles flag (email_verified or phone_verified) for that user.
import { NextRequest, NextResponse } from "next/server";
import { verifyOtp } from "@/lib/authentica";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { method, identifier, otp, userId } = body as {
    method?: "email" | "sms";
    identifier?: string;
    otp?: string;
    userId?: string;
  };

  if (!method || !identifier || !otp || !userId) {
    return NextResponse.json(
      { error: "method, identifier, otp and userId are required." },
      { status: 400 },
    );
  }

  const result = await verifyOtp(method === "email" ? { email: identifier, otp } : { phone: identifier, otp });

  if (!result.verified) {
    return NextResponse.json({ error: result.error ?? "Invalid or expired code." }, { status: 400 });
  }

  const column = method === "email" ? "email_verified" : "phone_verified";
  const updatePayload: Record<string, unknown> = { [column]: true };
  if (method === "sms") updatePayload.phone = identifier;

  const { error: updateError } = await supabaseAdmin
    .from("profiles")
    .update(updatePayload)
    .eq("id", userId);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ verified: true });
}
