"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Sparkles, Lock, Settings, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/dictionaries";

type TickerItem = {
  id: string;
  headline_en: string;
  headline_ar: string;
  teaser_en: string | null;
  teaser_ar: string | null;
  ai_summary_en: string | null;
  ai_summary_ar: string | null;
  source_url: string | null;
  source_name: string | null;
  category: string;
  ai_generated: boolean;
};

export default function Ticker({ locale }: { locale: Locale }) {
  const isAr = locale === "ar";
  const router = useRouter();
  const [items, setItems] = useState<TickerItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<TickerItem | null>(null);
  const [showAI, setShowAI] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [speed, setSpeed] = useState(40);

  useEffect(() => {
    supabase
      .from("ticker_items")
      .select("*")
      .eq("is_active", true)
      .order("sort_order")
      .then(({ data }) => {
        if (data) setItems(data as TickerItem[]);
      });

    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsAuthenticated(!!user);
    });
  }, []);

  const handleSourceClick = (url: string) => {
    if (!isAuthenticated) {
      router.push(`/${locale}/login`);
      return;
    }
    window.open(url, "_blank");
  };

  if (items.length === 0) return null;

  return (
    <>
      {/* Ticker Bar */}
      <div className={`fixed bottom-0 left-0 w-full z-50 bg-[#070D19] border-t border-[#C5A880]/30 transition-transform duration-500 ${isVisible ? "translate-y-0" : "translate-y-full"}`}>
        <div className="flex items-center h-10 overflow-hidden relative">
          <div className="flex-1 overflow-hidden">
            <div
              className="animate-ticker whitespace-nowrap inline-flex"
              style={{ animationDuration: `${speed}s` }}
            >
              {[...items, ...items].map((item, idx) => (
                <button
                  key={`${item.id}-${idx}`}
                  onClick={() => { setSelectedItem(item); setShowAI(false); }}
                  className="inline-flex items-center gap-2 px-6 text-[11px] font-bold uppercase tracking-wider text-[#C5A880] hover:text-white transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
                  {isAr ? item.headline_ar : item.headline_en}
                </button>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1 px-2 bg-[#0A1120] h-full">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-[#C5A880] hover:text-white transition-colors"
              aria-label="Ticker Settings"
            >
              <Settings size={14} />
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="p-2 text-[#C5A880] hover:text-white transition-colors"
              aria-label="Hide Ticker"
            >
              <EyeOff size={14} />
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-10 right-0 w-64 bg-[#0A1120] border border-[#C5A880]/30 p-4 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A880]">
                  {isAr ? "إعدادات الشريط" : "Ticker Settings"}
                </span>
                <button onClick={() => setShowSettings(false)} className="text-white/50 hover:text-white">
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1">
                    {isAr ? "السرعة" : "Speed"}
                  </label>
                  <input
                    type="range"
                    min={10}
                    max={80}
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="w-full accent-[#C5A880]"
                  />
                  <span className="text-[10px] text-gray-500">{speed}s</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Show Button (when ticker is hidden) */}
      {!isVisible && (
        <button
          onClick={() => setIsVisible(true)}
          className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-[#C5A880] text-[#070D19] px-4 py-2 text-[10px] font-bold uppercase tracking-widest shadow-lg hover:bg-[#B0926D] transition-colors"
        >
          <Eye size={14} />
          {isAr ? "إظهار الشريط" : "Show Ticker"}
        </button>
      )}

      {/* Popup Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#070D19]/90 backdrop-blur-xl p-4"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-[#0A1120] border border-[#C5A880]/30 p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`absolute top-4 ${isAr ? "left-4" : "right-4"}`}>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#C5A880]">
                  {selectedItem.category}
                </span>
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 text-white/70 hover:text-gold"
                aria-label={isAr ? "إغلاق" : "Close"}
              >
                <X size={20} />
              </button>

              <h3 className="mt-6 font-serif-en text-2xl text-white">
                {isAr ? selectedItem.headline_ar : selectedItem.headline_en}
              </h3>
              <p className="mt-4 text-[15px] leading-[1.8] text-gray-300">
                {isAr ? selectedItem.teaser_ar : selectedItem.teaser_en}
              </p>

              {!showAI ? (
                <button
                  onClick={() => setShowAI(true)}
                  className="mt-6 flex items-center gap-2 bg-[#C5A880] text-[#070D19] px-6 py-3 font-bold uppercase tracking-widest text-[10px]"
                >
                  <Sparkles size={14} />
                  {isAr ? "اطلب تحليلاً قانونياً" : "Request Legal Analysis"}
                </button>
              ) : (
                <div className="mt-6 p-4 bg-[#070D19] border border-[#C5A880]/20">
                  <p className="text-[14px] leading-[1.8] text-gray-300 text-justify rtl:text-justify">
                    {isAr ? selectedItem.ai_summary_ar : selectedItem.ai_summary_en}
                  </p>
                </div>
              )}

              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                <span className="text-[11px] text-gray-500 uppercase tracking-wider">
                  {selectedItem.source_name}
                </span>
                <button
                  onClick={() => handleSourceClick(selectedItem.source_url || "")}
                  className="flex items-center gap-2 text-[#C5A880] hover:text-white text-[11px] uppercase tracking-wider"
                >
                  {isAuthenticated ? (
                    <>
                      {isAr ? "المصدر" : "Source"}
                      <ExternalLink size={12} />
                    </>
                  ) : (
                    <>
                      {isAr ? "سجل الدخول للمصدر" : "Login to View Source"}
                      <Lock size={12} />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
