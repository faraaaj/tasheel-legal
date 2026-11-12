// POST /api/auth/register
// Server-side registration: creates the Supabase Auth user with the
// service role (email auto-confirmed, since Authentica handles the
// actual verification independently) and inserts the profiles row
// with all the new required intake fields. Verification status
// (email_verified / phone_verified) is tracked separately and only
// flipped to true by /api/auth/otp/verify once Authentica confirms
// the code.
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  createCaptureToken,
  getClientIp,
  lookupGeo,
} from "@/lib/request-meta";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { fullName, email, phone, nationality, address, city, password } = body as Record<
    string,
    string | undefined
  >;

  if (!fullName || !email || !phone || !nationality || !address || !city || !password) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Authentica, not Supabase, verifies the email code
    user_metadata: { full_name: fullName, phone, nationality, address, city },
  });

  if (createError) {
    const isDuplicate = createError.message.toLowerCase().includes("already");
    return NextResponse.json(
      {
        error: isDuplicate
          ? "This email is already registered. Please log in instead."
          : createError.message,
      },
      { status: isDuplicate ? 409 : 400 },
    );
  }

  const userId = created.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Account creation failed unexpectedly." }, { status: 500 });
  }

  // Upsert, not insert: the on_auth_user_created trigger (see
  // supabase/migrations/20261112_profiles_autocreate.sql) already created a
  // default profiles row when createUser() ran. Upsert overwrites it with the
  // real intake data without ever raising a duplicate-key error.
  const { error: profileError } = await supabaseAdmin.from("profiles").upsert(
    {
      id: userId,
      full_name: fullName,
      phone,
      nationality,
      address,
      city,
      role: "client",
      is_approved: false,
      email_verified: false,
      phone_verified: false,
    },
    { onConflict: "id" },
  );

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  // Best-effort registration analytics: client IP + geolocation from the
  // request itself, so it is captured even if the browser never calls
  // /api/auth/capture-metadata. Failures are logged, never surfaced to the
  // registrant (e.g. before the verification migration is applied).
  const ip = getClientIp(req);
  const geo = ip ? await lookupGeo(ip) : null;

  const metadata: Record<string, unknown> = {};
  if (ip) metadata.registration_ip = ip;
  if (geo?.country) metadata.registration_country = geo.country;
  if (geo?.countryCode) metadata.registration_country_code = geo.countryCode;
  if (geo?.city) metadata.registration_city = geo.city;
  if (geo?.isp) metadata.registration_isp = geo.isp;

  const referrer = req.headers.get("referer");
  if (referrer) metadata.referrer = referrer;

  if (Object.keys(metadata).length > 0) {
    const { error: metadataError } = await supabaseAdmin
      .from("profiles")
      .update(metadata)
      .eq("id", userId);

    if (metadataError) {
      console.warn(
        "[register] metadata capture skipped:",
        metadataError.code,
        metadataError.message,
      );
    }
  }

  // Lets the browser post its device fingerprint right after signup without
  // needing a Supabase session yet.
  const captureToken = createCaptureToken(userId);

  return NextResponse.json({ userId, email, captureToken });
}
