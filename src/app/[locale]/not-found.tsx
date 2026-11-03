"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FAF9F6] text-center px-4">
      <h1 className="font-serif-en text-6xl text-[#070D19]">404</h1>
      <h2 className="mt-4 font-serif-en text-2xl text-[#070D19]">Page Not Found</h2>
      <p className="mt-4 text-gray-600">The page you are looking for does not exist or has been moved.</p>
      <Link href="/en" className="mt-8 bg-[#C5A880] px-6 py-3 text-[#070D19] font-bold uppercase tracking-widest text-sm hover:bg-[#B0926D] transition-colors">
        Return Home
      </Link>
    </div>
  );
}