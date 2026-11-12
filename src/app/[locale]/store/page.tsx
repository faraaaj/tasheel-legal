import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getDictionary, isLocale } from "@/lib/dictionaries";
import StoreCard, { type StorePackage } from "@/components/sections/StoreCard";

type StorePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: StorePageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const dict = getDictionary(locale);

  return {
    title: `${dict.store.headline} — ${dict.brand.name}`,
    description: dict.store.subtitle,
  };
}

// English titles only (US spelling "Program" not "Programme", shortened to
// fit on a single line on the card). Arabic names (name_ar) are a completely
// separate field and are never touched or derived from these strings.
const PREMIUM_NAMES = [
  "Annual Legal Partnership",
  "Government Violations Cases",
  "Problems Technology Cure",
] as const;

const TRADE_NAMES = [
  "Import-Export Compliance",
  "Distribution & Agency Agreement",
  "GCC Regional Trade Expansion Advisory",
] as const;

// New real-estate-focused section, added after Trade Opportunities. Same
// opt-in pattern: section only renders once these 3 rows exist in the DB.
const REAL_ESTATE_NAMES = [
  "Off-Plan Delivery Disputes & Claims",
  "Landowner Protection & Development Partnerships",
  "Real Estate Development & Investment Advisory",
] as const;

function toStringArray(value: unknown): string[] | undefined {
  if (Array.isArray(value)) return value.map((v) => String(v));
  return undefined;
}

