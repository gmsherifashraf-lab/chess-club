/**
 * Skeleton — universal shimmer placeholder for loading states.
 *
 * GPU-friendly: only `transform` and `opacity` are animated, via a CSS
 * background-position keyframe (handled in globals.css `.skel-shimmer`).
 * Respects `prefers-reduced-motion` (animation paused, plain solid bg).
 *
 * Variants:
 *   - "light"  : for use on cream / white sections (default)
 *   - "dark"   : for use on the dark cinematic sections
 *
 * Composition:
 *   <Skeleton h={20} w="60%" />
 *   <Skeleton circle size={48} />
 *   <Skeleton rounded={14} h={180} />
 *
 * Server-component-safe (no client hooks, no framer-motion).
 */
import type { CSSProperties, HTMLAttributes } from "react";

interface Props extends Omit<HTMLAttributes<HTMLSpanElement>, "style"> {
  /** Width — number (px) or any CSS length (e.g. "60%"). */
  w?: number | string;
  /** Height — number (px) or any CSS length. */
  h?: number | string;
  /** Border radius (px). Ignored when `circle` is true. */
  rounded?: number;
  /** Pill shape (full radius). */
  pill?: boolean;
  /** Round circle. Sets equal width and height from `size`. */
  circle?: boolean;
  /** Size for circle variant (px). */
  size?: number;
  /** Stagger delay so several skeletons don't shimmer in sync. */
  delay?: number;
  /** Tone: "light" (default) for cream/white surfaces, "dark" for ink. */
  tone?: "light" | "dark";
  /** Wrapper style override. */
  style?: CSSProperties;
}

export default function Skeleton({
  w,
  h,
  rounded,
  pill,
  circle,
  size = 24,
  delay = 0,
  tone = "light",
  className,
  style,
  ...rest
}: Props) {
  const base: CSSProperties = circle
    ? { width: size, height: size, borderRadius: "9999px" }
    : {
        width:  w ?? "100%",
        height: h ?? 16,
        borderRadius: pill ? 9999 : rounded ?? 8,
      };

  return (
    <span
      aria-hidden
      className={`skel-shimmer skel-${tone} ${className ?? ""}`}
      style={{
        ...base,
        animationDelay: `${delay}s`,
        display: "block",
        ...style,
      }}
      {...rest}
    />
  );
}
