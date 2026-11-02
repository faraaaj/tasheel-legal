"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";
import type { Dictionary, Locale } from "@/lib/dictionaries";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

type HeaderProps = {
  locale: Locale;
  dict: Dictionary;
};

export default function Header({ locale, dict }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileOpen]);

  const navLinks = [
    { href: `/${locale}#home`, label: dict.nav.home },
    { href: `/${locale}#about`, label: dict.nav.about },
    { href: `/${locale}#practice`, label: dict.nav.practice },
    { href: `/${locale}#team`, label: dict.nav.team },
    { href: `/${locale}#insights`, label: dict.nav.insights },
    { href: `/${locale}#contact`, label: dict.nav.contact },
  ];

  const otherLocale = locale === "en" ? "ar" : "en";

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled || mobileOpen ? "bg-[#070D19] py-3 shadow-lg" : "bg-transparent py-6"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-3 transition-opacity hover:opacity-90 z-50">
            <Logo size={40} />
            <div className="flex flex-col leading-tight">
              <span className="font-serif-en text-lg sm:text-xl font-bold tracking-wider text-cream">TASHEEL LEGAL</span>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-gold/80 rtl:hidden">Law Firm & Legal Consultancy</span>
              <span className="hidden text-[10px] tracking-wider text-gold/80 rtl:block">شركة تسهيل للمحاماة والاستشارات القانونية</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative text-[11px] uppercase tracking-[0.18em] text-cream/80 transition-colors hover:text-gold rtl:text-[13px] rtl:tracking-normal rtl:hover:text-gold"
              >
                {link.label}
                <span className="absolute -bottom-2 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full rtl:left-auto rtl:right-0" />
              </Link>
            ))}
          </nav>

          {/* Right Side (Desktop Lang + CTA + Mobile Toggle) */}
          <div className="flex items-center gap-3 z-50">
            {/* Desktop Language Toggle */}
            {mounted && (
              <Link
                href={`/${otherLocale}`}
                className="hidden lg:flex items-center justify-center border border-cream/20 min-w-[70px] h-[36px] text-[10px] font-semibold uppercase tracking-widest text-cream/70 transition-colors hover:border-gold hover:text-gold"
              >
                {locale === "en" ? "العربية" : "English"}
              </Link>
            )}
            
            {/* Desktop CTA */}
            <Link
              href={`/${locale}#contact`}
              className="hidden lg:inline-flex items-center justify-center !min-w-[180px] h-[36px] bg-yellow-400 text-[#070D19] font-bold uppercase tracking-widest text-[10px] hover:bg-yellow-500 transition-all"
            >
              {dict.cta.consultation}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex lg:hidden items-center justify-center h-10 w-10 text-cream border border-cream/20"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col bg-[#070D19] pt-24 pb-8 px-6 lg:hidden overflow-y-auto"
          >
            <nav className="flex flex-col gap-6 mt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-xl text-cream font-serif-en uppercase tracking-widest border-b border-cream/10 pb-4"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto pt-10 flex flex-col gap-4">
              <Link
                href={`/${otherLocale}`}
                className="flex items-center justify-center w-full border border-gold text-gold py-4 text-sm font-bold uppercase tracking-widest"
              >
                {locale === "en" ? "العربية" : "English"}
              </Link>
              <Link
                href={`/${locale}#contact`}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center w-full bg-yellow-400 text-[#070D19] py-4 text-sm font-bold uppercase tracking-widest"
              >
                {dict.cta.consultation}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}