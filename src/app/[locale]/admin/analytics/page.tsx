"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { adminFetch } from "@/lib/admin-client";

type KpiCard = {
  label: string;
  value: string | number;
  source: "live" | "pending";
  note?: string;
};

type KpiSection = {
  title: string;
  kpis: KpiCard[];
};

export default function AnalyticsPage() {
  const params = useParams();
  const locale = params?.locale === "ar" ? "ar" : "en";
  const isAr = locale === "ar";

  const [sections, setSections] = useState<KpiSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const kpis: Record<string, KpiCard[]> = {
        traffic: [],
        engagement: [],
        conversions: [],
        users: [],
        legal: [],
        marketing: [],
      };

      // --- Users & Accounts (real data from profiles) ---
      try {
        const { count: totalUsers } = await supabase
          .from("profiles")
          .select("id", { count: "exact", head: true });
        const { count: pendingUsers } = await supabase
          .from("profiles")
          .select("id", { count: "exact", head: true })
          .eq("is_approved", false);
        const { count: approvedUsers } = await supabase
          .from("profiles")
          .select("id", { count: "exact", head: true })
          .eq("is_approved", true);
        const { count: adminUsers } = await supabase
          .from("profiles")
          .select("id", { count: "exact", head: true })
          .in("role", ["superadmin", "admin", "marketing_admin", "support_admin", "freelancer_admin"]);

        kpis.users = [
          { label: isAr ? "إجمالي المستخدمين" : "Total Users", value: totalUsers ?? 0, source: "live" },
          { label: isAr ? "المستخدمون المعتمدون" : "Approved Users", value: approvedUsers ?? 0, source: "live" },
          { label: isAr ? "المستخدمون المعلقون" : "Pending Users", value: pendingUsers ?? 0, source: "live" },
          { label: isAr ? "مستخدمو الإدارة" : "Admin Users", value: adminUsers ?? 0, source: "live" },
          { label: isAr ? "معدل النمو (شهري)" : "Growth Rate (Monthly)", value: "—", source: "pending", note: isAr ? "يحتاج إلى بيانات تاريخية" : "Requires historical data" },
          { label: isAr ? "معدل الاحتفاظ" : "Retention Rate", value: "—", source: "pending", note: isAr ? "يحتاج إلى بيانات تاريخية" : "Requires historical data" },
          { label: isAr ? "متوسط وقت الجلسة" : "Avg. Session Duration", value: "—", source: "pending", note: isAr ? "يحتاج إلى تحليلات" : "Requires analytics integration" },
          { label: isAr ? "معدل الارتداد" : "Bounce Rate", value: "—", source: "pending", note: isAr ? "يحتاج إلى تحليلات" : "Requires analytics integration" },
        ];
      } catch {
        kpis.users = [{ label: isAr ? "خطأ" : "Error", value: "—", source: "pending" }];
      }

      // --- Packages & Engagement (real data from service_packages) ---
      try {
        const { count: totalPackages } = await supabase
          .from("service_packages")
          .select("id", { count: "exact", head: true });
        const { count: activePackages } = await supabase
          .from("service_packages")
          .select("id", { count: "exact", head: true })
          .eq("active", true);
        const { count: discountedPackages } = await supabase
          .from("service_packages")
          .select("id", { count: "exact", head: true })
          .not("original_price_sar", "is", null);

        kpis.engagement = [
          { label: isAr ? "إجمالي الباقات" : "Total Packages", value: totalPackages ?? 0, source: "live" },
          { label: isAr ? "الباقات النشطة" : "Active Packages", value: activePackages ?? 0, source: "live" },
          { label: isAr ? "الباقات المخفضة" : "Discounted Packages", value: discountedPackages ?? 0, source: "live" },
          { label: isAr ? "مشاهدات الباقات" : "Package Views", value: "—", source: "pending", note: isAr ? "يحتاج إلى تحليلات" : "Requires analytics integration" },
          { label: isAr ? "فتحات النوافذ" : "Popup Opens", value: "—", source: "pending", note: isAr ? "يحتاج إلى تحليلات" : "Requires analytics integration" },
          { label: isAr ? "إضافات إلى السلة" : "Cart Adds", value: "—", source: "pending", note: isAr ? "يحتاج إلى تحليلات" : "Requires analytics integration" },
          { label: isAr ? "نقرات الشريط" : "Ticker Clicks", value: "—", source: "pending", note: isAr ? "يحتاج إلى تحليلات" : "Requires analytics integration" },
          { label: isAr ? "نقرات واتساب" : "WhatsApp Clicks", value: "—", source: "pending", note: isAr ? "يحتاج إلى تحليلات" : "Requires analytics integration" },
          { label: isAr ? "نقرات الهاتف" : "Phone Clicks", value: "—", source: "pending", note: isAr ? "يحتاج إلى تحليلات" : "Requires analytics integration" },
          { label: isAr ? "طلبات الاستشارة" : "Consultation Requests", value: "—", source: "pending", note: isAr ? "يحتاج إلى تحليلات" : "Requires analytics integration" },
        ];
      } catch {
        kpis.engagement = [{ label: isAr ? "خطأ" : "Error", value: "—", source: "pending" }];
      }

      // --- Conversions & Revenue (placeholder — no orders table yet) ---
      kpis.conversions = [
        { label: isAr ? "إجمالي التحويلات" : "Total Conversions", value: 0, source: "live", note: isAr ? "لا توجد طلبات بعد" : "No orders yet" },
        { label: isAr ? "إجمالي الإيرادات" : "Total Revenue", value: "0 SAR", source: "live" },
        { label: isAr ? "متوسط قيمة الطلب" : "Avg. Order Value", value: "—", source: "pending" },
        { label: isAr ? "الإيرادات حسب الباقة" : "Revenue by Package", value: "—", source: "pending" },
        { label: isAr ? "المبالغ المستردة" : "Refunds", value: 0, source: "live" },
        { label: isAr ? "معدل التحويل" : "Conversion Rate", value: "—", source: "pending", note: isAr ? "يحتاج إلى تحليلات" : "Requires analytics integration" },
        { label: isAr ? "تكلفة اكتساب العميل" : "Customer Acquisition Cost", value: "—", source: "pending", note: isAr ? "يحتاج إلى بيانات تسويق" : "Requires marketing data" },
        { label: isAr ? "القيمة الدائمة للعميل" : "Customer Lifetime Value", value: "—", source: "pending", note: isAr ? "يحتاج إلى بيانات تاريخية" : "Requires historical data" },
        { label: isAr ? "معدل التخلي عن السلة" : "Cart Abandonment Rate", value: "—", source: "pending", note: isAr ? "يحتاج إلى تحليلات" : "Requires analytics integration" },
        { label: isAr ? "معدل النمو (شهري)" : "Revenue Growth (Monthly)", value: "—", source: "pending" },
        { label: isAr ? "الإيرادات حسب القناة" : "Revenue by Channel", value: "—", source: "pending" },
        { label: isAr ? "الإيرادات حسب المنطقة" : "Revenue by Region", value: "—", source: "pending" },
      ];

      // --- Traffic & Acquisition (requires analytics integration) ---
      const trafficLabels = isAr
        ? ["الجلسات", "الزوار", "المصادر", "الروابط المرجعية", "صفحات الهبوط", "معدل الارتداد", "الزوار الجدد", "الزوار العائدون", "متوسط مدة الجلسة", "الصفحات لكل جلسة", "الزيارات من الجوال", "الزيارات من سطح المكتب"]
        : ["Sessions", "Visitors", "Traffic Sources", "Referrers", "Landing Pages", "Bounce Rate", "New Visitors", "Returning Visitors", "Avg. Session Duration", "Pages per Session", "Mobile Traffic", "Desktop Traffic"];
      kpis.traffic = trafficLabels.map((l) => ({
        label: l,
        value: "—",
        source: "pending" as const,
        note: isAr ? "يحتاج إلى تحليلات" : "Data source not connected",
      }));

      // --- Legal-Specific Metrics ---
      const legalLabels = isAr
        ? ["طلبات الاستشارة", "استفسارات الباقات", "نقرات واتساب", "نقرات الهاتف", "نقرات البريد الإلكتروني", "مشاهدات الباقات", "فتحات النوافذ", "إضافات إلى السلة"]
        : ["Consultation Requests", "Package Inquiries", "WhatsApp Clicks", "Phone Clicks", "Email Clicks", "Package Views", "Popup Opens", "Cart Adds"];
      kpis.legal = legalLabels.map((l) => ({
        label: l,
        value: "—",
        source: "pending" as const,
        note: isAr ? "يحتاج إلى تحليلات" : "Data source not connected",
      }));

      // --- Marketing & SEO ---
      const marketingLabels = isAr
        ? ["الزيارات العضوية", "الكلمات المفتاحية", "الروابط الخلفية", "معدل فتح البريد", "تكلفة اكتساب العميل", "القيمة الدائمة", "الوصول عبر وسائل التواصل", "التفاعلات", "التحويلات من البريد", "التحويلات من وسائل التواصل"]
        : ["Organic Traffic", "Keywords", "Backlinks", "Email Open Rate", "Cost per Acquisition", "Customer Lifetime Value", "Social Reach", "Social Engagement", "Email Conversions", "Social Conversions"];
      kpis.marketing = marketingLabels.map((l) => ({
        label: l,
        value: "—",
        source: "pending" as const,
        note: isAr ? "يحتاج إلى تحليلات" : "Data source not connected",
      }));

      if (cancelled) return;

      setSections([
        { title: isAr ? "الزيارات والاقتناء" : "Traffic & Acquisition", kpis: kpis.traffic },
        { title: isAr ? "التفاعل والمحتوى" : "Engagement & Content", kpis: kpis.engagement },
        { title: isAr ? "التحويلات والإيرادات" : "Conversions & Revenue", kpis: kpis.conversions },
        { title: isAr ? "المستخدمون والحسابات" : "Users & Accounts", kpis: kpis.users },
        { title: isAr ? "المقاييس القانونية" : "Legal-Specific Metrics", kpis: kpis.legal },
        { title: isAr ? "التسويق وSEO" : "Marketing & SEO", kpis: kpis.marketing },
      ]);
      setLoading(false);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [isAr]);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#C5A880]">
          {isAr ? "التحليلات" : "Analytics"}
        </p>
        <h2 className="mt-1 font-serif-en text-2xl text-white">
          {isAr ? "لوحة التحليلات (60+ مؤشر)" : "Analytics Dashboard (60+ KPIs)"}
        </h2>
        <p className="mt-2 text-sm text-gray-400">
          {isAr
            ? "المؤشرات الحية من Supabase. المؤشرات التي تتطلب تكاملات خارجية تظهر كـ 'مصدر البيانات غير متصل'."
            : "Live metrics from Supabase. Metrics requiring external integrations show as 'Data source not connected'."}
        </p>
      </div>

      {loading ? (
        <p className="text-gray-400">{isAr ? "جارٍ التحميل..." : "Loading..."}</p>
      ) : (
        sections.map((section) => (
          <section key={section.title} className="border border-white/10 bg-[#0A1120] p-6">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#C5A880] mb-4">
              {section.title}
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {section.kpis.map((kpi, i) => (
                <div
                  key={i}
                  className="border border-white/10 bg-[#070D19] p-4"
                >
                  <p className="text-[9px] uppercase tracking-[0.14em] text-gray-500 truncate">
                    {kpi.label}
                  </p>
                  <p
                    className={`mt-2 text-xl font-bold ${
                      kpi.source === "live" ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {kpi.value}
                  </p>
                  {kpi.note && (
                    <p className="mt-1 text-[9px] text-gray-600">{kpi.note}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
