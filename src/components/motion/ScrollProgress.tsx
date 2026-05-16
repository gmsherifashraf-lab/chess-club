"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * ScrollProgress — a single restrained reading-progress hairline at the
 * very top of the viewport. Spring-smoothed, no glow (federation
 * register: the motion is felt, not flaunted).
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 30,
    mass: 0.4,
  });

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-[linear-gradient(90deg,#0A5234_0%,#117A4F_55%,#C8102E_100%)] rtl:origin-right"
      style={{ scaleX }}
    />
  );
}
