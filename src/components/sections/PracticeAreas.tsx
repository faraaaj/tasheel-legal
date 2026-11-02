"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import type { Dictionary, Locale } from "@/lib/dictionaries";

type PracticeAreasProps = {
  locale: Locale;
  dict: Dictionary;
};

const EASE = [0.22, 1, 0.36, 1] as const;

export default function PracticeAreas({ locale, dict }: PracticeAreasProps) {
  const items = dict.practiceAreas.items;
  const [active, setActive] = useState(items[0]?.id ?? "");
  const [freshId, setFreshId] = useState<string | null>(null);
  const [jumpTick, setJumpTick] = useState(0);
  const refs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const offset = 168;
    function sync() {
      let current = items[0]?.id ?? "";
      for (const item of items) {
        const element = refs.current[item.id];
        if (!element) continue;
        if (element.getBoundingClientRect().top - offset <= 0) {
          current = item.id;
        }
      }
      setActive(current);
    }
    sync();
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [items]);

  function jump(id: string) {
    setActive(id);
    setFreshId(id);
    setJumpTick((tick) => tick + 1);
    refs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const listVariants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.08, delayChildren: 0.05 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: EASE },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: EASE }}
    >
      <section id="practice" className="bg-white py-24 scroll-mt-24 lg:py-32">
        <div className="shell">
          <Reveal>
            <SectionHeading
              eyebrow={dict.practiceAreas.eyebrow}
              title={dict.practiceAreas.headline}
              lead={dict.practiceAreas.lead}
            />
          </Reveal>

          <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-16">
            <aside className="min-w-0 lg:col-span-4">
              <div className="min-w-0 lg:sticky lg:top-28">
                <p className="hidden text-[10px] font-semibold uppercase tracking-[0.24em] text-navy/35 lg:block rtl:tracking-normal rtl:normal-case rtl:text-xs">
                  {dict.practiceAreas.sidebarLabel}
                </p>

                <div className="flex max-w-full gap-2 overflow-x-auto pb-3 lg:mt-5 lg:flex-col lg:gap-0 lg:overflow-visible lg:border-t lg:border-navy/10 lg:pb-0">
                  {items.map((item) => {
                    const isActive = active === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => jump(item.id)}
                        aria-current={isActive ? "true" : undefined}
                        className={`shrink-0 whitespace-nowrap border px-4 py-2.5 text-[11px] font-medium transition-colors duration-300 lg:flex lg:w-full lg:items-baseline lg:gap-4 lg:whitespace-normal lg:border-0 lg:border-b lg:border-navy/10 lg:px-0 lg:py-4 lg:text-start lg:text-[13px] ${
                          isActive
                            ? "border-navy bg-navy text-cream lg:border-navy/10 lg:bg-transparent lg:text-navy"
                            : "border-navy/15 text-navy/55 hover:border-gold hover:text-navy lg:border-navy/10 lg:text-navy/50 lg:hover:text-navy"
                        }`}
                      >
                        <span
                          className={`font-serif-en text-[10px] tracking-normal lg:text-[11px] ${
                            isActive ? "text-gold" : "text-gold/60"
                          }`}
                        >
                          {item.number}
                        </span>
                        <span className="leading-snug">{item.title}</span>
                        <span
                          aria-hidden="true"
                          className={`ms-auto hidden h-px bg-gold transition-all duration-500 lg:block ${
                            isActive ? "w-6 opacity-100" : "w-0 opacity-0"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </aside>

            <div className="min-w-0 lg:col-span-8">
              <motion.div
                variants={listVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-80px" }}
              >
                {items.map((item) => (
                <motion.article
                  key={item.id}
                  variants={cardVariants}
                  id={item.id}
                  ref={(element) => {
                    refs.current[item.id] = (element as unknown) as HTMLElement;
                  }}
                  className="scroll-mt-32 border-t border-navy/10 py-10 first:border-t-0 first:pt-0 lg:py-12"
                >
                  <motion.div
                    key={
                      freshId === item.id ? `${item.id}-${jumpTick}` : item.id
                    }
                    initial={
                      freshId === item.id ? { opacity: 0, y: 20 } : false
                    }
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="flex items-start gap-4 lg:gap-6"
                  >
                    <span className="mt-2 font-serif-en text-xs text-gold lg:text-sm">
                      {item.number}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-serif-en text-[1.55rem] leading-snug text-navy lg:text-[2rem] rtl:text-[1.35rem] rtl:leading-[1.5] rtl:lg:text-[1.7rem]">
                        {item.title}
                      </h3>
                      <p className="mt-4 max-w-2xl text-[14px] leading-[1.85] text-navy/60 rtl:text-[14.5px] rtl:leading-[1.95] lg:text-[15px]">
                        {item.body}
                      </p>
                      <Link
                        href={`/${locale}/contact`}
                        className="group/link relative mt-6 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-navy/40 transition-colors duration-300 hover:text-gold rtl:tracking-normal rtl:normal-case rtl:text-xs"
                      >
                        {dict.contact.eyebrow}
                        <ArrowRight size={13} className="rtl:rotate-180" />
                        <span
                          aria-hidden="true"
                          className="absolute -bottom-1 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover/link:w-full rtl:left-auto rtl:right-0"
                        />
                      </Link>
                    </div>
                  </motion.div>
                </motion.article>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
