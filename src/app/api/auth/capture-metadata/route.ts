// POST /api/auth/capture-metadata
// Called once by the register page immediately after a successful signup.
// The browser has no Supabase session yet, so the request is authorised by a
// short-lived HMAC token returned from /api/auth/register. Only metadata
// columns are written; the profile row itself must already exist.
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  getClientIp,
  lookupGeo,
  verifyCaptureToken,
} from "@/lib/request-meta";

export const dynamic = "force-dynamic";

type CaptureBody = {
  userId?: unknown;
  captureToken?: unknown;
  device?: unknown;
  referrer?: unknown;
};

export async function POST(req: Request) {
  let body: CaptureBody;
  try {
    body = (await req.json()) as CaptureBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const userId = typeof body.userId === "string" ? body.userId : "";
  const captureToken =
    typeof body.captureToken === "string" ? body.captureToken : "";

  if (!userId || !captureToken) {
    return NextResponse.json(
      { error: "userId and captureToken are required" },
      { status: 400 },
    );
  }

  if (!verifyCaptureToken(userId, captureToken)) {
    return NextResponse.json(
      { error: "Invalid or expired capture token" },
      { status: 403 },
    );
  }

  // The token is only issued after a successful registration, but confirm the
  // profile still exists before writing to it.
  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (profileError) {
    return NextResponse.json(
      { error: "Could not verify profile" },
      { status: 500 },
    );
  }

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const ip = getClientIp(req);
  const geo = ip ? await lookupGeo(ip) : null;

  const update: Record<string, unknown> = {};

  if (ip) update.registration_ip = ip;
  if (geo?.country) update.registration_country = geo.country;
  if (geo?.countryCode) update.registration_country_code = geo.countryCode;
  if (geo?.city) update.registration_city = geo.city;
  if (geo?.isp) update.registration_isp = geo.isp;

  if (body.device && typeof body.device === "object") {
    update.device_fingerprint = body.device;
  }

  const referrer =
    typeof body.referrer === "string"
      ? body.referrer
      : req.headers.get("referer");
  if (referrer) update.referrer = referrer;

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ ok: true, captured: {} });
  }

  const { error: updateError } = await supabaseAdmin
    .from("profiles")
    .update(update)
    .eq("id", userId);

  if (updateError) {
    // Most likely cause: the 20261113_verification_workflow migration has not
    // been applied yet. Registration itself must still succeed, so the client
    // treats this as best-effort.
    console.warn(
      "[capture-metadata] update failed:",
      updateError.code,
      updateError.message,
    );
    return NextResponse.json(
      {
        error: "Metadata could not be stored. Database migration may be required.",
        detail: updateError.message,
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    captured: {
      ip: ip ?? null,
      country: geo?.country ?? null,
      countryCode: geo?.countryCode ?? null,
      city: geo?.city ?? null,
      isp: geo?.isp ?? null,
      hasDevice: !!update.device_fingerprint,
      hasReferrer: !!update.referrer,
    },
  });
}
