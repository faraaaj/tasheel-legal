"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import type { Dictionary, Locale } from "@/lib/dictionaries";

type MethodologyProps = {
  locale: Locale;
  dict: Dictionary;
};

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Methodology({ locale, dict }: MethodologyProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section id="methodology" className="relative overflow-hidden bg-[#FAF9F6] py-24 text-navy lg:py-32">
      <div className="shell">
        
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow justify-center">{dict.methodology.eyebrow}</span>
          <h2 className="mt-6 font-serif-en text-4xl leading-tight lg:text-5xl rtl:text-3xl">
            {dict.methodology.headline}
          </h2>
          <p className="mt-6 text-[16px] leading-[1.8] text-navy/70 rtl:text-[15px] rtl:leading-[1.9]">
            {dict.methodology.lead}
          </p>
        </div>

        {/* Steps Timeline */}
        <div className="relative mt-20" ref={containerRef}>
          
          {/* Connector Line (Hidden on mobile) */}
          <div className="absolute left-0 top-12 hidden h-px w-full bg-navy/10 lg:block">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.5, ease: EASE }}
              className="h-full w-full origin-left bg-gold"
            />
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-6">
            {dict.methodology.steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.15, ease: EASE }}
                className="relative flex flex-col items-center text-center lg:items-start lg:text-left rtl:lg:items-end rtl:lg:text-right"
              >
                {/* Step Number */}
                <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full border border-navy/10 bg-cream shadow-sm">
                  <span className="font-serif-en text-3xl text-gold">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                
                {/* Step Content */}
                <h3 className="mt-6 font-serif-en text-2xl text-navy">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-[1.8] text-navy/70">
                  {step.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
