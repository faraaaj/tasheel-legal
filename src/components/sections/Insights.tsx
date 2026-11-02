"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import type { Dictionary } from "@/lib/dictionaries";

type InsightsProps = {
  dict: Dictionary;
};

const EASE = [0.22, 1, 0.36, 1] as const;

const grid = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15, delayChildren: 0.05 },
  },
};

const card = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASE },
  },
};

export default function Insights({ dict }: InsightsProps) {
  return (
    <Reveal y={40} duration={0.8}>
      <section id="insights" className="bg-white py-24 scroll-mt-24 lg:py-32">
        <div className="shell">
          <Reveal>
            <SectionHeading
              eyebrow={dict.insights.eyebrow}
              title={dict.insights.headline}
            />
            <p className="mt-6 text-lg text-gray-600 max-w-3xl leading-relaxed rtl:text-lg">
              {dict.insights.lead}
            </p>
          </Reveal>

          <motion.div
            variants={grid}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="mt-14 grid gap-6 md:grid-cols-3"
          >
            {dict.insights.items.map((insight) => (
              <motion.div key={insight.title} variants={card} className="h-full">
                <article className="group flex h-full flex-col border-t border-gold/70 bg-white p-7 transition-all duration-500 ease-smooth hover:-translate-y-1 hover:border-gold hover:shadow-[0_24px_60px_-40px_rgba(10,25,47,0.45)] lg:p-8">
                  <div className="flex items-center justify-between gap-4 text-[10px] uppercase tracking-[0.18em] rtl:tracking-normal rtl:normal-case">
                    <span className="font-semibold text-gold">
                      {insight.category}
                    </span>
                    <ArrowUpRight
                      size={14}
                      className="text-navy/25 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold rtl:-scale-x-100"
                    />
                  </div>

                  <h3 className="mt-6 font-serif-en text-[1.4rem] leading-[1.35] text-navy transition-colors duration-300 group-hover:text-navy/80 rtl:text-[1.2rem] rtl:leading-[1.65]">
                    {insight.title}
                  </h3>

                  <p className="mt-4 flex-1 text-[13.5px] leading-[1.85] text-navy/55 rtl:text-sm rtl:leading-[1.9]">
                    {insight.excerpt}
                  </p>

                  <span className="mt-7 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-navy/45 transition-colors duration-300 group-hover:text-gold rtl:tracking-normal rtl:normal-case rtl:text-xs">
                    {dict.insights.readMore}
                    <ArrowUpRight
                      size={13}
                      className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100"
                    />
                  </span>
                </article>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </Reveal>
  );
}
