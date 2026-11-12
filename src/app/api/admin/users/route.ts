import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { canManageUsers } from "@/lib/admin";
import { getAuthEmailMap } from "@/lib/admin-users";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const guard = await requireAdmin(req);
  if (!guard.ok) return guard.response;

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select(
      "id, full_name, phone, role, is_approved, created_at, email_verified, phone_verified",
    )
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: "Could not load users", detail: error.message },
      { status: 500 },
    );
  }

  const emails = await getAuthEmailMap();

  const users = (data ?? []).map((profile) => ({
    id: profile.id,
    fullName: profile.full_name ?? null,
    email: emails.get(profile.id) ?? null,
    phone: profile.phone ?? null,
    role: profile.role ?? "client",
    isApproved: !!profile.is_approved,
    emailVerified: !!profile.email_verified,
    phoneVerified: !!profile.phone_verified,
    createdAt: profile.created_at,
  }));

  return NextResponse.json({
    users,
    viewerRole: guard.ctx.role,
    canManage: canManageUsers(guard.ctx.role),
  });
}
