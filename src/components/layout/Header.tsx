"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";
import type { Dictionary, Locale } from "@/lib/dictionaries";
import { cn } from "@/lib/utils";
import { Menu, X, User, ShoppingCart } from "lucide-react";

type HeaderProps = {
  locale: Locale;
  dict: Dictionary;
  cartCount?: number;
};

export default function Header({ locale, dict, cartCount = 0 }: HeaderProps) {
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
  }, [mobileOpen]);

  const navLinks = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}#about`, label: dict.nav.about },
    { href: `/${locale}#practice`, label: dict.nav.practice },
    { href: `/${locale}/store`, label: dict.nav.packages },
    { href: `/${locale}#team`, label: dict.nav.team },
    { href: `/${locale}#insights`, label: dict.nav.insights },
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
          
          <div className="flex-shrink-0">
            <Logo size={40} />
          </div>

          <nav className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative text-[11px] uppercase tracking-[0.18em] text-cream/80 transition-colors hover:text-gold rtl:text-[13px] rtl:tracking-normal rtl:hover:text-gold whitespace-nowrap"
              >
                {link.label}
                <span className="absolute -bottom-2 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full rtl:left-auto rtl:right-0" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4 flex-shrink-0">
            {mounted && (
              <Link
                href={`/${otherLocale}`}
                className="hidden lg:flex items-center justify-center text-[10px] font-bold uppercase tracking-widest text-cream/70 hover:text-gold transition-colors"
              >
                {locale === "en" ? "العربية" : "English"}
              </Link>
            )}
            
            <Link href={`/${locale}/cart`} className="relative flex items-center justify-center text-cream/70 hover:text-gold transition-colors">
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-yellow-400 text-[9px] font-bold text-[#070D19]">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link href={`/${locale}/login`} className="hidden lg:flex items-center justify-center text-cream/70 hover:text-gold transition-colors">
              <User size={18} />
            </Link>

            <Link
              href={`/${locale}#contact`}
              className="hidden lg:inline-flex items-center justify-center !min-w-[220px] !px-6 h-[40px] bg-yellow-400 text-[#070D19] font-bold uppercase tracking-widest text-[10px] hover:bg-yellow-500 transition-all whitespace-nowrap"
            >
              {dict.cta.consultation}
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex lg:hidden items-center justify-center h-10 w-10 text-cream border border-cream/20"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
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
              <Link href={`/${otherLocale}`} className="flex items-center justify-center w-full border border-gold text-gold py-4 text-sm font-bold uppercase tracking-widest">
                {locale === "en" ? "العربية" : "English"}
              </Link>
              <Link href={`/${locale}/cart`} onClick={() => setMobileOpen(false)} className="flex items-center justify-center w-full border border-cream/20 text-cream py-4 text-sm font-bold uppercase tracking-widest">
                {locale === "ar" ? "السلة" : "Cart"} ({cartCount})
              </Link>
              <Link href={`/${locale}/login`} onClick={() => setMobileOpen(false)} className="flex items-center justify-center w-full border border-cream/20 text-cream py-4 text-sm font-bold uppercase tracking-widest">
                {dict.nav.login || "Login"}
              </Link>
              <Link href={`/${locale}#contact`} onClick={() => setMobileOpen(false)} className="flex items-center justify-center w-full bg-yellow-400 text-[#070D19] py-4 text-sm font-bold uppercase tracking-widest">
                {dict.cta.consultation}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
