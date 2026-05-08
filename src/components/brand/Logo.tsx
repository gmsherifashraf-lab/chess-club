"use client";

import { LOGO_URI } from "@/lib/logo";

interface Props {
  /** Pixel size of the logo image. */
  size?:   number;
  /** Render an emerald glow halo behind the logo. */
  glow?:   boolean;
  /** Soft entrance animation (fade + scale on mount). */
  animate?: boolean;
  /** White ring around the logo (looks great on dark backgrounds). */
  ring?:   boolean;
  /**
   * Visual treatment of the logo image:
   *  - "natural" : original colors (use on light backgrounds)
   *  - "white"   : rendered as a pure white silhouette (CSS filter)
   *                — use on dark backgrounds so the logo is visible
   *  - "ivory"   : warm off-white silhouette
   */
  tone?:   "natural" | "white" | "ivory";
  /** Tailwind classes appended to the wrapper. */
  className?: string;
}

/**
 * Logo
 *
 * Single source of truth for the club mark. The asset itself is a
 * colored emblem stored as a base64 URI in `src/lib/logo.ts`. On
 * dark surfaces (navbar, hero, footer, loading screen, etc.) the
 * `tone="white"` variant uses a CSS filter to render it as a pure
 * white silhouette so it remains crisp and visible.
 */
export default function Logo({
  size = 56,
  glow = false,
  animate = false,
  ring = false,
  tone = "natural",
  className = "",
}: Props) {
  const filter =
    tone === "white"
      ? "brightness(0) invert(1) drop-shadow(0 0 0.6px rgba(255,255,255,0.4))"
      : tone === "ivory"
      ? "brightness(0) invert(1) sepia(8%) saturate(120%) brightness(0.96)"
      : undefined;

  return (
    <span
      className={`relative inline-flex items-center justify-center ${glow ? "logo-glow" : ""} ${animate ? "logo-mount" : ""} ${className}`}
      style={{ width: size, height: size }}
    >
      {ring && (
        <span
          aria-hidden
          className="absolute inset-0 rounded-full"
          style={{
            background: "linear-gradient(135deg, rgba(31,107,79,0.45) 0%, rgba(200,16,46,0.30) 100%)",
            padding: 2,
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={LOGO_URI}
        alt="Chess & Culture Club for Women — official emblem"
        width={size}
        height={size}
        style={{
          width:  size,
          height: size,
          objectFit: "contain",
          display: "block",
          filter,
        }}
      />
    </span>
  );
}

/**
 * LogoWatermark — extra-large, low-opacity logo for editorial
 * watermark backgrounds. Always rendered as a soft white silhouette
 * (since these only appear inside dark sections).
 */
export function LogoWatermark({
  size = 720,
  opacity = 0.04,
  className = "",
}: { size?: number; opacity?: number; className?: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none select-none absolute ${className}`}
      style={{ width: size, height: size, opacity }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={LOGO_URI}
        alt=""
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          filter: "brightness(0) invert(1)",
        }}
      />
    </span>
  );
}
