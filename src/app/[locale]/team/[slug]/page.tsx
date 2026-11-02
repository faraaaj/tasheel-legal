import { notFound } from "next/navigation";
import Image from "next/image";
import { teamMembers } from "@/data/team";
import { getDictionary } from "@/lib/dictionaries";
import Reveal from "@/components/ui/Reveal";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const member = teamMembers.find((m) => m.slug === slug);

  if (!member || member.comingSoon) {
    return { title: "Profile Not Found" };
  }

  const dict = await getDictionary(locale as any);
  const name = locale === "en" ? member.nameEn : member.nameAr;
  const role = locale === "en" ? member.roleEn : member.roleAr;
  const bio = locale === "en" ? member.bioEn[0] : member.bioAr[0];

  return {
    title: `${name} | ${dict.brand.name}`,
    description: `${role}. ${bio}`,
  };
}

export default async function TeamProfilePage({ params }: Props) {
  const { locale, slug } = await params;
  const member = teamMembers.find((m) => m.slug === slug);

  if (!member || member.comingSoon) {
    notFound();
  }

  const dict = await getDictionary(locale as any);

  return (
    <main className="bg-cream min-h-screen pb-24 pt-32">
      <div className="shell">
        <Reveal>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-20">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-navy shadow-2xl">
              <Image
                src={member.image}
                alt={locale === "en" ? member.nameEn : member.nameAr}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="flex flex-col">
              <h1 className="font-serif-en text-4xl leading-tight text-navy sm:text-5xl rtl:font-sans-ar rtl:text-3xl">
                {locale === "en" ? member.nameEn : member.nameAr}
              </h1>
              <p className="mt-4 text-lg font-semibold text-gold rtl:text-lg">
                {locale === "en" ? member.roleEn : member.roleAr}
              </p>

              <div className="mt-12 space-y-6 text-[16px] leading-relaxed text-navy/70 rtl:text-[17px]">
                {(locale === "en" ? member.bioEn : member.bioAr).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
