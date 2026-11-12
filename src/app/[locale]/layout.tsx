import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import "../globals.css";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { CartProvider } from "@/context/CartContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import {
  direction,
  getDictionary,
  isLocale,
  locales,
} from "@/lib/dictionaries";
import {
  cormorant,
  inter,
  tajawal,
  tajawalLatin,
} from "@/lib/fonts";

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const dict = getDictionary(locale);

  return {
    metadataBase: new URL("https://tasheel.law"),
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: { en: "/en", ar: "/ar" },
    },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      type: "website",
      locale: locale === "ar" ? "ar_SA" : "en_US",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale);

  return (
    <html
      lang={locale}
      dir={direction(locale)}
      className={`${cormorant.variable} ${inter.variable} ${tajawal.variable} ${tajawalLatin.variable}`}
    >
      <body className={locale === "ar" ? "font-sans-ar" : "font-sans-en"}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:bg-gold focus:px-5 focus:py-3 focus:text-[11px] focus:font-semibold focus:uppercase focus:tracking-[0.18em] focus:text-navy"
        >
          {dict.a11y.skip}
        </a>

        <CurrencyProvider>
          <CartProvider>
            <Header locale={locale} dict={dict} />
            <main id="main">{children}</main>
            <Footer locale={locale} dict={dict} />
          </CartProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
