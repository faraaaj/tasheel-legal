"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function Logo({ size = 40 }: { size?: number }) {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const isAr = locale === "ar";

  if (isAr) {
    return (
      <Link href={`/${locale}`} className="flex items-center gap-3" dir="ltr">
        <div className="flex flex-col text-right">
          <span className="text-white font-bold text-lg leading-tight whitespace-nowrap">
            تسهيل للمحاماة والاستشارات القانونية
          </span>
          <span className="text-[#D4AF37] text-xs whitespace-nowrap">
            محاماة واستشارات قانونية
          </span>
        </div>
        <div className="w-12 h-12 border border-[#D4AF37] flex items-center justify-center flex-shrink-0">
          <img src="/logo-t.png" alt="Tasheel Icon" className="w-full h-full object-contain p-1" />
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/${locale}`} className="flex items-center gap-3">
      <div className="w-12 h-12 border border-[#D4AF37] flex items-center justify-center flex-shrink-0">
        <img src="/logo-t.png" alt="Tasheel Icon" className="w-full h-full object-contain p-1" />
      </div>
      <div className="flex flex-col leading-tight">
        <span className="font-sans-en text-lg font-bold tracking-wider text-white whitespace-nowrap">
          TASHEEL LEGAL
        </span>
        <span className="font-sans-en text-[8px] uppercase tracking-[0.2em] text-[#C5A880] whitespace-nowrap">
          LAW FIRM & LEGAL CONSULTANCY
        </span>
      </div>
    </Link>
  );
}
