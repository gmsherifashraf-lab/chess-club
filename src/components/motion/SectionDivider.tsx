"use client";

import { motion } from "framer-motion";

interface Props {
  /** Optional chess glyph to drift across the divider. */
  glyph?: string;
  /** Variant — emerald (default) or scarlet trail. */
  accent?: "emerald" | "scarlet" | "white";
}

/**
 * SectionDivider — thin animated separator between dark home sections.
 *
 * Renders:
 *  - a hairline gradient strip
 *  - a slowly drifting chess glyph that crosses left → right on a loop
 *  - a pulsing dot in the middle
 */
export default function SectionDivider({ glyph = "♛", accent = "emerald" }: Props) {
  const color =
    accent === "emerald" ? "#1F6B4F" : accent === "scarlet" ? "#C8102E" : "#FFFFFF";

  return (
    <div
      aria-hidden
      className="relative w-full h-16 overflow-hidden bg-black"
      style={{
        background:
          "radial-gradient(ellipse 60% 100% at 50% 50%, rgba(31,107,79,0.10) 0%, transparent 70%), #000",
      }}
    >
      {/* Hairline strip */}
      <div
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${color}80 50%, transparent 100%)`,
        }}
      />

      {/* Pulsing center dot */}
      <motion.span
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
        style={{ background: color, boxShadow: `0 0 14px ${color}` }}
        animate={{ scale: [1, 1.6, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Drifting chess glyph */}
      <motion.span
        className="absolute top-1/2 -translate-y-1/2 text-2xl select-none pointer-events-none"
        style={{ color, opacity: 0.18 }}
        initial={{ x: "-10%" }}
        animate={{ x: "110%" }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      >
        {glyph}
      </motion.span>

      {/* Counter-drifting subtle glyph */}
      <motion.span
        className="absolute top-1/2 -translate-y-1/2 text-base select-none pointer-events-none"
        style={{ color: "rgba(255,255,255,0.12)" }}
        initial={{ x: "110%" }}
        animate={{ x: "-10%" }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      >
        ♟
      </motion.span>
    </div>
  );
}
