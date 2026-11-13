"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";

type TransitionOverlayProps = {
  locale: string;
};

export default function TransitionOverlay({ locale }: TransitionOverlayProps) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const prevPathname = useRef(pathname);
  const isInitial = useRef(true);

  useEffect(() => {
    // Skip initial mount
    if (isInitial.current) {
      isInitial.current = false;
      return;
    }

    // Only trigger on actual path changes
    if (pathname !== prevPathname.current) {
      setShowOverlay(true);
      setIsTransitioning(true);

      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setTimeout(() => setShowOverlay(false), 300);
      }, 800);

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
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 z-[150] flex items-center justify-center bg-[#070D19] pointer-events-none"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-4"
          >
            <Image
              src="/logo-t.png"
              alt="Tasheel Legal"
              width={60}
              height={60}
              className="object-contain"
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 120 }}
              exit={{ width: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="h-[1px] bg-gradient-to-r from-transparent via-[#C5A880] to-transparent"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
