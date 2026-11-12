"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldAlert, ShieldCheck } from "lucide-react";

const MIN_STATEMENT_LENGTH = 200;

type StatementInfo = {
  valid: boolean;
  fullName: string;
  email: string;
  phone: string;
  expiresAt: string;
  status: string | null;
  highRisk: boolean;
  phoneVerified: boolean;
  requirePhoneVerification: boolean;
  minStatementLength: number;
};

export default function ProblemStatementPage() {
  const params = useParams();
  const locale = params?.locale === "ar" ? "ar" : "en";
  const isAr = locale === "ar";
  const rawToken = params?.token;
  const token = Array.isArray(rawToken) ? rawToken[0] : rawToken ?? "";

  const [info, setInfo] = useState<StatementInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [statement, setStatement] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!token) {
      setLoadError(
        isAr ? "رابط التحقق غير صالح." : "This verification link is invalid.",
      );
      setLoading(false);
      return;
    }

    let cancelled = false;

    fetch(`/api/verify/statement?token=${encodeURIComponent(token)}`, {
      cache: "no-store",
    })
      .then(async (res) => {
        const data = (await res.json().catch(() => ({}))) as
          | (StatementInfo & { error?: string })
          | { error?: string };
        if (cancelled) return;

        if (!res.ok || !("valid" in data) || !data.valid) {
          setLoadError(
            ("error" in data && data.error) ||
              (isAr ? "رابط التحقق غير صالح." : "This verification link is invalid."),
          );
          return;
        }

        const valid = data as StatementInfo;
        setInfo(valid);
        setFullName(valid.fullName ?? "");
        setPhone(valid.phone ?? "");
        setEmail(valid.email ?? "");
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError(
            isAr
              ? "تعذر التحقق من الرابط. يرجى المحاولة مرة أخرى."
              : "Could not verify the link. Please try again.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token, isAr]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/verify/statement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          fullName,
          phone,
          email,
          problemStatement: statement,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };

      if (!res.ok) {
        setSubmitError(
          data.error ??
            (isAr ? "تعذر إرسال البيان." : "Could not submit your statement."),
        );
        return;
      }

      setSubmitted(true);
    } catch {
      setSubmitError(
        isAr
          ? "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى."
          : "An unexpected error occurred. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#070D19] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-2xl bg-[#0A1120] border border-[#C5A880]/30 p-8 sm:p-10"
      >
        <div className="flex items-center justify-center gap-2 text-[#C5A880]">
          <ShieldCheck size={18} />
          <span className="text-[10px] font-bold uppercase tracking-[0.22em]">
            Tasheel Legal
          </span>
        </div>

        <h1 className="mt-4 font-serif-en text-3xl text-white text-center">
          {isAr ? "بيان المشكلة" : "Problem Statement"}
        </h1>
        <p className="mt-2 text-center text-sm text-gray-400">
          {isAr
            ? "أكمل النموذج ليتمكن فريقنا من مراجعة طلبك."
            : "Complete this form so our team can review your request."}
        </p>

        {loading && (
          <p className="mt-10 text-center text-gray-300">
            {isAr ? "جارٍ التحقق..." : "Verifying..."}
          </p>
        )}

        {!loading && loadError && (
          <div className="mt-8 border border-red-500/40 bg-red-500/10 px-4 py-4 text-sm text-red-300">
            <p>{loadError}</p>
            <Link
              href={`/${locale}/login`}
              className="mt-4 inline-block text-[#C5A880] hover:text-gold"
            >
              {isAr ? "العودة لتسجيل الدخول" : "Back to login"}
            </Link>
          </div>
        )}

        {!loading && !loadError && submitted && (
          <div className="mt-8 border border-emerald-500/40 bg-emerald-500/10 px-5 py-6 text-center text-sm text-emerald-200">
            <ShieldCheck className="mx-auto mb-3 h-7 w-7" />
            <p className="text-base text-white">
              {isAr
                ? "تم استلام بيانك."
                : "Your statement has been received."}
            </p>
            <p className="mt-2">
              {isAr
                ? "سيقوم فريقنا بمراجعته قريباً."
                : "Our team will review it shortly."}
            </p>
            <Link
              href={`/${locale}/login`}
              className="mt-6 inline-block border border-[#C5A880]/60 px-5 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#C5A880] hover:bg-[#C5A880]/10"
            >
              {isAr ? "تسجيل الدخول" : "Go to login"}
            </Link>
          </div>
        )}

        {!loading && !loadError && !submitted && info && (
          <>
            {info.requirePhoneVerification && (
              <div className="mt-6 flex items-start gap-3 border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                <ShieldAlert size={18} className="mt-0.5 shrink-0" />
                <p>
                  {isAr
                    ? "يتطلب هذا التسجيل التحقق من رقم الجوال قبل إرسال البيان. يرجى التواصل مع الدعم لإكمال التحقق عبر الرسائل النصية أو واتساب."
                    : "This registration requires phone verification before submitting. Please contact support to complete SMS/WhatsApp verification."}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-[11px] uppercase tracking-[0.18em] text-[#C5A880] mb-2"
                >
                  {isAr ? "الاسم الكامل" : "Full Name"}
                </label>
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#070D19] border border-white/10 px-4 py-3 text-sm text-white focus:border-[#C5A880] focus:outline-none"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-[11px] uppercase tracking-[0.18em] text-[#C5A880] mb-2"
                  >
                    {isAr ? "رقم الجوال" : "Phone"}
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#070D19] border border-white/10 px-4 py-3 text-sm text-white focus:border-[#C5A880] focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-[11px] uppercase tracking-[0.18em] text-[#C5A880] mb-2"
                  >
                    {isAr ? "البريد الإلكتروني" : "Email"}
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#070D19] border border-white/10 px-4 py-3 text-sm text-white focus:border-[#C5A880] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="statement"
                  className="block text-[11px] uppercase tracking-[0.18em] text-[#C5A880] mb-2"
                >
                  {isAr ? "بيان المشكلة" : "Problem Statement"}
                </label>
                <textarea
                  id="statement"
                  required
                  rows={7}
                  minLength={MIN_STATEMENT_LENGTH}
                  value={statement}
                  onChange={(e) => setStatement(e.target.value)}
                  className="w-full bg-[#070D19] border border-white/10 px-4 py-3 text-sm text-white focus:border-[#C5A880] focus:outline-none"
                  placeholder={
                    isAr
                      ? "اشرح موضوعك القانوني بالتفصيل..."
                      : "Describe your legal matter in detail..."
                  }
                />
                <p
                  className={
                    statement.trim().length >= MIN_STATEMENT_LENGTH
                      ? "mt-2 text-[11px] text-emerald-300"
                      : "mt-2 text-[11px] text-gray-500"
                  }
                >
                  {isAr
                    ? `${statement.trim().length} / ${MIN_STATEMENT_LENGTH} حرف كحد أدنى`
                    : `${statement.trim().length} / ${MIN_STATEMENT_LENGTH} characters minimum`}
                </p>
              </div>

              {submitError && (
                <p className="border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                disabled={
                  submitting ||
                  info.requirePhoneVerification ||
                  statement.trim().length < MIN_STATEMENT_LENGTH
                }
                className="w-full !min-w-0 h-[44px] bg-yellow-400 text-[#070D19] font-bold uppercase tracking-widest text-[11px] hover:bg-yellow-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting
                  ? isAr
                    ? "جارٍ الإرسال..."
                    : "Submitting..."
                  : isAr
                    ? "إرسال البيان"
                    : "Submit Statement"}
              </button>
            </form>
          </>
        )}

        <p className="mt-8 text-center text-[11px] text-gray-500">
          {isAr
            ? "هذا الرابط خاص بك، لا تشاركه مع أي شخص."
            : "This link is personal to you — please do not share it."}
        </p>
      </motion.div>
    </div>
  );
}
