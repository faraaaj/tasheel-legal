import type { Locale } from "@/lib/dictionaries";

type ComingSoonProps = {
  locale: Locale;
  title: string;
  description: string;
};

export default function ComingSoon({ locale, title, description }: ComingSoonProps) {
  const isAr = locale === "ar";
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center border border-[#C5A880]/40 text-[#C5A880]">
          <span className="text-2xl">🚧</span>
        </div>
        <h2 className="font-serif-en text-2xl text-white">{title}</h2>
        <p className="mt-3 text-sm text-gray-400 leading-relaxed">{description}</p>
        <p className="mt-6 text-[10px] uppercase tracking-[0.2em] text-[#C5A880]/60">
          {isAr ? "قريباً" : "Coming Soon"}
        </p>
      </div>
    </div>
  );
}
