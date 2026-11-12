// POST /api/admin/users/linkedin-research
// Returns a pre-filled LinkedIn search URL for the user. The browser opens it
// in a new tab; the API never opens windows itself.
//
// If the admin later stores a confirmed profile URL (body.linkedinUrl), it is
// saved on the profile for future reference.
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { USER_MANAGEMENT_ROLES, isSuperAdmin, SUPERADMIN_PROTECTED_MESSAGE } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

type Body = { userId?: unknown; linkedinUrl?: unknown };

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
  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("*")
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

  // Save a confirmed profile URL if the admin supplied one.
  if (typeof body.linkedinUrl === "string" && body.linkedinUrl.trim()) {
    const linkedinUrl = body.linkedinUrl.trim();
    if (!/^https:\/\/(www\.)?linkedin\.com\//i.test(linkedinUrl)) {
      return NextResponse.json(
        { error: "linkedinUrl must be a linkedin.com URL" },
        { status: 400 },
      );
    }

    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({ linkedin_url: linkedinUrl })
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
            : "Could not save the LinkedIn URL.",
          detail: updateError.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true, url: linkedinUrl, saved: true });
  }

  if (profile.linkedin_url) {
    return NextResponse.json({
      ok: true,
      url: profile.linkedin_url,
      saved: true,
    });
  }

  const name = (profile.full_name ?? "").trim();
  const query = name
    ? `site:linkedin.com/in/ "${name}"`
    : "site:linkedin.com/in/";

  const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

  return NextResponse.json({ ok: true, url, saved: false });
}
