"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase(1), 500);
    const timer2 = setTimeout(() => setPhase(2), 1200);
    const timer3 = setTimeout(() => setPhase(3), 2000);
    const timer4 = setTimeout(() => {
      setPhase(4);
      setTimeout(() => setIsVisible(false), 800);
    }, 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#070D19] overflow-hidden"
        >
          {/* Subtle Gold Ambient Glow */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: phase >= 1 ? 3 : 0,
              opacity: phase >= 1 ? 0.15 : 0,
            }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute w-96 h-96 rounded-full bg-[#C5A880] blur-[100px]"
          />

          {/* Logo Reveal */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{
              scale: phase >= 2 ? 1 : 0.85,
              opacity: phase >= 2 ? 1 : 0,
              y: phase >= 2 ? 0 : 20,
            }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10"
          >
            <svg width={160} height={160} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="100" height="100" fill="#0A192F" />
              <rect x="6" y="6" width="88" height="88" stroke="#C5A880" strokeWidth="2" />
              <path d="M25 28 H75 M50 28 V78" stroke="#C5A880" strokeWidth="12" strokeLinecap="square" />
            </svg>
          </motion.div>

          {/* Gold Progress Line */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{
              width: phase >= 2 ? 200 : 0,
              opacity: phase >= 2 ? 1 : 0,
            }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10 mt-12 h-[2px] bg-[#C5A880]/20 overflow-hidden"
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="h-full w-1/2 bg-[#C5A880]"
            />
          </motion.div>

          {/* Subtitle Reveal */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: phase >= 3 ? 0.6 : 0,
              y: phase >= 3 ? 0 : 10,
            }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 mt-6 text-[9px] uppercase tracking-[0.4em] text-[#C5A880]"
          >
            TASHEEL LEGAL
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
