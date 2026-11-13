"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function Logo({ size = 40 }: { size?: number }) {
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  return (
    <Link href={`/${locale}`} className="flex items-center gap-3">
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="100" height="100" fill="#0A192F" />
        <rect x="6" y="6" width="88" height="88" stroke="#C5A880" strokeWidth="2" />
        <path d="M25 28 H75 M50 28 V78" stroke="#C5A880" strokeWidth="12" strokeLinecap="square" />
      </svg>
      <div className="flex flex-col leading-tight">
        <span className="font-serif-en text-lg font-bold tracking-wider text-cream">
          TASHEEL LEGAL
        </span>
        <span className="text-[8px] uppercase tracking-[0.2em] text-[#C5A880] rtl:hidden">
          Law Firm & Legal Consultancy
        </span>
        <span className="hidden text-[10px] tracking-wider text-[#C5A880] rtl:block">
          شركة تسهيل للمحاماة والاستشارات القانونية
        </span>
      </div>
    </Link>
  );
}
