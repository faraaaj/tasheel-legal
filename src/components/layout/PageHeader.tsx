import type { Locale } from "@/lib/dictionaries";

type PageHeaderProps = {
  locale: Locale;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
};

export default function PageHeader({ locale, title, subtitle, children }: PageHeaderProps) {
  return (
    <div className="pt-20 lg:pt-24">
      <section className="relative overflow-hidden bg-[#070D19] py-24 scroll-mt-24 lg:py-32">
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
            <h1 className="mt-4 font-serif-en text-4xl text-white sm:text-5xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-gray-300">
                {subtitle}
              </p>
            )}
          </div>
          {children}
        </div>
      </section>
    </div>
  );
}
