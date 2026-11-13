import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import "../globals.css";
import SiteChrome from "@/components/layout/SiteChrome";
import { SplashScreen } from "@/components/layout/SplashScreen";
import TransitionOverlay from "@/components/layout/TransitionOverlay";
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
        <CurrencyProvider>
          <CartProvider>
            <SplashScreen />
            <TransitionOverlay locale={locale} />
            <SiteChrome locale={locale} dict={dict}>
              {children}
            </SiteChrome>
          </CartProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
