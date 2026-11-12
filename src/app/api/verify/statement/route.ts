// GET  /api/verify/statement?token=...  -> validates the gated link
// POST /api/verify/statement            -> stores the problem statement
//
// Public endpoints (the registrant is not signed in yet), protected by the
// single-use token emailed to them. All writes use the service role after the
// token has been validated server-side.
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { isHighRiskCountry } from "@/lib/verification";

export const dynamic = "force-dynamic";

const MIN_STATEMENT_LENGTH = 200;

type ProfileRow = {
  id: string;
  full_name: string | null;
  phone: string | null;
  is_approved: boolean | null;
  email_verified: boolean | null;
  phone_verified: boolean | null;
  verification_status: string | null;
  verification_token: string | null;
  token_expires_at: string | null;
  registration_country_code: string | null;
};

type PostBody = {
  token?: unknown;
  fullName?: unknown;
  phone?: unknown;
  email?: unknown;
  problemStatement?: unknown;
};

async function loadByToken(token: string) {
  return supabaseAdmin
    .from("profiles")
    .select(
      "id, full_name, phone, is_approved, email_verified, phone_verified, verification_status, verification_token, token_expires_at, registration_country_code",
    )
    .eq("verification_token", token)
    .maybeSingle<ProfileRow>();
}

function tokenError(
  profile: ProfileRow | null,
  error: { code?: string; message?: string } | null,
): { status: number; message: string } | null {
  if (error) {
    const migrationRequired =
      error.code === "42703" ||
      error.code === "PGRST204" ||
      /column|schema cache/i.test(error.message ?? "");
    return {
      status: 500,
      message: migrationRequired
        ? "Verification is not available yet. Please contact support."
        : "Could not verify this link. Please try again later.",
    };
  }

  if (!profile) {
    return { status: 404, message: "This verification link is invalid." };
  }

  if (!profile.token_expires_at) {
    return { status: 410, message: "This verification link has expired." };
  }

  if (new Date(profile.token_expires_at).getTime() <= Date.now()) {
    return { status: 410, message: "This verification link has expired." };
  }

  if (profile.is_approved) {
    return {
      status: 409,
      message: "This account has already been approved.",
    };
  }

  if (profile.verification_status === "rejected") {
    return {
      status: 409,
      message: "This account request is closed. Please contact support.",
    };
  }

  return null;
}

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token")?.trim() ?? "";
  if (!token) {
    return NextResponse.json(
      { valid: false, error: "Missing token." },
      { status: 400 },
    );
  }

  const { data: profile, error } = await loadByToken(token);
  const invalid = tokenError(profile, error);
  if (invalid || !profile) {
    return NextResponse.json(
      { valid: false, error: invalid?.message ?? "Invalid link." },
      { status: invalid?.status ?? 404 },
    );
  }

  const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(
    profile.id,
  );

  const highRisk = isHighRiskCountry(profile.registration_country_code);

  return NextResponse.json({
    valid: true,
    fullName: profile.full_name ?? "",
    email: authUser?.user?.email ?? "",
    phone: profile.phone ?? "",
    expiresAt: profile.token_expires_at,
    status: profile.verification_status,
    highRisk,
    phoneVerified: !!profile.phone_verified,
    requirePhoneVerification: highRisk && !profile.phone_verified,
    minStatementLength: MIN_STATEMENT_LENGTH,
  });
}

export async function POST(req: Request) {
  let body: PostBody;
  try {
    body = (await req.json()) as PostBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const token = typeof body.token === "string" ? body.token.trim() : "";
  const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const problemStatement =
    typeof body.problemStatement === "string"
      ? body.problemStatement.trim()
      : "";

  if (!token) {
    return NextResponse.json({ error: "Missing token." }, { status: 400 });
  }

  if (!fullName || !phone || !email) {
    return NextResponse.json(
      { error: "Full name, phone and email are required." },
      { status: 400 },
    );
  }

  if (problemStatement.length < MIN_STATEMENT_LENGTH) {
    return NextResponse.json(
      {
        error: `Please describe your matter in at least ${MIN_STATEMENT_LENGTH} characters.`,
      },
      { status: 400 },
    );
  }

  const { data: profile, error } = await loadByToken(token);
  const invalid = tokenError(profile, error);
  if (invalid || !profile) {
    return NextResponse.json(
      { error: invalid?.message ?? "Invalid link." },
      { status: invalid?.status ?? 404 },
    );
  }

  // Layer 5: higher-risk registrations must have a verified phone first.
  if (
    isHighRiskCountry(profile.registration_country_code) &&
    !profile.phone_verified
  ) {
    return NextResponse.json(
      {
        error:
          "Phone verification is required for this registration. Please contact support to complete SMS/WhatsApp verification before submitting.",
        code: "PHONE_VERIFICATION_REQUIRED",
      },
      { status: 403 },
    );
  }

  // The email must match the account this token was issued for.
  const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(
    profile.id,
  );
  const accountEmail = authUser?.user?.email ?? "";
  if (
    accountEmail &&
    accountEmail.toLowerCase() !== email.toLowerCase()
  ) {
    return NextResponse.json(
      { error: "This email does not match the registered account." },
      { status: 400 },
    );
  }

  const { data: updated, error: updateError } = await supabaseAdmin
    .from("profiles")
    .update({
      full_name: fullName,
      phone,
      problem_statement: problemStatement,
      statement_submitted_at: new Date().toISOString(),
      verification_status: "statement_received",
      verification_token: null,
      token_expires_at: null,
    })
    .eq("id", profile.id)
    .eq("verification_token", token)
    .select("id")
    .maybeSingle();

  if (updateError) {
    return NextResponse.json(
      { error: "Could not save your statement. Please try again." },
      { status: 500 },
    );
  }

  if (!updated) {
    return NextResponse.json(
      { error: "This link has already been used." },
      { status: 409 },
    );
  }

  return NextResponse.json({ ok: true });
}
