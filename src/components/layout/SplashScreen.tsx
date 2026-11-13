"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1000),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 3500),
      setTimeout(() => setPhase(4), 5000),
      setTimeout(() => {
        setPhase(6);
        setTimeout(() => setIsVisible(false), 1500);
      }, 8000),
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
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#070D19] overflow-hidden"
        >
          {/* Background Glow with Pulse */}
          <motion.div
            animate={{
              scale: phase >= 2 ? [1, 1.2, 1] : 0,
              opacity: phase >= 2 ? 0.2 : 0,
            }}
            transition={{ duration: 4, ease: "easeInOut", repeat: phase >= 2 ? Infinity : 0 }}
            className="absolute w-[500px] h-[500px] rounded-full bg-[#C5A880] blur-[120px]"
          />

          {/* PHASE 1 & 2: Logo Flying In & Spinning */}
          <motion.div
            initial={{ x: "-100vw", y: "-100vh", rotate: -1080, opacity: 0, scale: 0.5 }}
            animate={{
              x: phase >= 1 ? 0 : "-100vw",
              y: phase >= 1 ? 0 : "-100vh",
              rotate: phase >= 1 ? 0 : -1080,
              opacity: phase >= 1 ? 1 : 0,
              scale: phase >= 5 ? 1.1 : 1,
            }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10"
          >
            <Image
              src="/logo-t.png"
              alt="Tasheel Legal"
              width={220}
              height={220}
              className="object-contain drop-shadow-[0_0_60px_rgba(197,168,128,0.8)]"
              priority
            />
          </motion.div>

          {/* PHASE 3: Arabic Name Sliding from Top */}
          <motion.div
            initial={{ y: -100, opacity: 0, filter: "blur(10px)" }}
            animate={{
              y: phase >= 3 ? 0 : -100,
              opacity: phase >= 3 ? 1 : 0,
              filter: phase >= 3 ? "blur(0px)" : "blur(10px)",
            }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 mt-10 text-center"
          >
            <h2 className="font-sans-ar text-5xl font-bold text-[#C5A880] drop-shadow-[0_0_20px_rgba(197,168,128,0.6)]">
              شركة تسهيل للمحاماة والاستشارات القانونية
            </h2>
          </motion.div>

          {/* PHASE 5: Final Gold Line */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{
              width: phase >= 4 ? 400 : 0,
              opacity: phase >= 4 ? 1 : 0,
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="relative z-10 mt-12 h-[2px] bg-gradient-to-r from-transparent via-[#C5A880] to-transparent"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
