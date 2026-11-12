// POST /api/admin/users/ai-research
// Layer 3: simulated OSINT / KYC screening.
//
// No external KYC provider is configured yet, so this returns a deterministic
// mock score derived from the signals already captured at registration. The
// response is explicitly marked `simulated` and the summary says so, so an
// admin can never mistake it for a real sanctions/watchlist check.
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { USER_MANAGEMENT_ROLES, isSuperAdmin, SUPERADMIN_PROTECTED_MESSAGE } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { isHighRiskCountry } from "@/lib/verification";

export const dynamic = "force-dynamic";

type Body = { userId?: unknown };

export async function POST(req: Request) {
  const guard = await requireAdmin(req, USER_MANAGEMENT_ROLES);
  if (!guard.ok) return guard.response;

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const userId = typeof body.userId === "string" ? body.userId : "";
  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (profileError) {
    return NextResponse.json(
      { error: "Could not load user", detail: profileError.message },
      { status: 500 },
    );
  }

  if (!profile) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (isSuperAdmin(profile.role)) {
    return NextResponse.json(
      { error: SUPERADMIN_PROTECTED_MESSAGE },
      { status: 403 },
    );
  }

  const highRisk = isHighRiskCountry(profile.registration_country_code);

  const signals: string[] = [];
  let score = 55;

  if (profile.email_verified) {
    score += 10;
    signals.push("email verified");
  } else {
    signals.push("email not verified");
  }

  if (profile.phone_verified) {
    score += 10;
    signals.push("phone verified");
  } else {
    signals.push("phone not verified");
  }

  if (profile.registration_country_code) {
    if (highRisk) {
      signals.push(`higher-risk registration country (${profile.registration_country_code})`);
    } else {
      score += 10;
      signals.push(`registration country ${profile.registration_country_code}`);
    }
  } else {
    signals.push("registration country unknown");
  }

  if (profile.linkedin_url) {
    score += 5;
    signals.push("LinkedIn profile on file");
  }

  if (
    typeof profile.problem_statement === "string" &&
    profile.problem_statement.trim().length >= 200
  ) {
    score += 5;
    signals.push("problem statement provided");
  }

  if (profile.device_fingerprint && typeof profile.device_fingerprint === "object") {
    const fingerprint = profile.device_fingerprint as Record<string, unknown>;
    if (fingerprint.webdriver === true) {
      score -= 30;
      signals.push("automation marker detected (navigator.webdriver)");
    }
  }

  score = Math.max(0, Math.min(100, score));

  const summary =
    `Simulated OSINT result (no external KYC provider configured). ` +
    `Signals: ${signals.join("; ")}. ` +
    `No sanctions/watchlist lookup was performed.`;

  const { error: updateError } = await supabaseAdmin
    .from("profiles")
    .update({
      ai_research_score: score,
      ai_research_summary: summary,
      ai_researched_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (updateError) {
    const migrationRequired =
      updateError.code === "42703" ||
      updateError.code === "PGRST204" ||
      /column|schema cache/i.test(updateError.message);

    return NextResponse.json(
      {
        error: migrationRequired
          ? "Database migration required: run supabase/migrations/20261113_verification_workflow.sql."
          : "Could not save the research result.",
        detail: updateError.message,
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    score,
    summary,
    signals,
    simulated: true,
  });
}
