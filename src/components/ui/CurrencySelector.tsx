"use client";

import { useState } from "react";
import { useCurrency, type CurrencyCode } from "@/context/CurrencyContext";

const OPTIONS: { code: CurrencyCode; label: string }[] = [
  { code: "SAR", label: "SAR" },
  { code: "USD", label: "USD" },
  { code: "EUR", label: "EUR" },
];

type Props = {
  isAr: boolean;
  className?: string;
};

// Compact currency selector for the header, placed next to the cart icon.
// Changing it only changes the displayed currency (see CurrencyContext) —
// it never changes what is charged. Rates are indicative, not live; see
// CurrencyContext.tsx for the note on wiring a real FX provider.
export default function CurrencySelector({ isAr, className }: Props) {
  const { currency, setCurrency, ratesAsOf } = useCurrency();
  const [open, setOpen] = useState(false);

  return (
    <div className={`relative ${className ?? ""}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center text-[11px] font-bold uppercase tracking-widest text-cream/70 transition-colors hover:text-gold"
        aria-label={isAr ? "اختيار العملة" : "Select currency"}
      >
        {currency}
      </button>
      {open ? (
        <div
          className="absolute end-0 top-full z-50 mt-2 w-40 border border-cream/15 bg-[#070D19] py-2 shadow-xl"
          onMouseLeave={() => setOpen(false)}
        >
          {OPTIONS.map((opt) => (
            <button
              key={opt.code}
              type="button"
              onClick={() => {
                setCurrency(opt.code);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between px-4 py-2 text-[11px] font-semibold uppercase tracking-widest transition-colors ${
                opt.code === currency ? "text-gold" : "text-cream/70 hover:text-gold"
              }`}
            >
              {opt.label}
            </button>
          ))}
          <p className="mt-1 px-4 pt-2 text-[9px] leading-snug text-cream/40">
            {isAr
              ? `أسعار صرف تقريبية بتاريخ ${ratesAsOf}. السعر الرسمي والمعتمد للمعاملات هو بالريال السعودي.`
              : `Indicative rates as of ${ratesAsOf}. SAR remains the official, binding transaction currency.`}
          </p>
        </div>
      ) : null}
    </div>
  );
}
