"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Locale } from "@/lib/dictionaries";

type TickerItem = {
  id: string;
  headline_en: string;
  headline_ar: string;
  summary_en: string | null;
  summary_ar: string | null;
  source_url: string | null;
  source_name: string | null;
  category: string;
};

export default function Ticker({ locale }: { locale: Locale }) {
  const isAr = locale === "ar";
  const [items, setItems] = useState<TickerItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<TickerItem | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    supabase
      .from("ticker_items")
      .select("*")
      .eq("is_active", true)
      .order("sort_order")
      .then(({ data }) => {
        if (data) setItems(data as TickerItem[]);
      });
  }, []);

  if (items.length === 0) return null;

  return (
    <>
      {isVisible && (
        <div className="fixed bottom-0 left-0 w-full z-50 bg-[#070D19] border-t border-[#C5A880]/30 h-10">
          <div className="flex items-center h-full overflow-hidden">
            <div className="animate-ticker whitespace-nowrap">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="inline-flex items-center gap-2 px-6 text-[11px] font-bold uppercase tracking-wider text-[#C5A880] hover:text-white transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
                  {isAr ? item.headline_ar : item.headline_en}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="absolute right-0 top-0 h-full px-4 bg-[#0A1120] text-[10px] font-bold uppercase tracking-widest text-[#C5A880]"
          >
            {isAr ? "إخفاء" : "Hide"}
          </button>
        </div>
      )}

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
                {isAr ? selectedItem.summary_ar : selectedItem.summary_en}
              </p>

              <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
                <span className="text-[11px] text-gray-500 uppercase tracking-wider">
                  {selectedItem.source_name}
                </span>
                {selectedItem.source_url && (
                  <a
                    href={selectedItem.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[#C5A880] text-[#070D19] px-6 py-2 font-bold uppercase tracking-widest text-[10px]"
                  >
                    {isAr ? "المصدر" : "Source"}
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
