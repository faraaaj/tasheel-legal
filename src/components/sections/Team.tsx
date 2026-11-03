"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { teamMembers } from "@/data/team";
import type { Dictionary, Locale } from "@/lib/dictionaries";

type TeamProps = {
  locale: Locale;
  dict: Dictionary;
};

export default function Team({ locale, dict }: TeamProps) {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  const getTierLabel = (tier: string) => {
    const tierLabels = {
      executive: { en: "Executive Management", ar: "الإدارة التنفيذية" },
      partner: { en: "Senior Counsel", ar: "المستشارون الأول" },
      associate: { en: "Associates", ar: "المحامون" },
    };
    return tierLabels[tier as keyof typeof tierLabels];
  };

  return (
    <section id="team" className="bg-[#070D19] py-20 scroll-mt-24 lg:py-28">
      <div className="shell">
        <span className="eyebrow">{dict.team.eyebrow}</span>
        <h2 className="mt-6 font-serif-en text-[2.2rem] leading-[1.1] text-navy sm:text-[2.75rem] rtl:text-[1.9rem] rtl:leading-[1.4]">
          {dict.team.headline}
        </h2>

        {[
          "executive",
          "partner",
          "associate"
        ].map((tier) => {
          const members = teamMembers.filter((member) => member.tier === tier);
          if (members.length === 0) return null;

          return (
            <div key={tier} className="mt-20">
              <h3 className="mb-10 border-b border-[#C5A880]/30 pb-4 font-serif-en text-2xl text-[#C5A880]">
                {getTierLabel(tier)[locale]}
              </h3>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {members.map((member) => (
                  <motion.div
                    key={member.slug}
                    onClick={() => setSelectedMember(member.slug)}
                    className="group cursor-pointer overflow-hidden bg-[#0A1120] border border-white/5 transition-all hover:border-[#C5A880]/50"
                    whileHover={{ y: -5 }}
                  >
                    <div className="relative aspect-[3/4] w-full bg-[#070D19]">
                      <Image
                        src={member.image}
                        alt={locale === "ar" ? member.nameAr : member.nameEn}
                        fill
                        className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6 text-left rtl:text-right">
                      <h4 className="font-serif-en text-xl text-white">
                        {locale === "ar" ? member.nameAr : member.nameEn}
                      </h4>
                      <p className="mt-2 text-[11px] uppercase tracking-wider text-[#C5A880]">
                        {locale === "ar" ? member.roleAr : member.roleEn}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}

        <AnimatePresence>
          {selectedMember && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
              onClick={() => setSelectedMember(null)}
            >
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="relative w-full max-w-2xl rounded-lg bg-[#0A1120] p-8 max-h-[90vh] overflow-y-auto border border-[#C5A880]/50"
                onClick={(e) => e.stopPropagation()}
              >
                {teamMembers
                  .filter((m) => m.slug === selectedMember)
                  .map((member) => (
                    <div key={member.slug}>
                      <div className="mb-8 flex items-center justify-between">
                        <div>
                          <h3 className="font-serif-en text-3xl text-white">
                            {locale === "ar" ? member.nameAr : member.nameEn}
                          </h3>
                          <p className="text-[#C5A880] uppercase tracking-wider">
                            {locale === "ar" ? member.roleAr : member.roleEn}
                          </p>
                        </div>
                        <button
                          onClick={() => setSelectedMember(null)}
                          className="text-white/70 hover:text-white"
                        >
                          <X size={24} />
                        </button>
                      </div>
                      <div className="prose prose-invert max-w-none text-white/90">
                        {(member.comingSoon
                          ? locale === "ar"
                            ? member.bioAr || []
                            : member.bioEn || []
                          : locale === "ar"
                          ? member.bioAr
                          : member.bioEn
                        )?.map((paragraph, index) => (
                          <p key={index} className="mb-4 text-base leading-relaxed">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}