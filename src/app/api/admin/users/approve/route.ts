import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { USER_MANAGEMENT_ROLES, isSuperAdmin, SUPERADMIN_PROTECTED_MESSAGE } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  sendApprovedEmail,
  sendRejectedEmail,
  type EmailResult,
} from "@/lib/email";

export const dynamic = "force-dynamic";

type ApproveBody = {
  userId?: unknown;
  action?: unknown;
  reason?: unknown;
};

function isMissingColumnError(
  error: { code?: string; message?: string } | null,
): boolean {
  if (!error) return false;
  if (error.code === "42703" || error.code === "PGRST204") return true;
  const message = (error.message ?? "").toLowerCase();
  return (
    message.includes("column") &&
    (message.includes("does not exist") || message.includes("schema cache"))
  );
}

// POST { userId, action: "approve" | "reject" | "revoke", reason? }
// "reject" and "revoke" both clear is_approved and mark the account rejected.
export async function POST(req: Request) {
  const guard = await requireAdmin(req, USER_MANAGEMENT_ROLES);
  if (!guard.ok) return guard.response;

  let body: ApproveBody;
  try {
    body = (await req.json()) as ApproveBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const userId = typeof body.userId === "string" ? body.userId : "";
  const action = typeof body.action === "string" ? body.action : "";
  const reason = typeof body.reason === "string" ? body.reason : null;

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  if (action !== "approve" && action !== "reject" && action !== "revoke") {
    return NextResponse.json(
      { error: "action must be 'approve' or 'reject'" },
      { status: 400 },
    );
  }

  // Safety: never allow any admin action against the SuperAdmin account.
  const { data: targetProfile, error: targetError } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (targetError) {
    return NextResponse.json(
      { error: "Could not load user", detail: targetError.message },
      { status: 500 },
    );
  }

  if (!targetProfile) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (isSuperAdmin(targetProfile.role)) {
    return NextResponse.json(
      { error: SUPERADMIN_PROTECTED_MESSAGE },
      { status: 403 },
    );
  }

  // Safety: an admin should not be able to revoke their own access.
  if (userId === guard.ctx.userId) {
    return NextResponse.json(
      { error: "You cannot change your own approval status" },
      { status: 400 },
    );
  }

  const isApproved = action === "approve";
  const verificationStatus = isApproved ? "approved" : "rejected";
  const updatedAt = new Date().toISOString();

  const payload: Record<string, unknown> = {
    is_approved: isApproved,
    updated_at: updatedAt,
    verification_status: verificationStatus,
    rejection_reason: isApproved ? null : reason,
    ...(isApproved
      ? { verification_token: null, token_expires_at: null }
      : {}),
  };

  let result = await supabaseAdmin
    .from("profiles")
    .update(payload)
    .eq("id", userId)
    .select("id, full_name, is_approved")
    .maybeSingle();

  // Graceful degradation before the verification migration is applied.
  if (isMissingColumnError(result.error)) {
    result = await supabaseAdmin
      .from("profiles")
      .update({ is_approved: isApproved, updated_at: updatedAt })
      .eq("id", userId)
      .select("id, full_name, is_approved")
      .maybeSingle();
  }

  const { data, error } = result;

  if (error) {
    return NextResponse.json(
      { error: "Could not update approval status", detail: error.message },
      { status: 500 },
    );
  }

  if (!data) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Layer 8: notify the user. Email is best-effort and never blocks the
  // approval decision itself.
  let email: EmailResult | null = null;
  try {
    const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(userId);
    const to = authUser?.user?.email;
    if (to) {
      email = isApproved
        ? await sendApprovedEmail(to, data.full_name ?? null)
        : await sendRejectedEmail(to, data.full_name ?? null, reason);
    }
  } catch (err) {
    console.error("[approve] notification failed:", err);
  }

  return NextResponse.json({
    ok: true,
    userId: data.id,
    isApproved: !!data.is_approved,
    verificationStatus,
    email,
  });
}
