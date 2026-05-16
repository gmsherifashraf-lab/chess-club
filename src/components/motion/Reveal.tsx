"use client";

import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
  type Transition,
} from "framer-motion";
import { type ReactNode } from "react";
import { EASE_EMPHASIS } from "@/lib/motion";

interface RevealProps
  extends Omit<
    HTMLMotionProps<"div">,
    "children" | "initial" | "animate" | "whileInView" | "viewport" | "transition"
  > {
  children: ReactNode;
  /** Delay before animation starts (seconds). */
  delay?: number;
  /** Vertical translate distance in px. */
  y?: number;
  /** Animation duration in seconds. */
  duration?: number;
  /** Reveal once (default true) or every time it scrolls into view. */
  once?: boolean;
  /** IntersectionObserver root margin (default: -80px). */
  margin?: `${number}px` | `${number}% ${number}%`;
}

/**
 * Reveal — fades + lifts children into view on the design system's
 * signature ease-out curve, so every section enters with the same
 * restrained, premium cadence. Honours prefers-reduced-motion (drops
 * the translate and snaps in).
 */
export default function Reveal({
  children,
  delay = 0,
  y = 24,
  duration = 0.7,
  once = true,
  margin = "-80px",
  ...rest
}: RevealProps) {
  const reduce = useReducedMotion();
  const transition: Transition = {
    duration: reduce ? 0 : duration,
    delay: reduce ? 0 : delay,
    ease: EASE_EMPHASIS,
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : y }}
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
 * RevealStagger — orchestrates a list so each child enters in sequence.
 * Children should be <motion.*> blocks using `childVariants`.
 */
export function RevealStagger({
  children,
  staggerChildren = 0.08,
  delayChildren = 0,
  className,
}: {
  children: ReactNode;
  staggerChildren?: number;
  delayChildren?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: reduce ? 0 : staggerChildren,
            delayChildren: reduce ? 0 : delayChildren,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export const childVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_EMPHASIS },
  },
};
