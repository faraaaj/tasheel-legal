"use client";

import { useParams } from "next/navigation";
import ComingSoon from "@/components/admin/ComingSoon";

export default function AdminOrdersPage() {
  const params = useParams();
  const locale = params?.locale === "ar" ? "ar" : "en";
  const isAr = locale === "ar";
  return (
    <ComingSoon
      locale={locale}
      title={isAr ? "إدارة الطلبات" : "Order Management"}
      description={
        isAr
          ? "لا توجد جداول طلبات في قاعدة البيانات بعد. ستظهر الطلبات هنا بعد تفعيل نظام الطلبات."
          : "There is no orders table in the database yet. Orders will appear here once checkout and order creation are enabled."
      }
    />
  );
}
