import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

type TrackBody = {
  eventType?: unknown;
  packageId?: unknown;
  sessionId?: unknown;
  pagePath?: unknown;
  locale?: unknown;
  deviceType?: unknown;
  trafficSource?: unknown;
  metadata?: unknown;
};

export async function POST(req: Request) {
  let body: TrackBody;
  try {
    body = (await req.json()) as TrackBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType = typeof body.eventType === "string" ? body.eventType.trim() : "";
  if (!eventType) {
    return NextResponse.json({ error: "eventType is required" }, { status: 400 });
  }

  // Extract IP for traffic source detection (best-effort)
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || null;

  const row: Record<string, unknown> = {
    event_type: eventType,
    package_id: typeof body.packageId === "string" ? body.packageId : null,
    session_id: typeof body.sessionId === "string" ? body.sessionId : null,
    page_path: typeof body.pagePath === "string" ? body.pagePath : null,
    locale: typeof body.locale === "string" ? body.locale : null,
    device_type: typeof body.deviceType === "string" ? body.deviceType : null,
    traffic_source: typeof body.trafficSource === "string" ? body.trafficSource : null,
    metadata: body.metadata && typeof body.metadata === "object" ? body.metadata : null,
  };

  const { error } = await supabaseAdmin.from("analytics_events").insert(row);

  if (error) {
    console.error("[analytics/track] insert failed:", error.message);
    return NextResponse.json({ error: "Failed to track" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
