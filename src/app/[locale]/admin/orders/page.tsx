"use client";

import { useParams } from "next/navigation";
import ComingSoon from "@/components/admin/ComingSoon";

export default function AdminOrdersPage() {
  const params = useParams();
  const isAr = params?.locale === "ar";

  return (
    <ComingSoon
      eyebrow={isAr ? "الطلبات" : "Orders"}
      title={isAr ? "إدارة الطلبات" : "Order management"}
      description={
        isAr
          ? "لا يوجد جدول طلبات في قاعدة البيانات بعد. ستظهر الطلبات هنا بمجرد تفعيل الدفع وإنشاء الطلبات."
          : "There is no orders table in the database yet. Orders will appear here once checkout and order creation are enabled."
      }
    />
  );
}
