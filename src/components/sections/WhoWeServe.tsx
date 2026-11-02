"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import type { Dictionary, Locale } from "@/lib/dictionaries";
import Reveal from "@/components/ui/Reveal";

type WhoWeServeProps = {
  locale: Locale;
  dict: Dictionary;
};

const EASE = [0.22, 1, 0.36, 1] as const;

export default function WhoWeServe({ locale, dict }: WhoWeServeProps) {
  const { items } = dict.whoWeServe;

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95, filter: "blur(10px)" },
    show: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transition: { duration: 0.8, ease: EASE } }
  };

  return (
    <section
      id="who-we-serve"
      className="bg-[#070D19] py-24 scroll-mt-24 lg:py-32 border-t border-gold/20"
    >
      <div className="shell">
        <Reveal>
          <div className="text-center mb-16">
            <h2 className="font-serif-en text-3xl lg:text-5xl text-cream leading-tight rtl:font-sans-ar rtl:text-3xl lg:rtl:text-4xl">
              {dict.whoWeServe.title}
            </h2>
            <div className="mt-4 h-1 w-20 bg-gold mx-auto" />
          </div>
        </Reveal>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {items.map((item, idx) => (
            <motion.div
              variants={cardVariants}
              key={item.title}
              className="group p-8 bg-white border border-white/10 hover:border-gold transition-all duration-500 hover:shadow-xl hover:shadow-gold/10"
            >
              <div className="mb-6 h-12 w-12 flex items-center justify-center rounded-full bg-gold text-[#070D19] group-hover:bg-cream transition-colors duration-500">
                <span className="font-serif-en text-lg font-bold">{idx + 1}</span>
              </div>
              <h3 className="font-serif-en text-xl text-navy mb-3 rtl:font-sans-ar rtl:text-lg">
                {item.title}
              </h3>
              <p className="text-navy/60 text-[14px] leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
