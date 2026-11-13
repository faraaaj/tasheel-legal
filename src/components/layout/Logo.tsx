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
      {isAr ? (
        <>
          {/* Arabic: Text on LEFT, Icon on RIGHT */}
          <div className="flex flex-col leading-tight text-right">
            <span className="font-sans-ar text-lg font-bold tracking-wider text-white whitespace-nowrap">
              تسهيل للمحاماة والاستشارات القانونية
            </span>
            <span className="font-sans-ar text-[10px] tracking-wider text-[#C5A880] whitespace-nowrap">
              محاماة واستشارات قانونية
            </span>
          </div>
          <div className="flex items-center justify-center bg-[#0A192F] border border-[#D4AF37] shrink-0" style={{ width: size, height: size }}>
            <Image
              src="/logo-t.png"
              alt="Tasheel Legal"
              width={Math.round(size * 0.7)}
              height={Math.round(size * 0.7)}
              className="object-contain"
              priority
            />
          </div>
        </>
      ) : (
        <>
          {/* English: Icon on LEFT, Text on RIGHT */}
          <div className="flex items-center justify-center bg-[#0A192F] border border-[#D4AF37] shrink-0" style={{ width: size, height: size }}>
            <Image
              src="/logo-t.png"
              alt="Tasheel Legal"
              width={Math.round(size * 0.7)}
              height={Math.round(size * 0.7)}
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-sans-en text-lg font-bold tracking-wider text-white whitespace-nowrap">
              TASHEEL LEGAL
            </span>
            <span className="font-sans-en text-[8px] uppercase tracking-[0.2em] text-[#C5A880] whitespace-nowrap">
              LAW FIRM & LEGAL CONSULTANCY
            </span>
          </div>
        </>
      )}
    </Link>
  );
}
