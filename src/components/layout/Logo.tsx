"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function Logo({ size = 40 }: { size?: number }) {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const isAr = locale === "ar";

  return (
    <Link href={`/${locale}`} className="flex items-center gap-3">
      <Image
        src="/logo-t.png"
        alt="Tasheel Legal"
        width={size}
        height={size}
        className="object-contain shrink-0"
        priority
      />
      <div className="flex flex-col leading-tight">
        {isAr ? (
          <>
            <span className="font-sans-ar text-lg font-bold tracking-wider text-white whitespace-nowrap">
              تسهيل للمحاماة والاستشارات القانونية
            </span>
            <span className="font-sans-ar text-[10px] tracking-wider text-[#C5A880] whitespace-nowrap">
              محاماة واستشارات قانونية
            </span>
          </>
        ) : (
          <>
            <span className="font-sans-en text-lg font-bold tracking-wider text-white whitespace-nowrap">
              TASHEEL LEGAL
            </span>
            <span className="font-sans-en text-[8px] uppercase tracking-[0.2em] text-[#C5A880] whitespace-nowrap">
              LAW FIRM & LEGAL CONSULTANCY
            </span>
          </>
        )}
      </div>
    </Link>
  );
}
