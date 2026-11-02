"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type SectionRevealProps = {
  children: ReactNode;
  className?: string;
};

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Cinematic "parallax reveal" wrapper: each section slides up over the
 * previous one as the user scrolls, with a soft scale settle and a deep
 * shadow that sells the stacked, layered feel.
 */
export default function SectionReveal({ children, className = "" }: SectionRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: EASE }}
      className={`relative z-10 shadow-2xl ${className}`}
    >
      {children}
    </motion.div>
  );
}
