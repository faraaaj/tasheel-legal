"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import type { Dictionary, Locale } from "@/lib/dictionaries";

// The admin console has its own shell (sidebar + top bar), so the public
// marketing header/footer are suppressed on /[locale]/admin/* routes.
export default function SiteChrome({
  locale,
  dict,
  children,
}: {
  locale: Locale;
  dict: Dictionary;
  children: ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const isAdminArea = /^\/(en|ar)\/admin(?:\/|$)/.test(pathname);

  if (isAdminArea) {
    return <>{children}</>;
  }

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:bg-gold focus:px-5 focus:py-3 focus:text-[11px] focus:font-semibold focus:uppercase focus:tracking-[0.18em] focus:text-navy"
      >
        {dict.a11y.skip}
      </a>
      <Header locale={locale} dict={dict} />
      <main id="main">{children}</main>
      <Footer locale={locale} dict={dict} />
    </>
  );
}
