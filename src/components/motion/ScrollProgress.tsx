"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * ScrollProgress — emerald → scarlet gradient progress bar fixed at
 * the top of the viewport. Driven by Framer Motion's spring-smoothed
 * scroll progress.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping:   30,
    mass:      0.4,
  });

  return (
    <motion.div
      aria-hidden
      className="fixed top-0 inset-x-0 z-[60] h-[2px] origin-left pointer-events-none"
      style={{
        scaleX,
        background: "linear-gradient(90deg, #1F6B4F 0%, #FFFFFF 50%, #C8102E 100%)",
        boxShadow: "0 0 18px rgba(31,107,79,0.55)",
      }}
    />
  );
}
