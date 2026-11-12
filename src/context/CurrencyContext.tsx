"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

// Display-only currency conversion. SAR remains the sole canonical,
// transactional currency everywhere in the app (cart totals, checkout,
// stored orders). Selecting USD/EUR here only changes what number is
// SHOWN next to the SAR price; it never changes what is charged.
//
// Rates below are a static, indicative snapshot (not a live feed) because
// this environment cannot reach an external FX provider. Before this goes
// live, wire RATES/RATES_AS_OF to a real FX provider (e.g. via a small
// server route or edge function that can reach the network) and keep the
// "indicative only" disclaimer — do not present these as live rates.
export type CurrencyCode = "SAR" | "USD" | "EUR";

export const RATES_AS_OF = "2026-11-01";
const RATES: Record<CurrencyCode, number> = {
  SAR: 1,
  USD: 1 / 3.75, // SAR is pegged to USD at ~3.75
  EUR: 1 / 4.05, // indicative only, drifts with EUR/USD
};

const SYMBOLS: Record<CurrencyCode, string> = {
  SAR: "⃁", // official SAUDI RIYAL SIGN (Unicode 17.0)
  USD: "$",
  EUR: "€",
};

type CurrencyContextType = {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  convert: (sar: number) => number;
  formatSar: (sar: number) => string;
  ratesAsOf: string;
};

const CurrencyContext = createContext<CurrencyContextType | null>(null);
const STORAGE_KEY = "tasheel_currency";

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("SAR");

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === "SAR" || raw === "USD" || raw === "EUR") {
      setCurrencyState(raw);
    }
  }, []);

  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c);
    try {
      localStorage.setItem(STORAGE_KEY, c);
    } catch {
      // ignore (private browsing, storage disabled, etc.)
    }
  };

  const convert = (sar: number) => Number(sar) * RATES[currency];

  // Formats a SAR amount in the currently-selected display currency.
  // Always shows the symbol for the SELECTED currency; SAR amounts use the
  // official Saudi riyal sign (U+20C1) rather than the text "SAR".
  const formatSar = (sar: number) => {
    const amount = convert(sar);
    const rounded =
      currency === "SAR"
        ? Math.round(amount).toLocaleString("en-US")
        : amount.toLocaleString("en-US", { maximumFractionDigits: 2 });
    return `${SYMBOLS[currency]} ${rounded}`;
  };

  return (
    <CurrencyContext.Provider
      value={{ currency, setCurrency, convert, formatSar, ratesAsOf: RATES_AS_OF }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return ctx;
}
