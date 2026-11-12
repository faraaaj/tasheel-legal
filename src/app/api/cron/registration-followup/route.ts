import { NextResponse, type NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendOtp } from "@/lib/authentica";

// Runs on a schedule (see vercel.json). For anyone who registered but never
// finished email+phone OTP verification within 48 hours, resend whichever
// code(s) are still outstanding, once, so they can pick up where they left
// off. Marks followup_sent_at so we never nag the same person twice.
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const expected = process.env.CRON_SECRET ? `Bearer ${process.env.CRON_SECRET}` : null;

  if (!expected || authHeader !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

  const { data: stragglers, error } = await supabaseAdmin
    .from("profiles")
    .select("id, email, phone, email_verified, phone_verified, created_at")
    .is("followup_sent_at", null)
    .lte("created_at", cutoff)
    .or("email_verified.eq.false,phone_verified.eq.false");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const results: Array<{ id: string; emailSent: boolean; phoneSent: boolean }> = [];

  for (const row of stragglers ?? []) {
    let emailSent = false;
    let phoneSent = false;

    if (!row.email_verified && row.email) {
      const res = await sendOtp({ email: row.email, method: "email" });
      emailSent = res.success;
    }

    if (!row.phone_verified && row.phone) {
      const res = await sendOtp({ phone: row.phone, method: "sms" });
      phoneSent = res.success;
    }

    await supabaseAdmin
      .from("profiles")
      .update({ followup_sent_at: new Date().toISOString() })
      .eq("id", row.id);

    results.push({ id: row.id, emailSent, phoneSent });
  }

  return NextResponse.json({ checked: stragglers?.length ?? 0, results });
}
