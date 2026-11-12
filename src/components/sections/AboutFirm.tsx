"use client";

import { motion } from "framer-motion";
import type { Dictionary } from "@/lib/dictionaries";

type AboutFirmProps = {
  dict: Dictionary;
};

const EASE = [0.22, 1, 0.36, 1] as const;

export default function AboutFirm({ dict }: AboutFirmProps) {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-[#070D19] py-24 text-cream scroll-mt-24 lg:py-32"
    >
      <div className="shell">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          
          {/* Left Column - Quote & Supporting Statement */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: EASE }}
            className="relative"
          >
            <span className="absolute -top-12 -left-6 text-8xl font-serif-en text-gold/20 select-none">
              &ldquo;
            </span>
            <h2 className="relative z-10 font-serif-en text-3xl leading-snug lg:text-4xl">
              {dict.aboutFirm.quote}
            </h2>
            <div className="mt-8 flex items-center gap-4">
              <span className="h-px w-12 bg-gold" />
              <span className="text-sm uppercase tracking-[0.2em] text-gold">
                {dict.aboutFirm.quoteAuthor || "Institutional Leadership"}
              </span>
            </div>

            {/* Supporting statement */}
            <div className="mt-10 border-l-2 border-gold/40 ps-6 rtl:border-l-0 rtl:border-r-2 rtl:ps-0 rtl:pe-6">
              <p className="text-[15px] leading-[1.9] text-cream/60 italic">
                {dict.aboutFirm.supportingStatement}
              </p>
            </div>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          >
            <h3 className="text-sm uppercase tracking-[0.2em] text-gold">
              {dict.aboutFirm.eyebrow}
            </h3>
            <h2 className="mt-4 font-serif-en text-4xl leading-tight lg:text-5xl">
              {dict.aboutFirm.headline}
            </h2>
            <p className="mt-8 text-[16px] leading-[1.9] text-cream/70 text-left rtl:text-right whitespace-pre-line">
              {dict.aboutFirm.body}
            </p>

            {/* Mission */}
            <div className="mt-8 border-t border-white/10 pt-6">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold/80">
                {dict.aboutFirm.missionLabel}
              </h4>
              <p className="mt-3 text-[15px] leading-[1.8] text-cream/70">
                {dict.aboutFirm.mission}
              </p>
            </div>

            <ul className="mt-8 space-y-4">
              {dict.aboutFirm.credentials.map((credential, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <svg className="mt-1 h-5 w-5 shrink-0 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-[15px] text-cream/80">{credential}</span>
                </li>
              ))}
            </ul>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
