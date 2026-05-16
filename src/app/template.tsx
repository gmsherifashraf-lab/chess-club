"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE_EMPHASIS } from "@/lib/motion";

/**
 * Per-navigation transition. `template.tsx` re-mounts on every route
 * change, so each page eases in with one quiet fade + rise. Restrained
 * by design (federation, not flashy); collapses to an instant render
 * under prefers-reduced-motion.
 */
export default function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.45, ease: EASE_EMPHASIS }}
    >
      {children}
    </motion.div>
  );
}
