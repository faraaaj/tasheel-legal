import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getAuthEmailMap } from "@/lib/admin-users";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  deriveVerificationStatus,
  isOpenStatus,
} from "@/lib/verification";

export const dynamic = "force-dynamic";

const OPEN_STATUSES = ["pending", "statement_requested", "statement_received"];

async function countRows(
  table: string,
  filter?: { column: string; value: unknown },
): Promise<number> {
  try {
    let query = supabaseAdmin
      .from(table)
      .select("id", { count: "exact", head: true });

    if (filter) {
      query = query.eq(filter.column, filter.value);
    }

    const { count, error } = await query;
    if (error) return 0;
    return count ?? 0;
  } catch {
    return 0;
  }
}

// Pending = anything still awaiting an admin decision. Falls back to the
// pre-migration is_approved filter when verification_status does not exist.
async function loadPending() {
  const attempt = await supabaseAdmin
    .from("profiles")
    .select("*", { count: "exact" })
    .in("verification_status", OPEN_STATUSES)
    .order("created_at", { ascending: false })
    .limit(5);

  if (!attempt.error) {
    return { count: attempt.count ?? 0, rows: attempt.data ?? [] };
  }

  const fallback = await supabaseAdmin
    .from("profiles")
    .select("*", { count: "exact" })
    .eq("is_approved", false)
    .order("created_at", { ascending: false })
    .limit(5);

  return { count: fallback.count ?? 0, rows: fallback.data ?? [] };
}

export async function GET(req: Request) {
  const guard = await requireAdmin(req);
  if (!guard.ok) return guard.response;

  const [totalUsers, pending, totalPackages, totalOrders, recent] =
    await Promise.all([
      countRows("profiles"),
      loadPending(),
      countRows("service_packages"),
      // No orders table exists yet in this project; this resolves to 0
      // instead of throwing PGRST205.
      countRows("orders"),
      supabaseAdmin
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

  const emails = await getAuthEmailMap();

  const mapUser = (profile: Record<string, unknown>) => {
    const status = deriveVerificationStatus({
      is_approved:
        typeof profile.is_approved === "boolean" ? profile.is_approved : null,
      verification_status:
        typeof profile.verification_status === "string"
          ? profile.verification_status
          : null,
      problem_statement:
        typeof profile.problem_statement === "string"
          ? profile.problem_statement
          : null,
      verification_token:
        typeof profile.verification_token === "string"
          ? profile.verification_token
          : null,
      token_expires_at:
        typeof profile.token_expires_at === "string"
          ? profile.token_expires_at
          : null,
    });
    return {
      id: profile.id as string,
      fullName: (profile.full_name as string | null) ?? null,
      email: emails.get(profile.id as string) ?? null,
      role: (profile.role as string | null) ?? "client",
      isApproved: !!profile.is_approved,
      verificationStatus: status,
      isOpen: isOpenStatus(status),
      createdAt: profile.created_at as string,
    };
  };

  const recentUsers = (recent.data ?? []).map(mapUser);
  const pendingUsers = pending.rows.map(mapUser);

  return NextResponse.json({
    stats: {
      totalUsers,
      pendingApprovals: pending.count,
      totalPackages,
      totalOrders,
    },
    pendingUsers,
    recentUsers,
  });
}
