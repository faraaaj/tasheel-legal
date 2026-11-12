"use client";

import { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

const RESEND_COOLDOWN = 60;

type Step = "email" | "phone" | "done";

interface PendingAuth {
  email: string;
  password: string;
  phone: string;
  userId: string;
}

export default function VerifyPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === "ar" ? "ar" : "en";
  const isAr = locale === "ar";

  const [pending, setPending] = useState<PendingAuth | null>(null);
  const [step, setStep] = useState<Step>("email");

  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [sentOnce, setSentOnce] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("tasheel_pending_auth");
    if (!raw) {
      // No pending registration in this browser session — send them
      // back to register rather than showing a dead verify screen.
      router.replace(`/${locale}/register`);
      return;
    }
    setPending(JSON.parse(raw));
  }, [router, locale]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  // Auto-send the first code for each step as soon as we know who
  // we're verifying and which step we're on.
  useEffect(() => {
    if (!pending || sentOnce) return;
    setSentOnce(true);
    void sendCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending, step]);

  const identifierFor = (s: Step, p: PendingAuth) => (s === "email" ? p.email : p.phone);

  const friendlyError = (message: string) => {
    const m = message.toLowerCase();
    if (m.includes("expired") || m.includes("invalid")) {
      return isAr
        ? "الرمز غير صحيح أو منتهي الصلاحية. يرجى طلب رمز جديد."
        : "That code is invalid or has expired. Please request a new one.";
    }
    if (m.includes("rate limit") || m.includes("too many")) {
      return isAr
        ? "محاولات كثيرة جداً. يرجى الانتظار قليلاً ثم المحاولة مرة أخرى."
        : "Too many attempts. Please wait a moment and try again.";
    }
    return message;
  };

  const sendCode = async () => {
    if (!pending) return;
    setError(null);
    setInfo(null);
    const res = await fetch("/api/auth/otp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ method: step === "email" ? "email" : "sms", identifier: identifierFor(step, pending) }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(friendlyError(data.error ?? "Failed to send code."));
      return;
    }
    setCooldown(RESEND_COOLDOWN);
    setInfo(
      step === "email"
        ? isAr
          ? "تم إرسال رمز إلى بريدك الإلكتروني."
          : "A code has been sent to your email."
        : isAr
          ? "تم إرسال رمز إلى جوالك."
          : "A code has been sent to your phone.",
    );
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setLoading(true);
    await sendCode();
    setLoading(false);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!pending) return;
    setLoading(true);
    setError(null);
    setInfo(null);

    const res = await fetch("/api/auth/otp/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        method: step === "email" ? "email" : "sms",
        identifier: identifierFor(step, pending),
        otp: code.trim(),
        userId: pending.userId,
      }),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(friendlyError(data.error ?? "Verification failed."));
      setLoading(false);
      return;
    }

    if (step === "email") {
      setStep("phone");
      setCode("");
      setSentOnce(false);
      setLoading(false);
      return;
    }

    // Both steps done: establish the real Supabase session now.
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: pending.email,
      password: pending.password,
    });
    sessionStorage.removeItem("tasheel_pending_auth");

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    setStep("done");
    router.push(`/${locale}/dashboard`);
  };

  if (!pending) return null;

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#070D19] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md bg-[#0A1120] border border-[#C5A880]/30 p-8 sm:p-10"
      >
        <h1 className="font-serif-en text-3xl text-white text-center">
          {step === "email"
            ? isAr
              ? "تأكيد البريد الإلكتروني"
              : "Verify Your Email"
            : isAr
              ? "تأكيد رقم الجوال"
              : "Verify Your Phone"}
        </h1>
        <p className="mt-2 text-center text-sm text-gray-400">
          {step === "email"
            ? isAr
              ? `أدخل رمز التحقق المرسل إلى ${pending.email}`
              : `Enter the code sent to ${pending.email}`
            : isAr
              ? `أدخل رمز التحقق المرسل إلى ${pending.phone}`
              : `Enter the code sent to ${pending.phone}`}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="code" className="block text-[11px] uppercase tracking-[0.18em] text-[#C5A880] mb-2">
              {isAr ? "رمز التحقق" : "Verification Code"}
            </label>
            <input
              id="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
              className="w-full bg-[#070D19] border border-white/10 px-4 py-3 text-center text-2xl tracking-[0.5em] text-white placeholder:text-gray-500 focus:border-[#C5A880] focus:outline-none"
              placeholder="------"
            />
          </div>

          {error && <p className="text-sm text-red-400 text-center">{error}</p>}
          {info && !error && <p className="text-sm text-[#C5A880] text-center">{info}</p>}

          <button
            type="submit"
            disabled={loading || code.length < 4}
            className="w-full !min-w-0 h-[44px] bg-yellow-400 text-[#070D19] font-bold uppercase tracking-widest text-[11px] hover:bg-yellow-500 transition-all disabled:opacity-40"
          >
            {loading ? (isAr ? "جارٍ التحقق..." : "Verifying...") : isAr ? "تأكيد" : "Verify"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          <button
            type="button"
            onClick={handleResend}
            disabled={loading || cooldown > 0}
            className="text-[#C5A880] hover:text-gold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {cooldown > 0
              ? isAr
                ? `إعادة الإرسال متاحة بعد ${cooldown} ثانية`
                : `Resend available in ${cooldown}s`
              : isAr
                ? "إعادة إرسال الرمز"
                : "Resend code"}
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-400">
          {isAr ? "عدت لتسجيل الدخول؟" : "Back to login?"}{" "}
          <Link href={`/${locale}/login`} className="text-[#C5A880] hover:text-gold transition-colors">
            {isAr ? "تسجيل الدخول" : "Login"}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
