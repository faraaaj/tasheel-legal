"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowRight, CheckCircle2, Lock } from "lucide-react";
import { DiscountBanner } from "@/components/ui/DiscountBanner";
import type { Locale } from "@/lib/dictionaries";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { supabase } from "@/lib/supabase";

export type StorePackage = {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  outcomesEn?: string[];
  outcomesAr?: string[];
  requirementsEn?: string[];
  requirementsAr?: string[];
  detailsEn?: string;
  detailsAr?: string;
  priceSar: number;
  priceLabelEn?: string;
  priceLabelAr?: string;
  originalPriceSar?: number;
  discountLabelEn?: string;
  discountLabelAr?: string;
  validityDays?: number;
  maxSeats?: number;
  featured?: boolean;
  badgeEn?: string;
  badgeAr?: string;
  cardNumber?: number;
};

type StoreCardProps = {
  pkg: StorePackage;
  locale: Locale;
};

export default function StoreCard({ pkg, locale }: StoreCardProps) {
  const [selected, setSelected] = useState(false);
  // Detailed popup content (outcomes, requirements, scope/conditions) is
  // IP-sensitive and is gated behind a verified, approved customer account.
  // The card's own summary (title, full description, price) stays public.
  const [isApproved, setIsApproved] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  // Gated content (outcomes/requirements/details) is fetched on demand from
  // the protected /api/packages/[id]/details route the moment the popup is
  // opened for an approved, verified user — never passed in as a prop, so
  // it never reaches the browser for anyone else.
  const [gatedContent, setGatedContent] = useState<{
    outcomesEn?: string[]; outcomesAr?: string[];
    requirementsEn?: string[]; requirementsAr?: string[];
    detailsEn?: string; detailsAr?: string;
    detailsJsonEn?: { sections?: { heading?: string | null; items?: string[] }[] } | null;
    detailsJsonAr?: { sections?: { heading?: string | null; items?: string[] }[] } | null;
  } | null>(null);
  const [gatedLoading, setGatedLoading] = useState(false);
  const [gatedError, setGatedError] = useState(false);
  const { addToCart } = useCart();
  const { currency, formatSar } = useCurrency();
  const isAr = locale === "ar";

  useEffect(() => {
    let active = true;
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) {
        if (active) { setIsApproved(false); setHasSession(false); setAuthChecked(true); }
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_approved")
        .eq("id", user.id)
        .maybeSingle();
      if (active) {
        setHasSession(true);
        setIsApproved(Boolean(profile?.is_approved));
        setAuthChecked(true);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const title = isAr ? pkg.nameAr : pkg.nameEn;
  const description = isAr ? pkg.descriptionAr : pkg.descriptionEn;
  const details = isAr ? gatedContent?.detailsAr : gatedContent?.detailsEn;
  const detailsJson = isAr ? gatedContent?.detailsJsonAr : gatedContent?.detailsJsonEn;
  const outcomes = isAr ? gatedContent?.outcomesAr : gatedContent?.outcomesEn;
  const requirements = isAr ? gatedContent?.requirementsAr : gatedContent?.requirementsEn;
  // The front card always shows the final, clean price only. Any discount,
  // bundle rationale or "normally costs X" context lives in `details`,
  // written in plain language, and is shown only in the popup.
  const hasSpecialLabel = Boolean(pkg.priceLabelEn || pkg.priceLabelAr);
  const priceLabel =
    hasSpecialLabel
      ? isAr
        ? pkg.priceLabelAr ?? formatSar(pkg.priceSar)
        : pkg.priceLabelEn ?? formatSar(pkg.priceSar)
      : formatSar(pkg.priceSar);
  const fxNote =
    !hasSpecialLabel && currency !== "SAR"
      ? isAr
        ? "سعر تقريبي — السعر الرسمي بالريال السعودي"
        : "Indicative — SAR is the official price"
      : null;
  const addLabel = isAr ? "أضف إلى السلة" : "Add to Cart";
  const detailsLabel = isAr ? "التفاصيل" : "View Details";
  const badge = isAr ? pkg.badgeAr : pkg.badgeEn;
  const valueHeading = isAr ? "نظرة عامة ونطاق الباقة" : "Service Overview & Scope";
  const outcomesHeading = isAr ? "ما الذي ستحصل عليه" : "Outcomes & Deliverables";
  const requirementsHeading = isAr ? "ما نحتاجه منك" : "What We Need From You";
  const lockedHeading = isAr ? "محتوى محجوب" : "Detailed Content Locked";
  const lockedBody = isAr
    ? "نطاق الخدمات والمتطلبات والتفاصيل الكاملة لهذه الباقة متاحة فقط لعملائنا المسجلين والمعتمدين. يرجى تسجيل الدخول أو إنشاء حساب لمراجعة طلبك."
    : "The full scope, requirements and details for this package are available only to registered, approved clients. Please log in or create an account so we can verify you before sharing these details.";
  const loginLabel = isAr ? "تسجيل الدخول" : "Log In";
  const registerLabel = isAr ? "إنشاء حساب" : "Create Account";
  const pendingBody = isAr
    ? "حسابك قيد المراجعة. سيتم تفعيل الوصول إلى تفاصيل الباقات بعد اعتماد حسابك."
    : "Your account is pending approval. Access to detailed package content will be enabled once your account is approved.";

  const handleAdd = () => {
    addToCart({
      id: pkg.id,
      nameEn: pkg.nameEn,
      nameAr: pkg.nameAr,
      priceSar: Number(pkg.priceSar ?? 0),
      validityDays: pkg.validityDays ?? 365,
      maxSeats: pkg.maxSeats ?? 1,
    });
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={`group relative flex h-full flex-col overflow-hidden border p-8 text-start transition-colors duration-300 ${
          pkg.featured
            ? "border-[#C5A880]/50 bg-[#0C1426] shadow-[0_0_0_1px_rgba(197,168,128,0.15)] hover:border-[#C5A880] hover:shadow-[0_24px_60px_-15px_rgba(197,168,128,0.4)]"
            : "border-white/10 bg-[#0A1120] hover:border-[#C5A880]/50 hover:shadow-[0_24px_60px_-18px_rgba(197,168,128,0.3)]"
        }`}
      >
        {pkg.originalPriceSar && pkg.originalPriceSar > pkg.priceSar && (
          <DiscountBanner
            label={locale === "ar" ? (pkg.discountLabelAr ?? "") : (pkg.discountLabelEn ?? "")}
            originalPrice={pkg.originalPriceSar}
            discountedPrice={pkg.priceSar}
            locale={locale}
          />
        )}
        {/* Top accent bar: reveals left-to-right on hover */}
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-[#C5A880] via-[#e8d5ac] to-[#C5A880] transition-transform duration-500 ease-out group-hover:scale-x-100"
        />
        {/* Diagonal sheen sweep on hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#C5A880]/10 to-transparent opacity-0 transition-all duration-700 group-hover:translate-x-full group-hover:opacity-100"
        />
        {/* Soft ambient glow that fades in on hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(420px circle at var(--mx,50%) var(--my,0%), rgba(197,168,128,0.08), transparent 70%)",
          }}
        />

        {badge ? (
          <motion.span
            animate={{ boxShadow: ["0 0 0px rgba(197,168,128,0)", "0 0 16px rgba(197,168,128,0.35)", "0 0 0px rgba(197,168,128,0)"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="mb-4 inline-flex w-fit items-center border border-[#C5A880]/50 bg-[#C5A880]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C5A880] rtl:tracking-normal"
          >
            {badge}
          </motion.span>
        ) : null}

        <h2
          className={`line-clamp-2 min-h-[2.6em] font-serif-en text-white transition-colors duration-300 group-hover:text-[#e8d5ac] ${
            pkg.featured ? "text-2xl sm:text-[1.7rem]" : "text-xl sm:text-2xl"
          }`}
        >
          {title}
        </h2>

        <p className="mt-4 text-[15px] leading-[1.9] text-gray-300 text-justify rtl:text-justify">
          {description}
        </p>

        <div className="mt-auto pt-8">
          <p className="text-xl font-semibold text-[#C5A880]">{priceLabel}</p>
          {fxNote ? <p className="mt-1 text-[10px] text-gray-500">{fxNote}</p> : null}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex h-[42px] items-center justify-center bg-yellow-400 px-5 text-[10px] font-bold uppercase tracking-widest text-[#070D19] transition-all hover:scale-[1.04] hover:bg-yellow-500 hover:shadow-[0_0_24px_rgba(250,204,21,0.5)] rtl:tracking-normal"
            >
              {addLabel}
            </button>
            <button
              type="button"
              onClick={() => {
                setSelected(true);
                if (isApproved && !gatedContent && !gatedLoading) {
                  setGatedLoading(true);
                  setGatedError(false);
                  (async () => {
                    const { data: sessionData } = await supabase.auth.getSession();
                    const token = sessionData.session?.access_token;
                    if (!token) {
                      setGatedError(true);
                      setGatedLoading(false);
                      return;
                    }
                    try {
                      const res = await fetch(`/api/packages/${pkg.id}/details`, {
                        headers: { Authorization: `Bearer ${token}` },
                      });
                      if (!res.ok) {
                        setGatedError(true);
                        return;
                      }
                      const json = await res.json();
                      setGatedContent({
                        outcomesEn: json.outcomesEn ?? undefined,
                        outcomesAr: json.outcomesAr ?? undefined,
                        requirementsEn: json.requirementsEn ?? undefined,
                        requirementsAr: json.requirementsAr ?? undefined,
                        detailsEn: json.detailsEn ?? undefined,
                        detailsAr: json.detailsAr ?? undefined,
                        detailsJsonEn: json.detailsJsonEn ?? undefined,
                        detailsJsonAr: json.detailsJsonAr ?? undefined,
                      });
                    } catch {
                      setGatedError(true);
                    } finally {
                      setGatedLoading(false);
                    }
                  })();
                }
              }}
              className="group/btn inline-flex h-[42px] items-center justify-center gap-2 border border-[#C5A880] px-5 text-[10px] font-bold uppercase tracking-widest text-[#C5A880] transition-all hover:bg-[#C5A880] hover:text-[#070D19] rtl:tracking-normal"
            >
              {detailsLabel}
              <ArrowRight
                size={12}
                className="transition-transform duration-300 group-hover/btn:translate-x-1 rtl:rotate-180 rtl:group-hover/btn:-translate-x-1"
              />
            </button>
            {pkg.cardNumber ? (
              <span
                aria-hidden
                className="ms-auto select-none font-serif-en text-3xl font-black leading-none text-[#eaf6ff] sm:text-4xl"
                style={{ textShadow: "0 0 14px rgba(179,224,255,0.85), 0 0 28px rgba(125,200,255,0.45)" }}
              >
                #{pkg.cardNumber}
              </span>
            ) : null}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-[#070D19]/90 p-4 backdrop-blur-xl"
            onClick={() => setSelected(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.9, rotateX: 4 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, y: 30, scale: 0.92 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              style={{ perspective: 1200 }}
              className="relative flex h-[90vh] w-full max-w-3xl flex-col overflow-hidden border border-[#C5A880]/30 bg-[#0A1120] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#C5A880] via-[#e8d5ac] to-[#C5A880]"
              />
              <button
                onClick={() => setSelected(false)}
                className="absolute top-4 end-4 z-10 rounded-full bg-[#070D19]/60 p-2 text-white/70 transition-all hover:rotate-90 hover:text-[#C5A880]"
                aria-label={isAr ? "إغلاق" : "Close"}
              >
                <X size={20} />
              </button>

              <div className="scrollbar-hide overflow-y-auto p-8 md:p-10 text-start">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08, duration: 0.3 }}
                >
                  {badge ? (
                    <span className="mb-4 inline-flex w-fit items-center border border-[#C5A880]/50 bg-[#C5A880]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C5A880] rtl:tracking-normal">
                      {badge}
                    </span>
                  ) : null}
                  <h2 className="font-serif-en text-3xl text-white">{title}</h2>
                  <p className="mt-4 text-[16px] leading-[1.9] text-gray-300 text-justify rtl:text-justify">
                    {description}
                  </p>
                </motion.div>

                {authChecked && isApproved ? (
                  <>
                    {gatedLoading ? (
                      <div className="mt-8 border-t border-white/10 pt-8 text-center text-sm text-gray-400">
                        {isAr ? "جارٍ تحميل التفاصيل..." : "Loading details..."}
                      </div>
                    ) : null}
                    {gatedError ? (
                      <div className="mt-8 border-t border-white/10 pt-8 text-center text-sm text-red-400">
                        {isAr ? "تعذر تحميل التفاصيل. حاول مرة أخرى." : "Could not load details. Please try again."}
                      </div>
                    ) : null}
                    {outcomes && outcomes.length > 0 ? (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.3 }}
                        className="mt-8 border-t border-white/10 pt-8"
                      >
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C5A880] rtl:tracking-normal">
                          {outcomesHeading}
                        </p>
                        <ul className="mt-4 space-y-3">
                          {outcomes.map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm leading-[1.8] text-gray-200">
                              <CheckCircle2
                                size={16}
                                className="mt-0.5 shrink-0 text-[#C5A880]"
                              />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    ) : null}

                    {requirements && requirements.length > 0 ? (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.19, duration: 0.3 }}
                        className="mt-8 border-t border-white/10 pt-8"
                      >
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C5A880] rtl:tracking-normal">
                          {requirementsHeading}
                        </p>
                        <ul className="mt-4 space-y-3">
                          {requirements.map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm leading-[1.8] text-gray-200">
                              <CheckCircle2
                                size={16}
                                className="mt-0.5 shrink-0 text-[#C5A880]"
                              />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    ) : null}

                    {detailsJson && Array.isArray(detailsJson.sections) && detailsJson.sections.length > 0 ? (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.22, duration: 0.3 }}
                        className="mt-8 border-t border-white/10 pt-8"
                      >
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C5A880] rtl:tracking-normal">
                          {valueHeading}
                        </p>
                        <div className="mt-4 space-y-6">
                          {detailsJson.sections.map((section, idx) => (
                            <div key={idx}>
                              {section?.heading ? (
                                <h4 className="text-lg font-bold text-white mb-2">
                                  {section.heading}
                                </h4>
                              ) : null}
                              {Array.isArray(section?.items) && section.items.length > 0 ? (
                                <ul className="space-y-2">
                                  {section.items.map((item, i) => (
                                    <li
                                      key={i}
                                      className="flex items-start gap-2 text-sm leading-[1.8] text-gray-300"
                                    >
                                      <CheckCircle2
                                        size={16}
                                        className="mt-0.5 shrink-0 text-[#C5A880]"
                                      />
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ) : details ? (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.22, duration: 0.3 }}
                        className="mt-8 border-t border-white/10 pt-8"
                      >
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C5A880] rtl:tracking-normal">
                          {valueHeading}
                        </p>
                        <p className="mt-4 whitespace-pre-line text-sm leading-[1.9] text-gray-300 text-justify rtl:text-justify">
                          {details}
                        </p>
                      </motion.div>
                    ) : null}
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.3 }}
                    className="mt-8 border-t border-white/10 pt-8"
                  >
                    <div className="flex items-start gap-3 border border-[#C5A880]/30 bg-[#C5A880]/5 p-5">
                      <Lock size={18} className="mt-0.5 shrink-0 text-[#C5A880]" />
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C5A880] rtl:tracking-normal">
                          {lockedHeading}
                        </p>
                        <p className="mt-3 text-sm leading-[1.8] text-gray-300 text-justify rtl:text-justify">
                          {hasSession ? pendingBody : lockedBody}
                        </p>
                        {!hasSession ? (
                          <div className="mt-4 flex gap-3">
                            <a
                              href={`/${locale}/login`}
                              className="inline-flex h-[38px] items-center justify-center border border-[#C5A880] px-4 text-[10px] font-bold uppercase tracking-widest text-[#C5A880] transition-all hover:bg-[#C5A880] hover:text-[#070D19] rtl:tracking-normal"
                            >
                              {loginLabel}
                            </a>
                            <a
                              href={`/${locale}/register`}
                              className="inline-flex h-[38px] items-center justify-center bg-yellow-400 px-4 text-[10px] font-bold uppercase tracking-widest text-[#070D19] transition-all hover:bg-yellow-500 rtl:tracking-normal"
                            >
                              {registerLabel}
                            </a>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xl font-semibold text-[#C5A880]">{priceLabel}</p>
                    {fxNote ? <p className="mt-1 text-[10px] text-gray-500">{fxNote}</p> : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handleAdd();
                      setSelected(false);
                    }}
                    className="inline-flex h-[44px] items-center justify-center bg-yellow-400 px-8 text-[10px] font-bold uppercase tracking-widest text-[#070D19] transition-all hover:scale-[1.04] hover:bg-yellow-500 hover:shadow-[0_0_24px_rgba(250,204,21,0.5)] rtl:tracking-normal"
                  >
                    {addLabel}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
