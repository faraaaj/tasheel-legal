import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContactSection from "@/components/sections/ContactSection";
import { getDictionary, isLocale } from "@/lib/dictionaries";

type ContactPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const dict = getDictionary(locale);

  return {
    title: `${dict.contact.headline} — ${dict.brand.name}`,
    description: dict.contact.subtext,
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale);

  return (
    <div className="pt-20 lg:pt-24">
      <h1 className="sr-only">{dict.contact.headline}</h1>
      <ContactSection locale={locale} dict={dict} />
    </div>
  );
}
