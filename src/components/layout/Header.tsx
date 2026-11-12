"use client";

import { useState, useEffect, type MouseEvent } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";
import ContactModal from "@/components/modals/ContactModal";
import type { Dictionary, Locale } from "@/lib/dictionaries";
import { cn } from "@/lib/utils";
import { Menu, X, User, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import CurrencySelector from "@/components/ui/CurrencySelector";

type HeaderProps = {
  locale: Locale;
  dict: Dictionary;
};

export default function Header({ locale, dict }: HeaderProps) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const { cartItems } = useCart();
  const cartCount = cartItems.length;

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

  const navLinks: {
    href: string;
    label: string;
    onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  }[] = [
    { href: `/${locale}#home`, label: dict.nav.home },
    { href: `/${locale}#about`, label: dict.nav.about },
    { href: `/${locale}#practice`, label: dict.nav.practice },
    { href: `/${locale}/store`, label: dict.nav.packages },
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

  const otherLocale = locale === "en" ? "ar" : "en";
  const pathname = usePathname();
  // Swap only the leading /en or /ar segment so the user stays on the
  // same page (store, cart, etc.) when switching languages, instead of
  // being bounced back to the homepage.
  const otherLocalePath = pathname
    ? pathname.replace(/^\/(en|ar)(?=\/|$)/, `/${otherLocale}`)
    : `/${otherLocale}`;

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled || mobileOpen
            ? "bg-[#070D19] py-3 shadow-lg"
            : "bg-gradient-to-b from-[#070D19]/90 via-[#070D19]/50 to-transparent py-6"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-3 transition-opacity hover:opacity-90 z-50 shrink-0">
            <Logo size={40} />
            <div className="flex flex-col leading-tight">
              <span className="font-serif-en text-lg sm:text-xl font-bold tracking-wider text-cream">TASHEEL LEGAL</span>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-gold/80 rtl:hidden">Law Firm & Legal Consultancy</span>
              <span className="hidden text-[10px] tracking-wider text-gold/80 rtl:block">شركة تسهيل للمحاماة والاستشارات القانونية</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-6 xl:gap-8 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={link.onClick}
                className="group relative text-[11px] uppercase tracking-[0.18em] text-cream/80 transition-colors hover:text-gold rtl:text-[13px] rtl:tracking-normal rtl:hover:text-gold whitespace-nowrap"
              >
                {link.label}
                <span className="absolute -bottom-2 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full rtl:left-auto rtl:right-0" />
              </Link>
            ))}
          </nav>

          {/* Right Side (Desktop Lang + Login Icon + CTA + Mobile Toggle) */}
          <div className="flex items-center gap-4 z-50 shrink-0">
            {/* Desktop Language Toggle */}
            {mounted && (
              <Link
                href={otherLocalePath}
                className="hidden lg:flex items-center justify-center text-[10px] font-bold uppercase tracking-widest text-cream/70 transition-colors hover:text-gold"
              >
                {locale === "en" ? "العربية" : "English"}
              </Link>
            )}

            {/* Login Icon (Desktop) */}
            <Link
              href={`/${locale}/login`}
              className="hidden lg:flex items-center justify-center text-cream/70 hover:text-gold transition-colors"
              aria-label="Login"
            >
              <User size={18} />
            </Link>

            {/* Currency Selector (Desktop) */}
            <CurrencySelector isAr={locale === "ar"} className="hidden lg:block" />

            {/* Cart */}
            <button
              type="button"
              onClick={() => router.push(`/${locale}/cart`)}
              className="relative flex items-center justify-center text-cream/70 hover:text-gold transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-yellow-400 px-1 text-[9px] font-bold text-[#070D19]">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Desktop CTA */}
            <Link
              href={`/${locale}#contact`}
              onClick={(e) => {
                e.preventDefault();
                setContactOpen(true);
              }}
              className="hidden lg:inline-flex items-center justify-center !px-6 h-[40px] bg-yellow-400 text-[#070D19] font-bold uppercase tracking-widest text-[10px] hover:bg-yellow-500 transition-all whitespace-nowrap"
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

      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} locale={locale} />

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
                  onClick={(e) => {
                    link.onClick?.(e);
                    setMobileOpen(false);
                  }}
                  className="text-xl text-cream font-serif-en uppercase tracking-widest border-b border-cream/10 pb-4"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto pt-10 flex flex-col gap-4">
              <div className="flex items-center justify-center w-full border border-cream/20 py-4">
                <CurrencySelector isAr={locale === "ar"} />
              </div>
              <Link
                href={otherLocalePath}
                className="flex items-center justify-center w-full border border-gold text-gold py-4 text-sm font-bold uppercase tracking-widest"
              >
                {locale === "en" ? "العربية" : "English"}
              </Link>
              <Link
                href={`/${locale}/cart`}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center w-full border border-cream/20 text-cream py-4 text-sm font-bold uppercase tracking-widest"
              >
                {locale === "ar" ? "السلة" : "Cart"} ({cartCount})
              </Link>
              <Link
                href={`/${locale}/login`}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center w-full border border-cream/20 text-cream py-4 text-sm font-bold uppercase tracking-widest"
              >
                {dict.nav.login}
              </Link>
              <Link
                href={`/${locale}#contact`}
                onClick={(e) => {
                  e.preventDefault();
                  setMobileOpen(false);
                  setContactOpen(true);
                }}
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
