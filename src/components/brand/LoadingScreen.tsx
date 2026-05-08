"use client";

import Logo from "@/components/brand/Logo";

/**
 * LoadingScreen — premium full-bleed dark splash with the club emblem.
 *
 * Used by:
 *  - src/app/loading.tsx (Next.js automatic route loading state)
 *  - any future <Suspense fallback={<LoadingScreen />}>
 *
 * Pure CSS animations (no framer-motion) so it works as a SSR
 * fallback without hydration. Respects prefers-reduced-motion.
 */
export default function LoadingScreen({ small = false }: { small?: boolean }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`${small ? "" : "fixed inset-0 z-[200]"} flex items-center justify-center lux-dark lux-tex overflow-hidden`}
      style={small ? { minHeight: 320 } : undefined}
    >
      {/* UAE flag accent */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-[#C8102E] via-white to-[#1F6B4F] opacity-80" />

      {/* Ambient glows */}
      <div
        aria-hidden
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full blur-3xl opacity-30 animate-glow-pulse"
        style={{ background: "radial-gradient(circle, #1F6B4F 0%, transparent 65%)" }}
      />
      <div
        aria-hidden
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-3xl opacity-15"
        style={{ background: "radial-gradient(circle, #C8102E 0%, transparent 70%)" }}
      />

      {/* Center stack */}
      <div className="relative flex flex-col items-center gap-6">
        <Logo size={small ? 80 : 120} glow ring animate />

        {/* Wordmark */}
        <div className="text-center loading-fade">
          <div className="font-disp text-white text-lg sm:text-xl font-semibold tracking-tight leading-tight">
            <span className="ar">نادي الشطرنج والثقافة للفتيات</span>
            <span className="en">Chess &amp; Culture Club for Women</span>
          </div>
          <div className="mt-2 text-[0.6rem] uppercase tracking-[0.32em] text-[#1F6B4F] font-bold">
            <span className="ar">الشارقة • تأسس 1991</span>
            <span className="en">Sharjah · Est. 1991</span>
          </div>
        </div>

        {/* Loading bar */}
        <div className="loading-bar w-44 h-px bg-white/10 overflow-hidden mt-2">
          <span className="loading-bar-track block w-1/3 h-full bg-gradient-to-r from-transparent via-[#1F6B4F] to-transparent" />
        </div>
      </div>
    </div>
  );
}
