"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { teamMembers } from "@/data/team";
import type { Dictionary, Locale } from "@/lib/dictionaries";

type TeamMember = {
  slug: string;
  nameEn: string;
  nameAr: string;
  fullNameEn?: string;
  fullNameAr?: string;
  roleEn: string;
  roleAr: string;
  tier: "executive" | "partner" | "associate";
  image: string;
  bioEn: string[];
  bioAr: string[];
  comingSoon?: boolean;
};

type TeamProps = {
  locale: Locale;
  dict: Dictionary;
};

export default function Team({ locale, dict }: TeamProps) {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const tiers = [
    { key: 'executive', titleEn: 'Executive Management', titleAr: 'الإدارة التنفيذية' },
    { key: 'partner', titleEn: 'Partners & Senior Counsel', titleAr: 'الشركاء والمستشارون الأول' },
    { key: 'associate', titleEn: 'Associates', titleAr: 'المحامون' },
  ];

  return (
    <section id="team" className="bg-[#070D19] py-24 scroll-mt-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C5A880]">
            {dict.team.eyebrow || "Our Team"}
          </span>
          <h2 className="mt-4 font-serif-en text-4xl text-white sm:text-5xl">
            {dict.team.headline}
          </h2>
        </div>

        {tiers.map((tier) => {
          const members = teamMembers.filter(m => m.tier === tier.key);
          if (members.length === 0) return null;

          return (
            <div key={tier.key} className="mt-20">
              <h3 className="mb-10 border-b border-[#C5A880]/30 pb-4 font-serif-en text-2xl text-[#C5A880]">
                {locale === 'ar' ? tier.titleAr : tier.titleEn}
              </h3>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                {members.map((member) => (
                  <motion.div
                    key={member.slug}
                    onClick={() => setSelectedMember(member)}
                    className="group cursor-pointer overflow-hidden bg-[#0A1120] border border-white/5 transition-all hover:border-[#C5A880]/50"
                    whileHover={{ y: -5 }}
                  >
                    <div className="relative aspect-[3/4] w-full bg-[#070D19] flex items-center justify-center">
                      {member.comingSoon ? (
                        <div className="flex flex-col items-center justify-center p-8 text-center opacity-50">
                           <img src="/logo.svg" alt="Tasheel Legal" className="w-24 h-24 mb-4 opacity-70" />
                           <span className="text-[#C5A880] text-sm uppercase tracking-widest">
                              {locale === 'ar' ? 'قريباً' : 'Coming Soon'}
                           </span>
                        </div>
                      ) : (
                        <Image
                          src={member.image}
                          alt={locale === 'ar' ? member.nameAr : member.nameEn}
                          fill
                          className="object-cover object-top transition-all duration-700 grayscale hover:grayscale-0 hover:scale-105"
                        />
                      )}
                    </div>
                    <div className="p-6 text-left rtl:text-right">
                      {member.fullNameEn && member.fullNameAr ? (
                        <>
                          <p className="text-[11px] uppercase tracking-wider text-[#C5A880] mb-1">
                            {locale === 'ar' ? member.nameAr : member.nameEn}
                          </p>
                          <h4 className="font-serif-en text-xl text-white">
                            {locale === 'ar' ? member.fullNameAr : member.fullNameEn}
                          </h4>
                        </>
                      ) : (
                        <h4 className="font-serif-en text-xl text-white">
                          {locale === 'ar' ? member.nameAr : member.nameEn}
                        </h4>
                      )}
                      <p className="mt-2 text-[11px] uppercase tracking-wider text-[#C5A880]">
                        {locale === 'ar' ? member.roleAr : member.roleEn}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#070D19]/80 p-4 md:p-8 backdrop-blur-xl"
            onClick={() => setSelectedMember(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full h-[95vh] max-w-6xl overflow-hidden bg-[#0A1120] border border-[#C5A880]/30 shadow-2xl flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full md:w-2/5 h-[40vh] md:h-auto bg-[#070D19]">
                 <Image src={selectedMember.image} alt={selectedMember.nameEn} fill className="object-cover object-top" />
              </div>
              
              <div className="p-8 md:p-12 md:w-3/5 flex flex-col h-full overflow-hidden">
                <h3 className="font-serif-en text-3xl text-[#FAF9F6]">
                  {locale === 'ar' ? (selectedMember.fullNameAr ?? selectedMember.nameAr) : (selectedMember.fullNameEn ?? selectedMember.nameEn)}
                </h3>
                <p className="mt-2 text-sm text-[#C5A880] uppercase tracking-wider">
                  {locale === 'ar' ? selectedMember.roleAr : selectedMember.roleEn}
                </p>
                
                <div className="mt-6 text-[16px] leading-[1.9] text-gray-300 text-justify rtl:text-justify overflow-y-auto scrollbar-hide h-full pr-6">
                  {selectedMember.comingSoon ? (
                    <p className="italic text-[#C5A880]/70">{dict.team.comingSoon}</p>
                  ) : (
                    (locale === 'ar' ? selectedMember.bioAr : selectedMember.bioEn).map((p, i) => (
                      <p key={i} className={`mb-4 break-inside-avoid ${i === 0 ? "font-semibold text-white" : ""}`}>
                        {p}
                      </p>
                    ))
                  )}
                </div>
              </div>

              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 text-white/70 hover:text-gold transition-colors bg-[#070D19]/50 p-2 rounded-full"
              >
                <X size={24} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}