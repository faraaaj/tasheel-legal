// POST /api/admin/users/request-statement
// Generates an expiring, single-use token and emails the user a link to the
// gated problem-statement form. The link is also returned to the admin UI so
// it can be copied manually when no email provider is configured.
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { USER_MANAGEMENT_ROLES, isSuperAdmin, SUPERADMIN_PROTECTED_MESSAGE } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendStatementRequestEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

const TOKEN_TTL_DAYS = 7;

type Body = { userId?: unknown; locale?: unknown };

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
  const locale = body.locale === "ar" ? "ar" : "en";

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("id, full_name, is_approved, role")
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

  if (profile.is_approved) {
    return NextResponse.json(
      { error: "This account is already approved." },
      { status: 400 },
    );
  }

  const token = randomUUID();
  const expiresAt = new Date(
    Date.now() + TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
  ).toISOString();

  const { error: updateError } = await supabaseAdmin
    .from("profiles")
    .update({
      verification_token: token,
      token_expires_at: expiresAt,
      verification_status: "statement_requested",
      rejection_reason: null,
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
          : "Could not create the verification link.",
        detail: updateError.message,
      },
      { status: 500 },
    );
  }

  // Prefer an explicit site URL; otherwise use the request origin so the link
  // is correct in local development as well as production.
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    new URL(req.url).origin;
  const statementUrl = `${base}/${locale}/verify/${token}`;

  let emailResult: {
    sent: boolean;
    skipped?: boolean;
    error?: string;
  } | null = null;
  try {
    const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(userId);
    const to = authUser?.user?.email;
    if (to) {
      emailResult = await sendStatementRequestEmail(
        to,
        profile.full_name ?? null,
        statementUrl,
        expiresAt,
      );
    }
  } catch (err) {
    console.error("[request-statement] email failed:", err);
  }

  return NextResponse.json({
    ok: true,
    token,
    statementUrl,
    expiresAt,
    email: emailResult,
  });
}
