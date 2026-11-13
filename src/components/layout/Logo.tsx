"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function Logo({ size = 40 }: { size?: number }) {
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  return (
    <Link href={`/${locale}`} className="flex items-center gap-3">
      <Image
        src="/new-t-icon.png"
        alt="Tasheel Legal"
        width={size}
        height={size}
        className="object-contain"
        priority
        unoptimized
      />
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