export default async function StorePage({ params }: StorePageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale);

  // Public-safe columns only. outcomes_en/ar, requirements_en/ar and
  // details_en/ar are this company's core IP and must never be shipped to
  // an unauthenticated/unapproved visitor's browser, so they are deliberately
  // left out of this query. They are served only via the protected
  // /api/packages/[id]/details route, which checks session + approval
  // status server-side (see StoreCard.tsx and that route).
  const { data: packages } = await supabase
    .from("service_packages")
    .select(
      "id, name_en, name_ar, description_en, description_ar, price_sar, validity_days, max_seats, active",
    )
    .eq("active", true)
    .order("id", { ascending: true });

  const active = (packages ?? []).filter((pkg) => pkg && pkg.active);

  const byName = new Map(active.map((pkg) => [String(pkg.name_en ?? ""), pkg]));

  const premiumPackages: StorePackage[] = PREMIUM_NAMES.map((name) => {
    const pkg = byName.get(name);
    if (!pkg) return null;
    const priceSar = Number(pkg.price_sar ?? 0);

    // Front-of-card price is always the final, clean number the customer pays.
    // Any discount, bundle or "normally this much" context lives only in the
    // popup's details paragraph (details_en / details_ar), written in plain
    // language, never as a separate struck-price UI element.
    let priceLabelEn: string | undefined;
    let priceLabelAr: string | undefined;

    if (name === "Annual Legal Partnership") {
      priceLabelEn = "SAR 20,000 / year";
      priceLabelAr = "‏20,000 ريال سعودي / سنة";
    } else if (name === "Government Violations Cases") {
      priceLabelEn = "SAR 15,000 + percentage";
      priceLabelAr = "‏15,000 ريال سعودي + نسبة";
    } else if (name === "Problems Technology Cure") {
      priceLabelEn = "Free";
      priceLabelAr = "مجاناً";
    }

    return {
      id: String(pkg.id),
      nameEn: String(pkg.name_en ?? ""),
      nameAr: String(pkg.name_ar ?? ""),
      descriptionEn: String(pkg.description_en ?? ""),
      descriptionAr: String(pkg.description_ar ?? ""),
      // outcomes/requirements/details are intentionally not selected here:
      // they are served only by the protected /api/packages/[id]/details
      // route and loaded by StoreCard on demand for approved clients.
      priceSar,
      priceLabelEn,
      priceLabelAr,
      validityDays: Number(pkg.validity_days ?? 365),
      maxSeats: Number(pkg.max_seats ?? 1),
      featured: true,
      badgeEn: "Best Seller",
      badgeAr: "الأكثر مبيعاً",
    } as StorePackage;
  }).filter(Boolean) as StorePackage[];

  premiumPackages.forEach((pkg, i) => {
    pkg.cardNumber = i + 1;
  });

  const premiumDbNames = new Set<string>(PREMIUM_NAMES);
  const tradeDbNames = new Set<string>(TRADE_NAMES);

  const mapPackage = (pkg: Record<string, unknown>): StorePackage => ({
    id: String(pkg.id),
    nameEn: String(pkg.name_en ?? ""),
    nameAr: String(pkg.name_ar ?? ""),
    descriptionEn: String(pkg.description_en ?? ""),
    descriptionAr: String(pkg.description_ar ?? ""),
    // Gated fields (outcomes/requirements/details) come from the protected
    // details API, not from the public store query.
    priceSar: Number(pkg.price_sar ?? 0),
    validityDays: Number(pkg.validity_days ?? 365),
    maxSeats: Number(pkg.max_seats ?? 1),
    featured: false,
  });

  const reDbNames = new Set<string>(REAL_ESTATE_NAMES);

  const cataloguePackages: StorePackage[] = active
    .filter(
      (pkg) =>
        !premiumDbNames.has(String(pkg.name_en ?? "")) &&
        !tradeDbNames.has(String(pkg.name_en ?? "")) &&
        !reDbNames.has(String(pkg.name_en ?? ""))
    )
    // Secondary sort key (id) makes the order deterministic when two
    // packages share the same price_sar, so the EN and AR pages (separate
    // server requests against the same rows) always agree on card numbers.
    .sort((a, b) => {
      const priceDiff = Number(a.price_sar ?? 0) - Number(b.price_sar ?? 0);
      if (priceDiff !== 0) return priceDiff;
      return String(a.id ?? "").localeCompare(String(b.id ?? ""));
    })
    .map(mapPackage);

  cataloguePackages.forEach((pkg, i) => {
    pkg.cardNumber = premiumPackages.length + i + 1;
  });

  // New packages aimed at cross-border/trade clients, shown in their own
  // section after the main catalogue. Kept to a fixed, named list (same
  // pattern as PREMIUM_NAMES) so this section only ever shows these 3
  // packages, in this order, regardless of what else is added to the table.
  const tradePackages: StorePackage[] = TRADE_NAMES.map((name) => {
    const pkg = byName.get(name);
    if (!pkg) return null;
    return mapPackage(pkg as Record<string, unknown>);
  }).filter(Boolean) as StorePackage[];

  tradePackages.forEach((pkg, i) => {
    pkg.cardNumber = premiumPackages.length + cataloguePackages.length + i + 1;
  });

  // Real-estate-focused packages, shown in their own section after Trade
  // Opportunities. Same fixed-list pattern as TRADE_NAMES.
  const realEstatePackages: StorePackage[] = REAL_ESTATE_NAMES.map((name) => {
    const pkg = byName.get(name);
    if (!pkg) return null;
    return mapPackage(pkg as Record<string, unknown>);
  }).filter(Boolean) as StorePackage[];

  realEstatePackages.forEach((pkg, i) => {
    pkg.cardNumber =
      premiumPackages.length + cataloguePackages.length + tradePackages.length + i + 1;
  });

  const premiumEyebrow = locale === "ar" ? "باقات مميزة" : "Premium Packages";
  const premiumTitle =
    locale === "ar" ? "الأكثر مبيعاً" : "Best-Selling Packages";
  const premiumSubtitle =
    locale === "ar"
      ? "حلول متميزة مصممة لتقديم أثر مؤسسي واضح، تجمع الخبرة القانونية والاستراتيجية التجارية والتنفيذ والحلول التقنية."
      : "Flagship solutions designed for clear institutional impact, combining Legal Expertise, Business Strategy, and Execution & Technology.";
  const catalogueEyebrow =
    locale === "ar" ? "كتالوج الباقات" : "Package Catalogue";
  const catalogueTitle =
    locale === "ar" ? "باقات إضافية حسب احتياجك" : "Additional Packages for Your Needs";
  const tradeEyebrow =
    locale === "ar" ? "جديد" : "New";
  const tradeTitle =
    locale === "ar" ? "باقات تجارية" : "Trade Opportunities";
  const tradeSubtitle =
    locale === "ar"
      ? "باقات مخصصة للمنشآت التي تستورد أو تصدر أو توسع نشاطها التجاري عبر حدود المملكة ودول مجلس التعاون."
      : "Built for companies that import, export, or are expanding trade across the Kingdom's borders and the wider GCC.";
  const realEstateEyebrow = locale === "ar" ? "جديد" : "New";
  const realEstateTitle =
    locale === "ar" ? "باقات القطاع العقاري" : "Real Estate Focused Packages";
  const realEstateSubtitle =
    locale === "ar"
      ? "حلول قانونية متخصصة لمشتري الوحدات على الخارطة، ومالكي الأراضي، والمطورين العقاريين."
      : "Specialist legal solutions for off-plan buyers, landowners, and real estate developers.";

  const disclaimer =
    locale === "ar"
      ? "جميع الباقات أعلاه هي رسوم أتعاب مهنية فقط. أي رسوم حكومية أو رسوم توثيق أو رسوم تقديم لدى جهة رسمية أو تكاليف طرف ثالث أو أي مستحقات لجهة أخرى تبقى مسؤولية العميل وحده، وتسدد مباشرة وبالكامل من العميل إلى تلك الجهة. لا تقوم شركة تسهيل للمحاماة والاستشارات القانونية بدفع أو تسبيق أو تحصيل هذه المبالغ نيابة عن العميل كجزء من رسوم أي باقة، وحيثما كان التنسيق مفيدا، يقوم العميل بسداد كل فاتورة أو رسم مباشرة بناء على المستندات التي نقدمها."
      : "All packages above are professional service fees only. Any government fees, notarization charges, authority filing fees, third-party costs, or other payments due to a separate entity are the client's own responsibility and must be settled directly and in full by the client to that entity. Tasheel Law Company does not advance, prepay, or collect such third-party amounts on the client's behalf as part of any package fee; where coordination is useful, the client pays each invoice or charge directly against documentation we provide.";

  return (
    <div className="pt-20 lg:pt-24">
      <section id="store" className="relative overflow-hidden bg-[#070D19] py-24 scroll-mt-24 lg:py-32">
        {/* Fixed background layer: stays in place while the cards scroll over it.
            Swap the radial-gradient pattern below for `backgroundImage: "url(/images/store-bg.jpg)"`
            once a background photo is approved; the overlay keeps text contrast either way. */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 20%, rgba(197,168,128,0.16), transparent 40%), radial-gradient(circle at 85% 0%, rgba(197,168,128,0.12), transparent 45%), radial-gradient(circle at 50% 100%, rgba(197,168,128,0.10), transparent 50%)",
            backgroundColor: "#070D19",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10 bg-[#070D19]/70"
        />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C5A880]">
              {dict.store.eyebrow}
            </span>
            <h1 className="mt-4 font-serif-en text-4xl text-white sm:text-5xl">
              {dict.store.headline}
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-gray-300">
              {dict.store.subtitle}
            </p>
          </div>

          <div className="mt-20">
            <div className="mb-10 text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C5A880]">
                {premiumEyebrow}
              </span>
              <h2 className="mt-3 font-serif-en text-3xl text-white sm:text-4xl">
                {premiumTitle}
              </h2>
              <p className="mx-auto mt-3 max-w-3xl text-base leading-relaxed text-gray-300">
                {premiumSubtitle}
              </p>
            </div>
            <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-3">
              {premiumPackages.map((pkg) => (
                <StoreCard key={pkg.id} pkg={pkg} locale={locale} />
              ))}
            </div>
          </div>

          <div className="mt-24 border-t border-white/10 pt-20">
            <div className="mb-10 text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C5A880]">
                {catalogueEyebrow}
              </span>
              <h2 className="mt-3 font-serif-en text-3xl text-white sm:text-4xl">
                {catalogueTitle}
              </h2>
            </div>

            {cataloguePackages.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center">
                <p className="text-lg text-gray-300">{dict.store.noPackages}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-2 lg:grid-cols-3">
                {cataloguePackages.map((pkg) => (
                  <StoreCard key={pkg.id} pkg={pkg} locale={locale} />
                ))}
              </div>
            )}
          </div>

          {tradePackages.length > 0 ? (
            <div className="mt-24 border-t border-white/10 pt-20">
              <div className="mb-10 text-center">
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C5A880]">
                  {tradeEyebrow}
                </span>
                <h2 className="mt-3 font-serif-en text-3xl text-white sm:text-4xl">
                  {tradeTitle}
                </h2>
                <p className="mx-auto mt-3 max-w-3xl text-base leading-relaxed text-gray-300">
                  {tradeSubtitle}
                </p>
              </div>
              <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-2 lg:grid-cols-3">
                {tradePackages.map((pkg) => (
                  <StoreCard key={pkg.id} pkg={pkg} locale={locale} />
                ))}
              </div>
            </div>
          ) : null}

          {realEstatePackages.length > 0 ? (
            <div className="mt-24 border-t border-white/10 pt-20">
              <div className="mb-10 text-center">
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C5A880]">
                  {realEstateEyebrow}
                </span>
                <h2 className="mt-3 font-serif-en text-3xl text-white sm:text-4xl">
                  {realEstateTitle}
                </h2>
                <p className="mx-auto mt-3 max-w-3xl text-base leading-relaxed text-gray-300">
                  {realEstateSubtitle}
                </p>
              </div>
              <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-2 lg:grid-cols-3">
                {realEstatePackages.map((pkg) => (
                  <StoreCard key={pkg.id} pkg={pkg} locale={locale} />
                ))}
              </div>
            </div>
          ) : null}

          <div className="mx-auto mt-20 max-w-3xl text-center">
            <p className="mt-8 text-[14px] leading-[1.8] text-white font-medium border-t border-white/10 pt-6">
              {disclaimer}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
