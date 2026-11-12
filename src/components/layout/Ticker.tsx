"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Settings2, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Dictionary, Locale } from "@/lib/dictionaries";

type TickerProps = {
  locale: Locale;
  dict: Dictionary;
};

type TickerSettings = {
  hidden: boolean;
  textColor: string;
  bgColor: string;
  speed: number;
};

const DEFAULTS: TickerSettings = {
  hidden: false,
  textColor: "#FFFFFF",
  bgColor: "#070D19",
  speed: 20,
};

/* v2: navy/white defaults + RTL direction support */
const STORAGE_KEY = "tasheel-ticker-settings-v2";

/* Each chunk is a fixed 1000px period, so an x: [0, -1000] loop is seamless. */
const CHUNK_WIDTH = 1000;
const COPY_COUNT = 6;

export default function Ticker({ locale, dict }: TickerProps) {
  const [settings, setSettings] = useState<TickerSettings>(DEFAULTS);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<TickerSettings>;
        setSettings({ ...DEFAULTS, ...parsed });
      }
    } catch {
      /* ignore corrupted settings */
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* storage may be unavailable */
    }
  }, [settings, mounted]);

  useEffect(() => {
    if (!settingsOpen) return;
    const onDocClick = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [settingsOpen]);

  const [discountItems, setDiscountItems] = useState<
    { text: string; href: string; isDiscount: boolean }[]
  >([]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data } = await supabase
          .from("service_packages")
          .select("id, name_en, name_ar, price_sar, original_price_sar")
          .not("original_price_sar", "is", null)
          .eq("active", true);
        if (!active || !data) return;
        const items = data
          .filter((p: any) => p.original_price_sar && p.original_price_sar > p.price_sar)
          .map((p: any) => ({
            text: `${locale === "ar" ? p.name_ar : p.name_en} — ${Number(p.price_sar).toLocaleString()} SAR`,
            href: `/${locale}/store`,
            isDiscount: true,
          }));
        setDiscountItems(items);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      active = false;
    };
  }, [locale]);

  const updates = [
    { en: "New Saudi Companies Law: What international investors need to know.", ar: "نظام الشركات السعودي الجديد: ما يجب أن يعرفه المستثمرون الدوليون." },
    { en: "Vision 2030 update: New incentives for tech localization.", ar: "تحديثات رؤية 2030: حوافز جديدة لتوطين التقنية." },
    { en: "Tasheel Legal expands advisory services for cross-border M&A.", ar: "شركة تسهيل للمحاماة والاستشارات القانونية توسّع خدماتها الاستشارية لعمليات الاندماج والاستحواذ العابرة للحدود." },
    { en: "Strategic legal framework for regional headquarters (RHQ) in Riyadh.", ar: "الإطار القانوني الاستراتيجي للمقار الإقليمية (RHQ) في الرياض." },
  ];

  const newsItems = updates.map((u) => ({ text: u[locale], href: `/${locale}#insights`, isDiscount: false }));
  const allItems = [...newsItems, ...discountItems];
  const content = allItems.map((i) => i.text).join("  •  ");

  const patch = (partial: Partial<TickerSettings>) =>
    setSettings((current) => ({ ...current, ...partial }));

  // Restore button when the ticker is hidden
  if (mounted && settings.hidden) {
    return (
      <button
        type="button"
        onClick={() => patch({ hidden: false })}
        aria-label={locale === "ar" ? "إظهار الشريط الإخباري" : "Show ticker"}
        className="fixed bottom-3 right-3 z-50 flex h-9 w-9 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110"
        style={{ backgroundColor: DEFAULTS.bgColor, color: DEFAULTS.textColor }}
      >
        <Eye size={18} />
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-0 left-0 z-50 w-full shadow-[0_-6px_24px_rgba(0,0,0,0.35)]"
      style={{ backgroundColor: settings.bgColor, color: settings.textColor }}
    >
      {/* Controls rail (right side) */}
      <div className="absolute inset-y-0 right-0 z-10 flex items-center gap-1 px-3">
        <button
          type="button"
          onClick={() => patch({ hidden: true })}
          aria-label={locale === "ar" ? "إخفاء الشريط الإخباري" : "Hide ticker"}
          className="flex h-7 w-7 items-center justify-center rounded-sm opacity-60 transition-opacity hover:opacity-100"
        >
          <EyeOff size={15} />
        </button>
        <button
          type="button"
          onClick={() => setSettingsOpen((open) => !open)}
          aria-label={locale === "ar" ? "إعدادات الشريط الإخباري" : "Ticker settings"}
          className={`flex h-7 w-7 items-center justify-center rounded-sm transition-opacity hover:opacity-100 ${
            settingsOpen ? "opacity-100" : "opacity-60"
          }`}
        >
          <Settings2 size={15} />
        </button>
      </div>

      {/* Scroll content */}
      <div
        className="relative z-0 w-full overflow-hidden py-2 cursor-pointer"
        onClick={() => {
          if (discountItems.length > 0) {
            window.location.href = `/${locale}/store`;
          }
        }}
      >
        <div
          /* Remount on speed/locale change so the CSS animation restarts
             with the new duration and direction. */
          key={`${locale}-${settings.speed}`}
          dir="ltr"
          className="ticker-track flex w-max whitespace-nowrap"
          style={{
            animationName: locale === "ar" ? "ticker-scroll-rtl" : "ticker-scroll-ltr",
            animationDuration: `${settings.speed}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            willChange: "transform",
          }}
        >
          {Array.from({ length: COPY_COUNT }).map((_, copyIdx) => (
            <div
              key={copyIdx}
              style={{ width: CHUNK_WIDTH }}
              className="flex shrink-0 items-center px-6"
            >
              <span
                dir={locale === "ar" ? "rtl" : "ltr"}
                className="w-full text-[11px] font-bold uppercase tracking-widest truncate rtl:text-right rtl:tracking-normal rtl:normal-case rtl:text-[13px]"
              >
                {content}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Settings popover */}
      <AnimatePresence>
        {settingsOpen && (
          <motion.div
            ref={popoverRef}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25 }}
            className="absolute bottom-full right-2 z-20 mb-3 w-72 border border-gold/40 bg-[#0A1120] p-5 text-cream shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-serif-en text-sm text-gold">
                {locale === "ar" ? "إعدادات الشريط" : "Ticker Settings"}
              </h4>
              <button
                type="button"
                onClick={() => setSettingsOpen(false)}
                aria-label={locale === "ar" ? "إغلاق" : "Close"}
                className="text-cream/50 transition-colors hover:text-cream"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-5 space-y-5">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[12px] text-cream/80">
                  {locale === "ar" ? "لون النص" : "Text color"}
                </span>
                <input
                  type="color"
                  value={settings.textColor}
                  onChange={(event) => patch({ textColor: event.target.value })}
                  className="h-8 w-14 cursor-pointer border border-cream/20 bg-transparent"
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-[12px] text-cream/80">
                  {locale === "ar" ? "لون الخلفية" : "Background color"}
                </span>
                <input
                  type="color"
                  value={settings.bgColor}
                  onChange={(event) => patch({ bgColor: event.target.value })}
                  className="h-8 w-14 cursor-pointer border border-cream/20 bg-transparent"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-[12px] text-cream/80">
                  <span>{locale === "ar" ? "سرعة التمرير" : "Scroll speed"}</span>
                  <span className="text-gold">{settings.speed}s</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={60}
                  step={1}
                  value={settings.speed}
                  onChange={(event) => patch({ speed: Number(event.target.value) })}
                  className="mt-3 w-full accent-yellow-400"
                />
              </div>

              <button
                type="button"
                onClick={() => setSettings(DEFAULTS)}
                className="w-full border border-cream/20 py-2 text-[11px] uppercase tracking-widest text-cream/60 transition-colors hover:border-gold hover:text-gold"
              >
                {locale === "ar" ? "استعادة الافتراضي" : "Reset to default"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
