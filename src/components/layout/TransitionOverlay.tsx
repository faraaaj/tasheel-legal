"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";

export default function TransitionOverlay({ locale }: { locale: string }) {
  const pathname = usePathname();
  const [showOverlay, setShowOverlay] = useState(false);
  const prevPathname = useRef(pathname);
  const isInitial = useRef(true);

  useEffect(() => {
    if (isInitial.current) {
      isInitial.current = false;
      return;
    }

    if (pathname !== prevPathname.current) {
      setShowOverlay(true);
      const timer = setTimeout(() => {
        setShowOverlay(false);
      }, 1200);

      prevPathname.current = pathname;
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return (
    <AnimatePresence>
      {showOverlay && (
        <motion.div
          key="transition"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 z-[150] flex items-center justify-center bg-[#070D19] pointer-events-none overflow-hidden"
        >
          {/* Gold Ambient Glow */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 2, opacity: 0.12 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute w-64 h-64 rounded-full bg-[#C5A880] blur-[80px]"
          />

          {/* Logo */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0, y: -10 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex flex-col items-center gap-4"
          >
            <Image
              src="/logo-t.png"
              alt="Tasheel Legal"
              width={60}
              height={60}
              className="object-contain drop-shadow-[0_0_20px_rgba(197,168,128,0.4)]"
            />
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 120, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="h-[1px] bg-gradient-to-r from-transparent via-[#C5A880] to-transparent"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
