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
  /** Tailwind classes appended to the wrapper. */
  className?: string;
}

/**
 * Logo
 *
 * Single source of truth for the club mark across navbar, hero,
 * footer, loading screens, and watermark backgrounds.
 *
 * The actual asset lives in `src/lib/logo.ts` as a base64 URI; this
 * component just dresses it with the chrome the brief asks for —
 * sizing, halo glow, animated reveal, and an optional ring.
 */
export default function Logo({
  size = 56,
  glow = false,
  animate = false,
  ring = false,
  className = "",
}: Props) {
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
            background: "linear-gradient(135deg, rgba(31,107,79,0.35) 0%, rgba(200,16,46,0.25) 100%)",
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
        }}
      />
    </span>
  );
}

/**
 * LogoWatermark — extra-large, low-opacity logo used as a background
 * watermark inside dark editorial sections.
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
        style={{ width: "100%", height: "100%", objectFit: "contain", filter: "grayscale(100%) brightness(2)" }}
      />
    </span>
  );
}
