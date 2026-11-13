"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1500),
      setTimeout(() => setPhase(2), 3000),
      setTimeout(() => setPhase(3), 4500),
      setTimeout(() => setPhase(4), 6000),
      setTimeout(() => setPhase(5), 7500),
      setTimeout(() => {
        setPhase(6);
        setTimeout(() => setIsVisible(false), 1500);
      }, 10000),
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
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#070D19] overflow-hidden px-4"
        >
          {/* Background Gold Glow */}
          <motion.div
            animate={{
              scale: phase >= 1 ? 2.5 : 0,
              opacity: phase >= 1 ? 0.15 : 0,
            }}
            transition={{ duration: 3, ease: "easeOut" }}
            className="absolute w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full bg-[#C5A880] blur-[80px] sm:blur-[120px]"
          />

          {/* Logo */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 40 }}
            animate={{
              scale: phase >= 2 ? 1 : 0.5,
              opacity: phase >= 2 ? 1 : 0,
              y: phase >= 2 ? 0 : 40,
            }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10"
          >
            <Image
              src="/logo-t.png"
              alt="Tasheel Legal"
              width={120}
              height={120}
              className="object-contain drop-shadow-[0_0_40px_rgba(197,168,128,0.5)] w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32"
              priority
            />
          </motion.div>

          {/* Arabic Name */}
          <motion.div
            initial={{ y: 40, opacity: 0, filter: "blur(8px)" }}
            animate={{
              y: phase >= 3 ? 0 : 40,
              opacity: phase >= 3 ? 1 : 0,
              filter: phase >= 3 ? "blur(0px)" : "blur(8px)",
            }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 mt-6 sm:mt-8 text-center px-4"
          >
            <h2 className="font-sans-ar text-2xl sm:text-3xl md:text-4xl font-bold text-[#C5A880] drop-shadow-[0_0_20px_rgba(197,168,128,0.4)] leading-tight">
              شركة تسهيل للمحاماة والاستشارات القانونية
            </h2>
          </motion.div>

          {/* English Name */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{
              y: phase >= 4 ? 0 : 40,
              opacity: phase >= 4 ? 1 : 0,
            }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 mt-3 sm:mt-4 text-center px-4"
          >
            <p className="font-sans-en text-sm sm:text-base md:text-lg font-bold uppercase tracking-[0.3em] sm:tracking-[0.5em] text-white/80">
              TASHEEL LEGAL
            </p>
          </motion.div>

          {/* Gold Line */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{
              width: phase >= 5 ? "60%" : 0,
              opacity: phase >= 5 ? 1 : 0,
            }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="relative z-10 mt-8 sm:mt-10 h-[1px] max-w-[300px] bg-gradient-to-r from-transparent via-[#C5A880] to-transparent"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
