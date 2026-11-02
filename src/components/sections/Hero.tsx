"use client";

import Image from "next/image";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { heroHeadlines } from "@/data/heroHeadlines";
import type { Dictionary, Locale } from "@/lib/dictionaries";

type HeroProps = {
  locale: Locale;
  dict: Dictionary;
};

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Hero({ locale, dict }: HeroProps) {
  const [index, setIndex] = useState(0);

  // Cinematic scroll flicker: the skyline brightens through mid-scroll and
  // dims as the page content takes over.
  const { scrollYProgress } = useScroll();
  const imageBrightness = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 0.8]);
  const brightnessFilter = useTransform(imageBrightness, (v) => `brightness(${v})`);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const rotateHeadline = () => {
      // Move to the next index
      const nextIndex = (index + 1) % heroHeadlines.length;
      setIndex(nextIndex);

      // Calculate duration based on the NEXT headline (the one that will be shown)
      const nextText = heroHeadlines[nextIndex][locale];
      const textLength = nextText.length;

      // Base: 10 seconds (10000ms). Add 60ms per character. Cap at 20 seconds (20000ms).
      const baseTime = Math.min(20000, 10000 + textLength * 60);

      // Random variance: 0 to 2000ms (0-2 seconds)
      const randomVariance = Math.floor(Math.random() * 2000);
      const nextDuration = baseTime + randomVariance;

      timeoutId = setTimeout(rotateHeadline, nextDuration);
    };

    // Initial start delay: 10 seconds
    timeoutId = setTimeout(rotateHeadline, 10000);

    return () => clearTimeout(timeoutId);
  }, [index, locale]);

  const headline = heroHeadlines[index][locale];

  return (
    <section id="home" className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div aria-hidden="true" className="fixed inset-0 -z-10 bg-[#070D19]">
        <motion.div style={{ filter: brightnessFilter }} className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=2400&q=85"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center saturate-[1.15] animate-[slow-zoom_30s_ease-in-out_infinite_alternate]"
          />
        </motion.div>
        <div className="absolute inset-0 bg-[#070D19]/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070D19]/90 via-[#070D19]/50 to-transparent rtl:bg-gradient-to-l" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#070D19] to-transparent" />
      </div>

      <div className="relative z-10 w-full px-4 flex flex-col items-center justify-center min-h-screen pt-24 pb-32 lg:pb-40">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-center px-4 text-center">
          
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ staggerChildren: 0.15 }} className="flex flex-col items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>
              <span className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C5A880] rtl:text-[13px] rtl:tracking-normal rtl:font-bold">
                <span className="h-px w-8 bg-[#C5A880]/50" />
                {dict.hero.eyebrow}
                <span className="h-px w-8 bg-[#C5A880]/50" />
              </span>
            </motion.div>

            <div className="mt-8 flex min-h-[140px] w-full items-center justify-center lg:min-h-[180px]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.h1
                  key={`${locale}-${index}`}
                  lang={locale}
                  initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  exit={{ opacity: 0, filter: "blur(10px)", y: -20 }}
                  transition={{ duration: 0.8, ease: EASE }}
                  className="font-serif-en text-[2rem] leading-[1.2] tracking-[-0.01em] text-white sm:text-[2.5rem] lg:text-[3rem] lg:leading-[1.15] rtl:font-sans-ar rtl:text-[1.8rem] rtl:leading-[1.6] sm:rtl:text-[2.2rem] lg:rtl:text-[2.5rem]"
                >
                  {headline}
                </motion.h1>
              </AnimatePresence>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }} className="mt-6 w-full max-w-[42rem]">
              <p className="text-[14px] leading-[1.9] text-cream/80 text-justify rtl:text-justify">
                {dict.hero.subtext}
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row w-full">
                <a
                  href={`https://wa.me/966590964157?text=Hello%20Tasheel%20Legal,%20I%20would%20like%20to%20request%20a%20consultation.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn !min-w-[220px] !justify-center bg-yellow-400 text-[#070D19] hover:bg-yellow-500 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(250,204,21,0.35)] transition-all duration-300"
                >
                  {dict.hero.primaryCta}
                </a>
                <a
                  href={`/${locale}#practice`}
                  className="btn !min-w-[220px] !justify-center border border-cream/30 text-cream hover:bg-cream/10 transition-colors"
                >
                  {dict.hero.secondaryCta}
                </a>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
