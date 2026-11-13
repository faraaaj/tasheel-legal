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
        src={isAr ? "/logo-ar.png" : "/logo-en.png"}
        alt="Tasheel Legal"
        width={size * 4}
        height={size}
        className="object-contain"
        priority
      />
    </Link>
  );
}
