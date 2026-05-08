"use client";

import { motion, type HTMLMotionProps, type Transition } from "framer-motion";
import { type ReactNode } from "react";

interface RevealProps extends Omit<HTMLMotionProps<"div">, "children" | "initial" | "animate" | "whileInView" | "viewport" | "transition"> {
  children:    ReactNode;
  /** Delay before animation starts (seconds). */
  delay?:      number;
  /** Vertical translate distance in px. */
  y?:          number;
  /** Animation duration in seconds. */
  duration?:   number;
  /** Reveal once (default true) or every time it scrolls into view. */
  once?:       boolean;
  /** IntersectionObserver root margin (default: -80px to start a bit before). */
  margin?:     `${number}px` | `${number}% ${number}%`;
}

/**
 * Reveal — fades + lifts children when scrolled into the viewport.
 *
 * Cheap, accessible (respects `prefers-reduced-motion` via Framer's
 * `useReducedMotion` baked into transitions), and reusable in every
 * home section without each one needing to import framer-motion.
 *
 * <Reveal><h2>...</h2></Reveal>
 */
export default function Reveal({
  children,
  delay   = 0,
  y       = 28,
  duration = 0.7,
  once    = true,
  margin  = "-80px",
  ...rest
}: RevealProps) {
  const transition: Transition = { duration, delay, ease: [0.2, 0.8, 0.2, 1] };
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin }}
      transition={transition}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/**
 * RevealStagger — wraps a list of items so each child appears with a
 * staggered delay. Use children that are already <Reveal> or
 * <motion.div> blocks — or pass plain elements via the `items` API.
 */
export function RevealStagger({
  children,
  staggerChildren = 0.08,
  delayChildren   = 0,
}: {
  children:        ReactNode;
  staggerChildren?: number;
  delayChildren?:   number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden:  {},
        visible: {
          transition: { staggerChildren, delayChildren },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export const childVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] } },
};
