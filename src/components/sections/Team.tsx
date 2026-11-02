"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { teamMembers, type TeamMember } from "@/data/team";
import type { Dictionary, Locale } from "@/lib/dictionaries";

type TeamProps = {
  locale: Locale;
  dict: Dictionary;
};

export default function Team({ locale, dict }: TeamProps) {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Reveal y={40} duration={0.8}>
      <section id="team" className="bg-[#070D19] py-24 scroll-mt-24 lg:py-32 border-t border-gold/20">
        <div className="shell">
          <Reveal>
            <SectionHeading
              eyebrow={dict.team.eyebrow}
              title={dict.team.headline}
              className="text-white"
            />
          </Reveal>
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {teamMembers.map((m, idx) => (
              <motion.div
                key={m.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -20px rgba(197,168,128,0.2)" }}
                onClick={() => setSelectedMember(m)}
                className="group cursor-pointer overflow-hidden rounded-sm border border-gold/10 bg-white/5 hover:bg-white/10 transition-all duration-500"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-navy-light flex items-center justify-center">
                  {m.comingSoon ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-navy/5 border border-navy/10">
                      <svg className="w-16 h-16 text-navy/20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-xs uppercase tracking-widest text-navy/40">
                        {locale === 'ar' ? 'قريباً' : 'Coming Soon'}
                      </span>
                    </div>
                  ) : (
                    <Image
                      src={m.image}
                      alt={locale === "ar" ? m.nameAr : m.nameEn}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-top transition-transform duration-700 hover:scale-105 grayscale group-hover:grayscale-0"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(locale === 'ar' ? m.nameAr : m.nameEn)}&background=0A192F&color=C5A880&size=800`;
                      }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent opacity-70 transition-opacity group-hover:opacity-40" />
                </div>
                <div className="p-6 text-left rtl:text-right">
                  <h3 className="font-serif-en text-[1.3rem] leading-snug text-white rtl:font-sans-ar rtl:text-[1.2rem]">
                    {locale === "ar" ? m.nameAr : m.nameEn}
                  </h3>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-gold rtl:tracking-normal rtl:normal-case">
                    {locale === "ar" ? m.roleAr : m.roleEn}
                  </p>
                  <div className="mt-6 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400 transition-colors group-hover:text-gold rtl:tracking-normal rtl:normal-case">
                    {dict.team.viewProfile}
                  </div>                </div>
              </motion.div>
            ))}
          </div>
          <Reveal className="mt-14 max-w-3xl border-s-2 border-gold/50 ps-6">
            <p className="text-[13px] leading-[1.9] text-gray-300 rtl:text-[13.5px]">
              {dict.team.note}
            </p>
          </Reveal>

          {/* Cinematic Full-Screen Modal — portaled to <body> so the parallax
              wrappers' transforms can't break position: fixed */}
          {mounted
            ? createPortal(
                <AnimatePresence>
                  {selectedMember && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#070D19]/90 p-4 backdrop-blur-sm"
                      onClick={() => setSelectedMember(null)}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="relative w-full max-w-4xl max-h-[85vh] overflow-hidden bg-[#0A1120] border border-[#C5A880]/30 shadow-2xl flex flex-col md:flex-row"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Modal Image */}
                        <div className="relative w-full md:w-2/5 h-[40vh] md:h-auto bg-[#070D19]">
                          <Image
                            src={selectedMember.image}
                            alt={locale === "ar" ? selectedMember.nameAr : selectedMember.nameEn}
                            fill
                            sizes="(max-width: 768px) 100vw, 40vw"
                            className="object-cover object-top"
                          />
                        </div>

                        {/* Modal Content - SCROLLABLE */}
                        <div className="no-scrollbar p-8 md:p-10 md:w-3/5 flex flex-col overflow-y-auto">
                          <h3 className="font-serif-en text-3xl text-[#FAF9F6] rtl:text-[1.8rem] rtl:leading-[1.5]">
                            {locale === "ar" ? selectedMember.nameAr : selectedMember.nameEn}
                          </h3>
                          <p className="mt-2 text-sm text-[#C5A880] uppercase tracking-wider rtl:tracking-normal rtl:normal-case">
                            {locale === "ar" ? selectedMember.roleAr : selectedMember.roleEn}
                          </p>

                          <div className="mt-6 text-[15px] leading-[1.8] text-gray-300 space-y-4">
                            {selectedMember.comingSoon ? (
                              <p className="italic text-[#C5A880]/70">{dict.team.comingSoon}</p>
                            ) : (
                              (locale === "ar" ? selectedMember.bioAr : selectedMember.bioEn).map((p, i) => (
                                <p key={i}>{p}</p>
                              ))
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => setSelectedMember(null)}
                          aria-label={locale === "ar" ? "إغلاق" : "Close"}
                          className="absolute top-4 right-4 text-white/70 hover:text-gold transition-colors bg-[#070D19]/50 p-2 rounded-full"
                        >
                          <X size={24} />
                        </button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>,
                document.body,
              )
            : null}
        </div>
      </section>
    </Reveal>
  );
}