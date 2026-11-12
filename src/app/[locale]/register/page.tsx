"use client";

import { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === "ar" ? "ar" : "en";
  const isAr = locale === "ar";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nationality, setNationality] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [cityAutoDetected, setCityAutoDetected] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Best-effort city detection from the visitor's IP. Only a
  // convenience default: the field stays editable, and if the lookup
  // fails (ad blockers, no network) the user just types it in.
  useEffect(() => {
    let cancelled = false;
    fetch("https://ipapi.co/json/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        if (data.city) {
          setCity(data.city);
          setCityAutoDetected(true);
        }
      })
      .catch(() => {
        /* silent: city just stays blank for manual entry */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, phone, nationality, address, city, password }),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error ?? (isAr ? "حدث خطأ أثناء إنشاء الحساب." : "Something went wrong creating your account."));
      setLoading(false);
      return;
    }

    // Stash credentials briefly so the verify page can establish a
    // session once Authentica confirms both codes. Cleared immediately
    // after use there.
    sessionStorage.setItem(
      "tasheel_pending_auth",
      JSON.stringify({ email, password, phone, userId: data.userId }),
    );

    router.push(`/${locale}/verify`);
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#070D19] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md bg-[#0A1120] border border-[#C5A880]/30 p-8 sm:p-10"
      >
        <h1 className="font-serif-en text-3xl text-white text-center">{isAr ? "إنشاء حساب" : "Create Account"}</h1>
        <p className="mt-2 text-center text-sm text-gray-400">
          {isAr ? "انضم إلى شركة تسهيل" : "Join Tasheel Legal"}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="fullName" className="block text-[11px] uppercase tracking-[0.18em] text-[#C5A880] mb-2">
              {isAr ? "الاسم الكامل" : "Full Name"}
            </label>
            <input
              id="fullName"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-[#070D19] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-[#C5A880] focus:outline-none"
            />
          </div>
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
            <label htmlFor="phone" className="block text-[11px] uppercase tracking-[0.18em] text-[#C5A880] mb-2">
              {isAr ? "رقم الجوال" : "Phone"}
            </label>
            <input
              id="phone"
              type="tel"
              required
              placeholder={isAr ? "+9665xxxxxxxx" : "+9665xxxxxxxx"}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-[#070D19] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-[#C5A880] focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="nationality" className="block text-[11px] uppercase tracking-[0.18em] text-[#C5A880] mb-2">
              {isAr ? "الجنسية" : "Nationality"}
            </label>
            <input
              id="nationality"
              type="text"
              required
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              className="w-full bg-[#070D19] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-[#C5A880] focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-[11px] uppercase tracking-[0.18em] text-[#C5A880] mb-2">
              {isAr ? "العنوان" : "Address"}
            </label>
            <input
              id="address"
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-[#070D19] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-[#C5A880] focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="city" className="block text-[11px] uppercase tracking-[0.18em] text-[#C5A880] mb-2">
              {isAr ? "المدينة" : "City"}
              {cityAutoDetected && (
                <span className="normal-case tracking-normal text-gray-500">
                  {" "}
                  {isAr ? "(تم اكتشافها تلقائياً، يمكنك تعديلها)" : "(auto-detected, you can edit it)"}
                </span>
              )}
            </label>
            <input
              id="city"
              type="text"
              required
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setCityAutoDetected(false);
              }}
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
              minLength={6}
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
            {loading ? (isAr ? "جارٍ التسجيل..." : "Creating...") : isAr ? "إنشاء الحساب" : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          {isAr ? "لديك حساب بالفعل؟" : "Already have an account?"}{" "}
          <Link href={`/${locale}/login`} className="text-[#C5A880] hover:text-gold transition-colors">
            {isAr ? "تسجيل الدخول" : "Login"}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
