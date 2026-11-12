import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { canManageUsers } from "@/lib/admin";
import { getAuthEmailMap } from "@/lib/admin-users";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { deriveVerificationStatus } from "@/lib/verification";

export const dynamic = "force-dynamic";

// select("*") is deliberate: it keeps this route working (with nulls) before
// the 20261113_verification_workflow migration is applied, instead of failing
// the whole table on a missing column.
export async function GET(req: Request) {
  const guard = await requireAdmin(req);
  if (!guard.ok) return guard.response;

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: "Could not load users", detail: error.message },
      { status: 500 },
    );
  }

  const emails = await getAuthEmailMap();

  const users = (data ?? []).map((profile) => {
    const status = deriveVerificationStatus(profile);
    const tokenExpiresAt =
      typeof profile.token_expires_at === "string"
        ? profile.token_expires_at
        : null;
    const tokenActive =
      !!profile.verification_token &&
      !!tokenExpiresAt &&
      new Date(tokenExpiresAt).getTime() > Date.now();

    return {
      id: profile.id,
      fullName: profile.full_name ?? null,
      email: emails.get(profile.id) ?? null,
      phone: profile.phone ?? null,
      role: profile.role ?? "client",
      isApproved: !!profile.is_approved,
      emailVerified: !!profile.email_verified,
      phoneVerified: !!profile.phone_verified,
      createdAt: profile.created_at,

      // Layer 1 analytics
      registrationIp: profile.registration_ip ?? null,
      registrationCountry: profile.registration_country ?? null,
      registrationCountryCode: profile.registration_country_code ?? null,
      registrationCity: profile.registration_city ?? null,
      registrationIsp: profile.registration_isp ?? null,
      referrer: profile.referrer ?? null,
      deviceFingerprint:
        profile.device_fingerprint &&
        typeof profile.device_fingerprint === "object"
          ? (profile.device_fingerprint as Record<string, unknown>)
          : null,

      // Workflow state
      verificationStatus: status,
      problemStatement: profile.problem_statement ?? null,
      statementSubmittedAt: profile.statement_submitted_at ?? null,
      verificationToken: tokenActive ? profile.verification_token : null,
      tokenExpiresAt: tokenActive ? tokenExpiresAt : null,
      rejectionReason: profile.rejection_reason ?? null,

      // Layer 3 AI research
      aiResearchScore:
        typeof profile.ai_research_score === "number"
          ? profile.ai_research_score
          : null,
      aiResearchSummary: profile.ai_research_summary ?? null,
      aiResearchedAt: profile.ai_researched_at ?? null,
      linkedinUrl: profile.linkedin_url ?? null,
    };
  });

  return NextResponse.json({
    users,
    viewerRole: guard.ctx.role,
    canManage: canManageUsers(guard.ctx.role),
  });
}
