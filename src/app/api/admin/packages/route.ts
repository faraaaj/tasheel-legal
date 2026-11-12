import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

// Read-only package list for the admin console. Editing packages will be
// added in a later module; this endpoint never exposes gated content.
export async function GET(req: Request) {
  const guard = await requireAdmin(req);
  if (!guard.ok) return guard.response;

  const { data, error } = await supabaseAdmin
    .from("service_packages")
    .select("id, name_en, name_ar, price_sar, active")
    .order("name_en", { ascending: true });

  if (error) {
    return NextResponse.json(
      { error: "Could not load packages", detail: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ packages: data ?? [] });
}
