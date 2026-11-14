"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function Logo({ size = 40 }: { size?: number }) {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const isAr = locale === "ar";

  return (
    <Link href={`/${locale}`} dir="ltr" className="flex items-center gap-3">
      {isAr ? (
        <>
          <div className="flex flex-col text-right">
            <span className="font-sans-ar text-sm md:text-lg font-bold tracking-wider text-white whitespace-normal md:whitespace-nowrap line-clamp-2 md:line-clamp-1">
              تسهيل للمحاماة والاستشارات القانونية
            </span>
            <span className="font-sans-ar text-[9px] md:text-[10px] tracking-wider text-[#C5A880] whitespace-nowrap">
              محاماة واستشارات قانونية
            </span>
          </div>
          <div className="w-10 h-10 md:w-12 md:h-12 border border-[#D4AF37] flex items-center justify-center flex-shrink-0">
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
          <div className="w-10 h-10 md:w-12 md:h-12 border border-[#D4AF37] flex items-center justify-center flex-shrink-0">
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
