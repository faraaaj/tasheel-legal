"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";

export function SplashScreen() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const isAr = locale === "ar";

  const [isVisible, setIsVisible] = useState(true);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1000),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 3000),
      setTimeout(() => setPhase(4), 4000),
      setTimeout(() => setPhase(5), 5000),
      setTimeout(() => {
        setPhase(6);
        setTimeout(() => setIsVisible(false), 1000);
      }, 6000),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#070D19] overflow-hidden perspective-[1000px]"
        >
          {/* Background Gold Glow */}
          <motion.div
            animate={{
              scale: phase >= 2 ? 2.5 : 0,
              opacity: phase >= 2 ? 0.15 : 0,
            }}
            transition={{ duration: 3, ease: "easeOut" }}
            className="absolute w-96 h-96 rounded-full bg-[#C5A880] blur-[100px]"
          />

          {/* PHASE 1 & 2: Logo Flying In & Spinning */}
          <motion.div
            initial={{
              x: "-100vw",
              y: "-100vh",
              rotate: -720,
              opacity: 0,
            }}
            animate={{
              x: phase >= 1 ? 0 : "-100vw",
              y: phase >= 1 ? 0 : "-100vh",
              rotate: phase >= 1 ? 0 : -720,
              opacity: phase >= 1 ? 1 : 0,
              scale: phase >= 5 ? 1.2 : 1,
            }}
            transition={{
              duration: 1.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative z-10"
          >
            <Image
              src="/new-t-icon.png"
              alt="T"
              width={180}
              height={180}
              className="object-contain drop-shadow-[0_0_40px_rgba(197,168,128,0.5)]"
              priority
              unoptimized
            />
          </motion.div>

          {/* PHASE 3: Arabic Name Sliding from Top */}
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{
              y: phase >= 3 ? 0 : -100,
              opacity: phase >= 3 ? 1 : 0,
            }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 mt-8 text-center"
          >
            <h2 className="font-serif-en text-3xl text-[#C5A880]">
              شركة تسهيل للمحاماة والاستشارات القانونية
            </h2>
          </motion.div>

          {/* PHASE 4: English Name Sliding from Bottom */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{
              y: phase >= 4 ? 0 : 100,
              opacity: phase >= 4 ? 1 : 0,
            }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 mt-4 text-center"
          >
            <p className="text-[12px] uppercase tracking-[0.5em] text-white/60">
              TASHEEL LEGAL
            </p>
          </motion.div>

          {/* PHASE 5: Final Glow Line */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{
              width: phase >= 5 ? 300 : 0,
              opacity: phase >= 5 ? 1 : 0,
            }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="relative z-10 mt-12 h-[1px] bg-gradient-to-r from-transparent via-[#C5A880] to-transparent"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
