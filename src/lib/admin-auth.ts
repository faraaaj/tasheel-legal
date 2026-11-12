// Server-only guard for /api/admin/* routes. Verifies the bearer token with
// Supabase Auth, loads the caller's profile and confirms an admin role.
// Never import this from a client component.
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  ADMIN_ROLES,
  isAdminRole,
  type AdminRole,
} from "@/lib/admin";

export type AdminContext = {
  userId: string;
  email: string | null;
  role: AdminRole;
  fullName: string | null;
  isApproved: boolean;
};

export type AdminGuardResult =
  | { ok: true; ctx: AdminContext }
  | { ok: false; response: NextResponse };

export async function requireAdmin(
  req: Request,
  allowedRoles: readonly string[] = ADMIN_ROLES,
): Promise<AdminGuardResult> {
  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "");

  if (!token) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Not authenticated" }, { status: 401 }),
    };
  }

  const { data: userData, error: userError } =
    await supabaseAdmin.auth.getUser(token);

  if (userError || !userData?.user) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Not authenticated" }, { status: 401 }),
    };
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("full_name, role, is_approved")
    .eq("id", userData.user.id)
    .single();

  if (profileError || !profile) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Profile not found" }, { status: 403 }),
    };
  }

  if (!isAdminRole(profile.role) || !allowedRoles.includes(profile.role)) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return {
    ok: true,
    ctx: {
      userId: userData.user.id,
      email: userData.user.email ?? null,
      role: profile.role,
      fullName: profile.full_name ?? null,
      isApproved: !!profile.is_approved,
    },
  };
}
