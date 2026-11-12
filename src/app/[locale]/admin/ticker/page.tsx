"use client";

import { useParams } from "next/navigation";
import ComingSoon from "@/components/admin/ComingSoon";

export default function AdminTickerPage() {
  const params = useParams();
  const isAr = params?.locale === "ar";

  return (
    <ComingSoon
      eyebrow={isAr ? "الشريط الإخباري" : "Ticker"}
      title={isAr ? "إدارة الشريط الإخباري" : "Ticker management"}
      description={
        isAr
          ? "سيتمكن فريق التسويق من إدارة العناوين المتحركة في الصفحة الرئيسية من هنا. هذه الوحدة قيد التطوير."
          : "The marketing team will manage the homepage ticker headlines here. This module is under development."
      }
    />
  );
}
