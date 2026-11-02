import { notFound } from "next/navigation";
import AboutFirm from "@/components/sections/AboutFirm";
import ContactSection from "@/components/sections/ContactSection";
import CoreValues from "@/components/sections/CoreValues";
import Hero from "@/components/sections/Hero";
import Insights from "@/components/sections/Insights";
import Methodology from "@/components/sections/Methodology";
import PracticeAreas from "@/components/sections/PracticeAreas";
import WhoWeServe from "@/components/sections/WhoWeServe";
import Team from "@/components/sections/Team";
import SectionReveal from "@/components/ui/SectionReveal";
import { getDictionary, isLocale } from "@/lib/dictionaries";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

const SEPARATOR = <div className="h-px w-full bg-[#C5A880]/20" aria-hidden="true" />;

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale);

  return (
    <>
      <Hero locale={locale} dict={dict} />
      {SEPARATOR}
      <SectionReveal>
        <CoreValues dict={dict} />
      </SectionReveal>
      {SEPARATOR}
      <SectionReveal>
        <AboutFirm dict={dict} />
      </SectionReveal>
      {SEPARATOR}
      <SectionReveal>
        <PracticeAreas locale={locale} dict={dict} />
      </SectionReveal>
      {SEPARATOR}
      <SectionReveal>
        <WhoWeServe locale={locale} dict={dict} />
      </SectionReveal>
      {SEPARATOR}
      <SectionReveal>
        <Methodology locale={locale} dict={dict} />
      </SectionReveal>
      {SEPARATOR}
      <SectionReveal>
        <Team locale={locale} dict={dict} />
      </SectionReveal>
      {SEPARATOR}
      <SectionReveal>
        <Insights dict={dict} />
      </SectionReveal>
      {SEPARATOR}
      <SectionReveal>
        <ContactSection locale={locale} dict={dict} />
      </SectionReveal>
    </>
  );
}
