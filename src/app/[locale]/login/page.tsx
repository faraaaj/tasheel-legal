"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { getDictionary } from "@/lib/dictionaries";

export default function LoginPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === "ar" ? "ar" : "en";
  const dict = getDictionary(locale);
  const isAr = locale === "ar";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    const user = signInData.user;
    if (!user) {
      setError(isAr ? "تعذر تسجيل الدخول." : "Could not sign in.");
      setLoading(false);
      return;
    }

    // Hard rule: an account that has not finished BOTH email and phone OTP
    // verification is never allowed into the site, even though the
    // Supabase password credentials are valid. Check profiles directly.
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("phone, email_verified, phone_verified, is_approved")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      await supabase.auth.signOut();
      setError(isAr ? "تعذر التحقق من حالة الحساب." : "Could not verify account status.");
      setLoading(false);
      return;
    }

    // Approved accounts are trusted and bypass the OTP verification gate.
    // Pending accounts must finish BOTH email and phone OTP verification.
    if (!profile.is_approved && (!profile.email_verified || !profile.phone_verified)) {
      // Don't leave a half-verified session active. Sign out immediately,
      // stash what the verify page needs, and send them to finish OTP.
      await supabase.auth.signOut();
      sessionStorage.setItem(
        "tasheel_pending_auth",
        JSON.stringify({
          email,
          password,
          phone: profile.phone ?? "",
          userId: user.id,
        }),
      );
      router.push(`/${locale}/verify`);
      return;
    }

    router.push(`/${locale}/dashboard`);
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#070D19] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md bg-[#0A1120] border border-[#C5A880]/30 p-8 sm:p-10"
      >
        <h1 className="font-serif-en text-3xl text-white text-center">{isAr ? "تسجيل الدخول" : "Login"}</h1>
        <p className="mt-2 text-center text-sm text-gray-400">
          {isAr ? "مرحباً بك في شركة تسهيل" : "Welcome to Tasheel Legal"}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="block text-[11px] uppercase tracking-[0.18em] text-[#C5A880] mb-2">
              {isAr ? "البريد الإلكتروني" : "Email"}
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#070D19] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-[#C5A880] focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-[11px] uppercase tracking-[0.18em] text-[#C5A880] mb-2">
              {isAr ? "كلمة المرور" : "Password"}
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#070D19] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-[#C5A880] focus:outline-none"
            />
          </div>

          {error && <p className="text-sm text-red-400 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full !min-w-0 h-[44px] bg-yellow-400 text-[#070D19] font-bold uppercase tracking-widest text-[11px] hover:bg-yellow-500 transition-all disabled:opacity-40"
          >
            {loading ? (isAr ? "جارٍ التسجيل..." : "Logging in...") : isAr ? "تسجيل الدخول" : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          {isAr ? "ليس لديك حساب؟" : "Don't have an account?"}{" "}
          <Link href={`/${locale}/register`} className="text-[#C5A880] hover:text-gold transition-colors">
            {isAr ? "إنشاء حساب" : "Register"}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
