"use client";

import { useParams } from "next/navigation";
import ComingSoon from "@/components/admin/ComingSoon";

export default function Page() {
  const params = useParams();
  const locale = params?.locale === "ar" ? "ar" : "en";
  const isAr = locale === "ar";
  return (
    <ComingSoon
      locale={locale}
      title={isAr ? "إدارة المحتوى" : "Content Management"}
      description="Content creation, editing, and publishing."
    />
  );
}
