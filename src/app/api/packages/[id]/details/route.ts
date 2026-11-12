import { NextResponse, type NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// Gated content principle: outcomes/requirements/details are this
// company's core IP and must never be sent to the browser for an
// unauthenticated, unverified, or unapproved visitor. This route is the
// ONLY place that content is served from — the public store page query
// never selects these columns at all (see store/page.tsx).
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "");

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
  if (userError || !userData?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("is_approved, email_verified, phone_verified")
    .eq("id", userData.user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 403 });
  }

  // Approved accounts are trusted and bypass the OTP verification gate.
  if (!profile.is_approved) {
    return NextResponse.json({ error: "Account not approved" }, { status: 403 });
  }

  const { data: pkg, error: pkgError } = await supabaseAdmin
    .from("service_packages")
    .select(
      "outcomes_en, outcomes_ar, requirements_en, requirements_ar, details_en, details_ar, details_json_en, details_json_ar",
    )
    .eq("id", id)
    .eq("active", true)
    .single();

  if (pkgError || !pkg) {
    return NextResponse.json({ error: "Package not found" }, { status: 404 });
  }

  return NextResponse.json({
    outcomesEn: pkg.outcomes_en ?? null,
    outcomesAr: pkg.outcomes_ar ?? null,
    requirementsEn: pkg.requirements_en ?? null,
    requirementsAr: pkg.requirements_ar ?? null,
    detailsEn: pkg.details_en ?? null,
    detailsAr: pkg.details_ar ?? null,
    detailsJsonEn: pkg.details_json_en ?? null,
    detailsJsonAr: pkg.details_json_ar ?? null,
  });
}
