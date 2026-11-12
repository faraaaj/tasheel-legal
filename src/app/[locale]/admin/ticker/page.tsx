"use client";

import { useParams } from "next/navigation";
import ComingSoon from "@/components/admin/ComingSoon";

export default function AdminTickerPage() {
  const params = useParams();
  const locale = params?.locale === "ar" ? "ar" : "en";
  const isAr = locale === "ar";
  return (
    <ComingSoon
      locale={locale}
      title={isAr ? "إدارة الشريط الإخباري" : "Ticker Management"}
      description={
        isAr
          ? "ستدير فريق التسويق عناوين الشريط الإخباري هنا. هذه الوحدة قيد التطوير."
          : "The marketing team will manage the homepage ticker headlines here. This module is under development."
      }
    />
  );
}
