"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

type DashboardStatus = "loading" | "pending" | "approved" | "error";

export default function DashboardPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === "ar" ? "ar" : "en";
  const isAr = locale === "ar";

  const [status, setStatus] = useState<DashboardStatus>("loading");
  const [profileName, setProfileName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.replace(`/${locale}/login`);
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error || !profile) {
        setErrorMessage(error?.message ?? (isAr ? "تعذر تحميل الملف الشخصي." : "Failed to load profile."));
        setStatus("error");
        return;
      }

      // Defense in depth: even if someone reaches this page with a live
      // Supabase session, never show dashboard content unless both email
      // and phone OTP verification are complete.
      if (!profile.email_verified || !profile.phone_verified) {
        // Hard rule: never show dashboard content to an account that
        // hasn't finished both OTP steps. We keep the existing Supabase
        // session alive (no plaintext password to re-authenticate with
        // here) but the verify page itself gates all access until both
        // steps pass, and signs the session out if it can't confirm them.
        sessionStorage.setItem(
          "tasheel_pending_auth",
          JSON.stringify({
            email: profile.email ?? session.user.email,
            phone: profile.phone ?? "",
            userId: session.user.id,
          }),
        );
        router.replace(`/${locale}/verify`);
        return;
      }

      setProfileName(profile.full_name);
      setStatus(profile.is_approved ? "approved" : "pending");
    };

    fetchProfile();
  }, [locale, router, isAr]);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#070D19] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-2xl bg-[#0A1120] border border-[#C5A880]/30 p-8 sm:p-10 text-center"
      >
        <h1 className="font-serif-en text-3xl text-white">{isAr ? "لوحة التحكم" : "Dashboard"}</h1>

        {status === "loading" && (
          <p className="mt-8 text-gray-300">{isAr ? "جارٍ التحميل..." : "Loading..."}</p>
        )}

        {status === "error" && (
          <p className="mt-8 text-red-400">{errorMessage}</p>
        )}

        {status === "pending" && (
          <>
            <p className="mt-6 text-lg text-gray-300">
              {isAr
                ? "حسابك قيد المراجعة. سيتم نشره بعد موافقة الإدارة."
                : "Your account is pending approval. It will be activated after firm approval."}
            </p>
            <Link
              href={`/${locale}/store`}
              className="mt-8 inline-flex items-center justify-center !min-w-[180px] h-[40px] border border-[#C5A880] text-[#C5A880] font-bold uppercase tracking-widest text-[10px] hover:bg-[#C5A880]/10 transition-all"
            >
              {isAr ? "استكشاف الموقع" : "Explore the Website"}
            </Link>
          </>
        )}

        {status === "approved" && (
          <>
            <p className="mt-6 text-2xl text-white font-serif-en">
              {isAr ? "مرحباً" : "Welcome back,"} {profileName ?? ""}
            </p>
            <p className="mt-2 text-sm text-gray-400">
              {isAr ? "يمكنك الآن الوصول إلى برامج السوق." : "You now have access to the marketplace programs."}
            </p>
            <Link
              href={`/${locale}/store`}
              className="mt-8 inline-flex items-center justify-center !min-w-[180px] h-[40px] bg-yellow-400 text-[#070D19] font-bold uppercase tracking-widest text-[10px] hover:bg-yellow-500 transition-all"
            >
              {isAr ? "استكشاف الموقع" : "Explore the Website"}
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
}
