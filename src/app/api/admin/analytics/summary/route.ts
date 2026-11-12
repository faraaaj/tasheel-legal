import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const guard = await requireAdmin(req);
  if (!guard.ok) return guard.response;

  const since = new Date();
  since.setDate(since.getDate() - 30);
  const sinceISO = since.toISOString();

  // Total event counts by type
  const { data: events } = await supabaseAdmin
    .from("analytics_events")
    .select("event_type, created_at")
    .gte("created_at", sinceISO);

  const counts: Record<string, number> = {};
  for (const e of events ?? []) {
    counts[e.event_type] = (counts[e.event_type] || 0) + 1;
  }

  // Unique sessions
  const { data: sessions } = await supabaseAdmin
    .from("analytics_events")
    .select("session_id")
    .gte("created_at", sinceISO);
  const uniqueSessions = new Set((sessions ?? []).map((s) => s.session_id).filter(Boolean)).size;

  // Unique users
  const { data: users } = await supabaseAdmin
    .from("analytics_events")
    .select("user_id")
    .gte("created_at", sinceISO);
  const uniqueUsers = new Set((users ?? []).map((u) => u.user_id).filter(Boolean)).size;

  // Daily metrics from analytics_daily (last 30 days)
  const { data: daily } = await supabaseAdmin
    .from("analytics_daily")
    .select("date, metric_name, metric_value")
    .gte("date", sinceISO.split("T")[0])
    .order("date", { ascending: true });

  // Package-level event counts
  const { data: pkgEvents } = await supabaseAdmin
    .from("analytics_events")
    .select("package_id, event_type")
    .gte("created_at", sinceISO)
    .not("package_id", "is", null);

  const pkgCounts: Record<string, Record<string, number>> = {};
  for (const e of pkgEvents ?? []) {
    if (!e.package_id) continue;
    if (!pkgCounts[e.package_id]) pkgCounts[e.package_id] = {};
    pkgCounts[e.package_id][e.event_type] = (pkgCounts[e.package_id][e.event_type] || 0) + 1;
  }

  // Top packages by views
  const topPackages = Object.entries(pkgCounts)
    .map(([id, c]) => ({ id, views: c.package_view || 0, cartAdds: c.cart_add || 0, popupOpens: c.popup_open || 0 }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  // Fetch package names
  const pkgIds = topPackages.map((p) => p.id);
  let pkgNames: Record<string, string> = {};
  if (pkgIds.length > 0) {
    const { data: pkgs } = await supabaseAdmin
      .from("service_packages")
      .select("id, name_en, name_ar")
      .in("id", pkgIds);
    for (const p of pkgs ?? []) {
      pkgNames[p.id] = p.name_en;
    }
  }

  const topPackagesWithNames = topPackages.map((p) => ({
    ...p,
    name: pkgNames[p.id] || p.id,
  }));

  // Device breakdown
  const { data: deviceData } = await supabaseAdmin
    .from("analytics_events")
    .select("device_type")
    .gte("created_at", sinceISO);
  const deviceCounts: Record<string, number> = {};
  for (const d of deviceData ?? []) {
    const t = d.device_type || "unknown";
    deviceCounts[t] = (deviceCounts[t] || 0) + 1;
  }

  // Traffic source breakdown
  const { data: sourceData } = await supabaseAdmin
    .from("analytics_events")
    .select("traffic_source")
    .gte("created_at", sinceISO);
  const sourceCounts: Record<string, number> = {};
  for (const s of sourceData ?? []) {
    const t = s.traffic_source || "direct";
    sourceCounts[t] = (sourceCounts[t] || 0) + 1;
  }

  // Locale breakdown
  const { data: localeData } = await supabaseAdmin
    .from("analytics_events")
    .select("locale")
    .gte("created_at", sinceISO);
  const localeCounts: Record<string, number> = {};
  for (const l of localeData ?? []) {
    const t = l.locale || "unknown";
    localeCounts[t] = (localeCounts[t] || 0) + 1;
  }

  return NextResponse.json({
    period: "30d",
    overview: {
      totalEvents: events?.length ?? 0,
      uniqueSessions,
      uniqueUsers,
      pageViews: counts.page_view || 0,
      packageViews: counts.package_view || 0,
      popupOpens: counts.popup_open || 0,
      cartAdds: counts.cart_add || 0,
      tickerClicks: counts.ticker_click || 0,
      whatsappClicks: counts.whatsapp_click || 0,
      phoneClicks: counts.phone_click || 0,
      emailClicks: counts.email_click || 0,
      consultationRequests: counts.consultation_request || 0,
    },
    eventCounts: counts,
    deviceBreakdown: deviceCounts,
    trafficSources: sourceCounts,
    localeBreakdown: localeCounts,
    topPackages: topPackagesWithNames,
    dailyMetrics: daily ?? [],
  });
}
