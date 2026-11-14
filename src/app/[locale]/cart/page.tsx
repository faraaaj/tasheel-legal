"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import PageHeader from "@/components/layout/PageHeader";

export default function CartPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === "ar" ? "ar" : "en";
  const isAr = locale === "ar";
  const { cartItems, removeFromCart, clearCart, totalPrice } = useCart();
  const { formatSar, currency } = useCurrency();

  const handleCheckout = () => {
    // Checkout flow to be implemented in Phase 1 (payment integration)
  };

  return (
    <PageHeader
      locale={locale}
      title={isAr ? "سلة التسوق" : "Shopping Cart"}
      subtitle={isAr ? "مراجعة العناصر المحددة" : "Review your selected items"}
    >
      {cartItems.length === 0 ? (
            <div className="mt-16 flex flex-col items-center justify-center text-center">
              <p className="text-lg text-gray-300">{isAr ? "سلتك فارغة." : "Your cart is empty."}</p>
              <Link
                href={`/${locale}/store`}
                className="mt-8 inline-flex items-center justify-center !min-w-[180px] h-[44px] border border-[#C5A880] text-[#C5A880] font-bold uppercase tracking-widest text-[11px] hover:bg-[#C5A880]/10 transition-all"
              >
                {isAr ? "استكشاف الباقات" : "Explore Packages"}
              </Link>
            </div>
          ) : (
            <div className="mt-16 max-w-4xl mx-auto">
              <div className="bg-[#0A1120] border border-white/5 p-8">
                <ul className="divide-y divide-white/5">
                  {cartItems.map((item) => (
                    <li
                      key={item.id}
                      className="py-6 flex items-start justify-between gap-4"
                    >
                      <div>
                        <h2 className="font-serif-en text-xl text-white">
                          {isAr ? item.nameAr : item.nameEn}
                        </h2>
                        <p className="mt-2 text-sm text-gray-300">
                          {formatSar(item.priceSar)}
                        </p>
                        <p className="mt-2 text-xs text-gray-400">
                          {isAr ? "مدة الصلاحية" : "Validity"}: {item.validityDays}{" "}
                          {isAr ? "يوم" : "days"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="inline-flex items-center justify-center h-10 w-10 border border-red-400/40 text-red-400 hover:bg-red-400/10 transition-all"
                        aria-label="Remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
                  <p className="text-lg font-semibold text-[#C5A880]">
                    {isAr ? "الإجمالي" : "Total"}: {formatSar(totalPrice)}
                  </p>
                  <button
                    type="button"
                    disabled
                    className="inline-flex items-center justify-center !min-w-[180px] h-[46px] bg-yellow-400 text-[#070D19] font-bold uppercase tracking-widest text-[11px] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-yellow-500 transition-all"
                  >
                    {isAr ? "المتابعة إلى الدفع" : "Proceed to Checkout"}
                  </button>
                </div>
                <p className="mt-3 text-center text-xs text-gray-400">
                  {isAr ? "المتابعة إلى الدفع قيد التطوير." : "Checkout coming soon."}
                </p>
                <p className="mt-4 border-t border-white/10 pt-4 text-center text-xs leading-relaxed text-gray-400">
                  {isAr
                    ? "الأسعار أعلاه لا تشمل ضريبة القيمة المضافة (15%)، والتي سيتم إضافتها عند إتمام عملية الدفع. (ملاحظة: هذا الإجراء مؤقت وسيتم تثبيته بشكل نهائي بعد استكمال ربط بوابات الدفع.)"
                    : "Prices shown above exclude 15% VAT, which will be added at checkout. (Note: this is provisional and will be finalized once payment providers are fully integrated.)"}
                </p>
                {currency !== "SAR" ? (
                  <p className="mt-2 text-center text-[10px] text-gray-500">
                    {isAr
                      ? "الأسعار المعروضة بعملة أخرى تقريبية. العملة الرسمية والمعتمدة للفواتير والدفع هي الريال السعودي."
                      : "Prices shown in another currency are indicative only. SAR is the official currency for invoicing and payment."}
                  </p>
                ) : null}
              </div>
            </div>
          )}
        </PageHeader>
  );
}
