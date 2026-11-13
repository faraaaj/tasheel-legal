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
        src="/logo-t.png"
        alt="Tasheel Legal"
        width={size}
        height={size}
        className="object-contain shrink-0"
        priority
      />
      <div className="flex flex-col leading-tight">
        <span className="font-sans-en text-lg font-bold tracking-wider text-white whitespace-nowrap">
          TASHEEL LEGAL
        </span>
        <span className="font-sans-ar text-[10px] tracking-wider text-[#C5A880] whitespace-nowrap">
          شركة تسهيل للمحاماة والاستشارات القانونية
        </span>
      </div>
    </Link>
  );
}
