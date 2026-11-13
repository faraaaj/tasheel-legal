"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import Ticker from "./Ticker";
import ContactModal from "@/components/modals/ContactModal";
import type { Dictionary, Locale } from "@/lib/dictionaries";

type FooterProps = {
  locale: Locale;
  dict: Dictionary;
};

export default function Footer({ locale, dict }: FooterProps) {
  const [contactOpen, setContactOpen] = useState(false);
  const practiceAreas = dict.practiceAreas.items;

  const navLinks: {
    href: string;
    label: string;
    onClick?: (e: { preventDefault: () => void }) => void;
  }[] = [
    { href: `/${locale}#about`, label: dict.nav.about },
    { href: `/${locale}#practice`, label: dict.nav.practice },
    { href: `/${locale}#team`, label: dict.nav.team },
    { href: `/${locale}#insights`, label: dict.nav.insights },
    {
      href: `/${locale}#contact`,
      label: dict.nav.contact,
      onClick: (e) => {
        e.preventDefault();
        setContactOpen(true);
      },
    },
  ];

  return (
    <footer className="bg-[#070D19] text-cream border-t border-gold/20">
      {/* Fixed bottom ticker is mounted here (it position-fixes itself) */}
      <Ticker locale={locale} />

      <div className="shell py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 items-start">
          {/* Col 1: Brand */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <Logo size={40} />
            </div>
            <p className="max-w-sm text-[13px] leading-relaxed text-cream/60">
              {dict.footer.blurb}
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div className="flex flex-col gap-4">
            <h4 className="font-serif-en text-lg text-gold">{dict.footer.linksLabel}</h4>
            <ul className="flex flex-col gap-3 text-[13px] text-cream/60">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-gold">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Core Practices */}
          <div className="flex flex-col gap-4">
            <h4 className="font-serif-en text-lg text-gold">{dict.footer.practiceLabel}</h4>
            <ul className="flex flex-col gap-3 text-[13px] text-cream/60">
              {practiceAreas.slice(0, 5).map((p) => (
                <li key={p.id}>
                  <Link href={`/${locale}#practice`} className="transition-colors hover:text-gold">
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Institutional Data */}
          <div className="flex flex-col gap-5">
            <h4 className="font-serif-en text-lg text-gold">{dict.footer.dataLabel}</h4>
            <div className="grid gap-3 text-[12px] text-cream/60">
              {dict.footer.registrations.map((item) => (
                <div key={item.label} className="flex justify-between gap-6 border-b border-cream/10 pb-1">
                  <span className="text-gold/60">{item.label}</span>
                  <span dir="ltr" className="text-left">{item.value}</span>
                </div>
              ))}
              <div className="flex justify-between gap-6 border-b border-cream/10 pb-1">
                <span className="text-gold/60">{dict.contact.phoneLabel}</span>
                <span dir="ltr" className="text-left">+966583331600</span>
              </div>
              <div className="flex justify-between gap-6 border-b border-cream/10 pb-1">
                <span className="text-gold/60">{dict.contact.emailLabel}</span>
                <span dir="ltr" className="text-left">{dict.contact.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Us — opens the premium modal */}
        <div className="mt-20 flex justify-center">
          <button
            type="button"
            onClick={() => setContactOpen(true)}
            className="inline-flex items-center justify-center !min-w-[220px] h-[48px] bg-yellow-400 text-[#070D19] font-bold uppercase tracking-widest text-[11px] hover:bg-yellow-500 transition-all"
          >
            {dict.cta.consultation}
          </button>
        </div>

        {/* Bottom bar — extra bottom padding clears the fixed ticker */}
        <div className="mt-20 border-t border-gold/10 pt-10 pb-16">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <p className="text-[11px] text-cream/40">
              © {new Date().getFullYear()} {dict.nav.companyName}. {dict.footer.rights}
            </p>
            <div className="flex gap-6 text-[11px] text-cream/40">
              <Link href={`/${locale}`} className="transition-colors hover:text-gold">
                {dict.footer.privacy}
              </Link>
              <Link href={`/${locale}`} className="transition-colors hover:text-gold">
                {dict.footer.terms}
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p className="mx-auto max-w-3xl text-[10px] leading-relaxed text-cream/30 rtl:text-[11px]">
              {dict.footer.disclaimer}
            </p>
          </div>
        </div>
      </div>

      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} locale={locale} />
    </footer>
  );
}
