"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Logo from "./Logo";
import Ticker from "./Ticker";
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
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "bg-navy/95 py-3 backdrop-blur-md border-b border-gold/20" : "bg-transparent py-6"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-3 transition-opacity hover:opacity-90">
          <Logo size={40} />
          <div className="hidden flex-col leading-tight sm:flex">
            <span className="font-serif-en text-xl font-bold tracking-wider text-cream rtl:text-[15px] rtl:font-bold">
              {dict.nav.companyName}
            </span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-gold/80 rtl:text-[10px] rtl:tracking-normal rtl:normal-case">
              {dict.brand.tagline}
            </span>
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

        {/* Right Side (Lang + CTA) */}
        <div className="flex items-center gap-4">
          {mounted && (
            <Link
              href={`/${otherLocale}`}
              className="hidden items-center justify-center border border-cream/20 min-w-[70px] h-[36px] text-[10px] font-semibold uppercase tracking-widest text-cream/70 transition-colors hover:border-gold hover:text-gold sm:flex"
            >
              {locale === "en" ? "العربية" : "English"}
            </Link>
          )}
          
          <a
            href="https://wa.me/966590964157?text=Hello%20Tasheel%20Legal,%20I%20would%20like%20to%20request%20a%20consultation."
            target="_blank"
            rel="noopener noreferrer"
            className="btn hidden !px-5 !py-2.5 !text-[10px] !bg-yellow-400 !text-[#070D19] hover:!bg-yellow-500 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(250,204,21,0.35)] transition-all lg:inline-flex !min-w-[220px] !justify-center"
          >
            {dict.cta.consultation}
          </a>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-cream lg:hidden">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </motion.header>
  );
}
