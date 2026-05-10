/**
 * Motion design tokens — shared between Framer Motion and CSS.
 * Mirrors the `--ds-ease-*` and `--ds-dur-*` values in globals.css.
 *
 * Use these constants from any client component instead of redefining
 * cubic-bezier curves inline. If you change a curve, change it here.
 */

// ── Easing curves ───────────────────────────────────────────────────
/** Signature luxury curve. Use for headlines, feature reveals, cards. */
export const EASE_EMPHASIS = [0.16, 1, 0.3, 1] as const;
/** Baseline state changes (hovers, tab switches). */
export const EASE_STANDARD = [0.4, 0, 0.2, 1] as const;
/** Entrances — content arriving. */
export const EASE_DECEL = [0, 0, 0.2, 1] as const;
/** Exits — content leaving. */
export const EASE_ACCEL = [0.4, 0, 1, 1] as const;

// ── Durations (seconds, for Framer) ─────────────────────────────────
export const DUR = {
  instant: 0.10,
  fast:    0.18,
  base:    0.28,
  slow:    0.48,
  slower:  0.72,
} as const;

// ── Pre-baked variants ──────────────────────────────────────────────
/** Fade up with the signature emphasis curve. */
export const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_EMPHASIS } },
};

/** Fade up — short variant for list items inside a stagger. */
export const fadeUpShort = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_EMPHASIS } },
};

/** Slide-in from inline-start (used for sidebar lists). */
export const slideIn = {
  hidden:  { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE_EMPHASIS } },
};

/** Stagger container — apply alongside a fadeUp/fadeUpShort variant on children. */
export const staggerContainer = (staggerChildren = 0.08, delayChildren = 0) => ({
  hidden:  {},
  visible: { transition: { staggerChildren, delayChildren } },
});
