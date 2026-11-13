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

          {/* Logo Image Reveal */}
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
            <Image
              src={isAr ? "/logo-ar.png" : "/logo-en.png"}
              alt="Tasheel Legal"
              width={280}
              height={280}
              className="object-contain drop-shadow-[0_0_30px_rgba(197,168,128,0.3)]"
              priority
            />
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
            {isAr ? "شركة تسهيل للمحاماة" : "TASHEEL LEGAL"}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
