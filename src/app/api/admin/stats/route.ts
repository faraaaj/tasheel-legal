import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getAuthEmailMap } from "@/lib/admin-users";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

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

export async function GET(req: Request) {
  const guard = await requireAdmin(req);
  if (!guard.ok) return guard.response;

  const [totalUsers, pendingApprovals, totalPackages, totalOrders, recent] =
    await Promise.all([
      countRows("profiles"),
      countRows("profiles", { column: "is_approved", value: false }),
      countRows("service_packages"),
      // No orders table exists yet in this project; this resolves to 0
      // instead of throwing PGRST205.
      countRows("orders"),
      supabaseAdmin
        .from("profiles")
        .select("id, full_name, role, is_approved, created_at")
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

  const emails = await getAuthEmailMap();

  const recentUsers = (recent.data ?? []).map((profile) => ({
    id: profile.id,
    fullName: profile.full_name ?? null,
    email: emails.get(profile.id) ?? null,
    role: profile.role ?? "client",
    isApproved: !!profile.is_approved,
    createdAt: profile.created_at,
  }));

  return NextResponse.json({
    stats: {
      totalUsers,
      pendingApprovals,
      totalPackages,
      totalOrders,
    },
    recentUsers,
  });
}
