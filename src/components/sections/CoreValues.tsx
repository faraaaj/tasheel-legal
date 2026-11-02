"use client";

import { motion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import type { Dictionary } from "@/lib/dictionaries";

type CoreValuesProps = {
  dict: Dictionary;
};

const EASE = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE },
  },
};

export default function CoreValues({ dict }: CoreValuesProps) {
  return (
    <section className="relative bg-[#FAF9F6] py-24 lg:py-32">
      <div className="shell">
        <Reveal>
          <SectionHeading
            eyebrow={dict.coreValues.eyebrow}
            title={dict.coreValues.headline}
            lead={dict.coreValues.lead}
          />
        </Reveal>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 grid gap-px overflow-hidden border border-navy/10 bg-navy/10 sm:grid-cols-2 lg:grid-cols-4"
        >
          {dict.coreValues.items.map((value) => (
            <motion.div
              key={value.number}
              variants={item}
              className="group relative bg-cream p-8 lg:p-9"
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gold transition-transform duration-500 ease-smooth group-hover:scale-x-100 rtl:origin-right"
              />
              <span className="font-serif-en text-[2rem] leading-none text-gold/45">
                {value.number}
              </span>
              <h3 className="mt-6 font-serif-en text-[1.35rem] leading-snug text-navy">
                {value.title}
              </h3>
              <p className="mt-4 text-[13.5px] leading-[1.85] text-navy/60 rtl:text-sm rtl:leading-[1.9]">
                {value.body}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
