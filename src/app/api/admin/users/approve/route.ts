import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { USER_MANAGEMENT_ROLES } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

type ApproveBody = {
  userId?: unknown;
  action?: unknown;
};

// POST { userId, action: "approve" | "reject" | "revoke" }
// "reject" and "revoke" both clear is_approved.
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

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  if (action !== "approve" && action !== "reject" && action !== "revoke") {
    return NextResponse.json(
      { error: "action must be 'approve' or 'reject'" },
      { status: 400 },
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

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .update({ is_approved: isApproved, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select("id, is_approved")
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: "Could not update approval status", detail: error.message },
      { status: 500 },
    );
  }

  if (!data) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    userId: data.id,
    isApproved: !!data.is_approved,
  });
}
