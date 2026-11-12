"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { adminFetch } from "@/lib/admin-client";

type Summary = {
  period: string;
  overview: {
    totalEvents: number;
    uniqueSessions: number;
    uniqueUsers: number;
    pageViews: number;
    packageViews: number;
    popupOpens: number;
    cartAdds: number;
    tickerClicks: number;
    whatsappClicks: number;
    phoneClicks: number;
    emailClicks: number;
    consultationRequests: number;
  };
  eventCounts: Record<string, number>;
  deviceBreakdown: Record<string, number>;
  trafficSources: Record<string, number>;
  localeBreakdown: Record<string, number>;
  topPackages: { id: string; name: string; views: number; cartAdds: number; popupOpens: number }[];
  dailyMetrics: { date: string; metric_name: string; metric_value: number }[];
};

function KpiCard({ label, value, live }: { label: string; value: string | number; live: boolean }) {
  return (
    <div className="border border-white/10 bg-[#070D19] p-4">
      <p className="text-[9px] uppercase tracking-[0.14em] text-gray-500 truncate">{label}</p>
      <p className={`mt-2 text-xl font-bold ${live ? "text-white" : "text-gray-500"}`}>{value}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-white/10 bg-[#0A1120] p-6">
      <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#C5A880] mb-4">{title}</h3>
      {children}
    </section>
  );
}

export default function AnalyticsPage() {
  const params = useParams();
  const locale = params?.locale === "ar" ? "ar" : "en";
  const isAr = locale === "ar";

  const [data, setData] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await adminFetch<Summary>("/api/admin/analytics/summary");
        if (!cancelled) { setData(res); setLoading(false); }
      } catch (err) {
        if (!cancelled) { setError(err instanceof Error ? err.message : "Failed to load"); setLoading(false); }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <p className="text-gray-400">{isAr ? "جارٍ التحميل..." : "Loading..."}</p>;
  if (error) return <p className="text-red-400">{error}</p>;
  if (!data) return null;

  const o = data.overview;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#C5A880]">
          {isAr ? "التحليلات" : "Analytics"}
        </p>
        <h2 className="mt-1 font-serif-en text-2xl text-white">
          {isAr ? "لوحة التحليلات (30 يوماً)" : "Analytics Dashboard (Last 30 Days)"}
        </h2>
        <p className="mt-2 text-sm text-gray-400">
          {isAr ? "بيانات حقيقية من Supabase. المؤشرات التي تتطلب تكاملات خارجية تظهر كـ 'مصدر البيانات غير متصل'." : "Live data from Supabase. Metrics requiring external integrations show as 'Data source not connected'."}
        </p>
      </div>

      {/* Traffic & Acquisition */}
      <Section title={isAr ? "الزيارات والاقتناء (12)" : "Traffic & Acquisition (12)"}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          <KpiCard label={isAr ? "إجمالي الأحداث" : "Total Events"} value={o.totalEvents} live />
          <KpiCard label={isAr ? "الجلسات الفريدة" : "Unique Sessions"} value={o.uniqueSessions} live />
          <KpiCard label={isAr ? "المستخدمون الفريدون" : "Unique Users"} value={o.uniqueUsers} live />
          <KpiCard label={isAr ? "مشاهدات الصفحات" : "Page Views"} value={o.pageViews} live />
          <KpiCard label={isAr ? "مشاهدات الباقات" : "Package Views"} value={o.packageViews} live />
          <KpiCard label={isAr ? "فتحات النوافذ" : "Popup Opens"} value={o.popupOpens} live />
          <KpiCard label={isAr ? "إضافات إلى السلة" : "Cart Adds"} value={o.cartAdds} live />
          <KpiCard label={isAr ? "نقرات الشريط" : "Ticker Clicks"} value={o.tickerClicks} live />
          <KpiCard label={isAr ? "نقرات واتساب" : "WhatsApp Clicks"} value={o.whatsappClicks} live />
          <KpiCard label={isAr ? "نقرات الهاتف" : "Phone Clicks"} value={o.phoneClicks} live />
          <KpiCard label={isAr ? "نقرات البريد" : "Email Clicks"} value={o.emailClicks} live />
          <KpiCard label={isAr ? "طلبات الاستشارة" : "Consultation Requests"} value={o.consultationRequests} live />
        </div>
      </Section>

      {/* Device & Traffic Source Breakdown */}
      <Section title={isAr ? "الأجهزة ومصادر الزيارات" : "Devices & Traffic Sources"}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-gray-500 mb-2">{isAr ? "الأجهزة" : "Devices"}</p>
            <div className="space-y-1">
              {Object.entries(data.deviceBreakdown).map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm text-gray-300">
                  <span>{k}</span><span className="text-white font-bold">{v}</span>
                </div>
              ))}
              {Object.keys(data.deviceBreakdown).length === 0 && <p className="text-gray-500 text-sm">{isAr ? "لا توجد بيانات" : "No data"}</p>}
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-gray-500 mb-2">{isAr ? "مصادر الزيارات" : "Traffic Sources"}</p>
            <div className="space-y-1">
              {Object.entries(data.trafficSources).map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm text-gray-300">
                  <span>{k}</span><span className="text-white font-bold">{v}</span>
                </div>
              ))}
              {Object.keys(data.trafficSources).length === 0 && <p className="text-gray-500 text-sm">{isAr ? "لا توجد بيانات" : "No data"}</p>}
            </div>
          </div>
        </div>
      </Section>

      {/* Top Packages */}
      <Section title={isAr ? "أفضل الباقات (حسب المشاهدات)" : "Top Packages (by Views)"}>
        {data.topPackages.length === 0 ? (
          <p className="text-gray-500 text-sm">{isAr ? "لا توجد بيانات بعد. تبدأ التتبع عند زيارة المستخدمين للباقات." : "No data yet. Tracking begins when users view packages."}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-[10px] uppercase tracking-[0.14em] text-gray-500">
                  <th className="px-3 py-2 text-start">{isAr ? "الباقة" : "Package"}</th>
                  <th className="px-3 py-2 text-end">{isAr ? "مشاهدات" : "Views"}</th>
                  <th className="px-3 py-2 text-end">{isAr ? "فتحات" : "Popups"}</th>
                  <th className="px-3 py-2 text-end">{isAr ? "سلة" : "Cart Adds"}</th>
                </tr>
              </thead>
              <tbody>
                {data.topPackages.map((p) => (
                  <tr key={p.id} className="border-b border-white/5">
                    <td className="px-3 py-2 text-gray-300">{p.name}</td>
                    <td className="px-3 py-2 text-end text-white font-bold">{p.views}</td>
                    <td className="px-3 py-2 text-end text-white font-bold">{p.popupOpens}</td>
                    <td className="px-3 py-2 text-end text-white font-bold">{p.cartAdds}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      {/* Locale Breakdown */}
      <Section title={isAr ? "التوزيع حسب اللغة" : "Locale Breakdown"}>
        <div className="space-y-1">
          {Object.entries(data.localeBreakdown).map(([k, v]) => (
            <div key={k} className="flex justify-between text-sm text-gray-300">
              <span>{k}</span><span className="text-white font-bold">{v}</span>
            </div>
          ))}
          {Object.keys(data.localeBreakdown).length === 0 && <p className="text-gray-500 text-sm">{isAr ? "لا توجد بيانات" : "No data"}</p>}
        </div>
      </Section>

      {/* Pending integrations */}
      <Section title={isAr ? "المؤشرات المعلقة (تكاملات خارجية)" : "Pending KPIs (External Integrations)"}>
        <p className="text-sm text-gray-400 mb-3">
          {isAr ? "المؤشرات التالية تتطلب تكاملات خارجية (Google Search Console, Resend, Web3Forms) وتظهر كـ 'مصدر البيانات غير متصل'." : "The following KPIs require external integrations (Google Search Console, Resend, Web3Forms) and show as 'Data source not connected'."}
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {[
            "Organic Traffic", "Keywords", "Backlinks", "Email Open Rate",
            "Cost per Acquisition", "Customer Lifetime Value", "Social Reach",
            "Social Engagement", "Email Conversions", "Social Conversions",
            "Bounce Rate", "Avg. Session Duration", "Pages per Session",
            "New Visitors", "Returning Visitors", "Mobile Traffic", "Desktop Traffic",
            "Revenue Growth", "Revenue by Channel", "Revenue by Region",
            "Cart Abandonment Rate", "Retention Rate",
          ].map((label) => (
            <div key={label} className="border border-white/10 bg-[#070D19] p-4">
              <p className="text-[9px] uppercase tracking-[0.14em] text-gray-500 truncate">{label}</p>
              <p className="mt-2 text-xl font-bold text-gray-500">—</p>
              <p className="mt-1 text-[9px] text-gray-600">{isAr ? "مصدر البيانات غير متصل" : "Data source not connected"}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
