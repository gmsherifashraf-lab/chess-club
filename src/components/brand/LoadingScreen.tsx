"use client";

import Logo from "@/components/brand/Logo";

/**
 * LoadingScreen — federation dark splash with the club emblem.
 *
 * Used by src/app/loading.tsx (Next.js route loading) and any
 * <Suspense fallback>. Pure CSS animation (no framer-motion) so it is
 * SSR-safe. No glow (brand rule); honours prefers-reduced-motion via
 * the loading-bar / loading-fade rules in globals.css.
 */
export default function LoadingScreen({ small = false }: { small?: boolean }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`${
        small ? "" : "fixed inset-0 z-[200]"
      } flex items-center justify-center overflow-hidden bg-[linear-gradient(170deg,#0C1310_0%,#0A1F16_55%,#070B09_100%)]`}
      style={small ? { minHeight: 320 } : undefined}
    >
      {/* UAE flag hairline */}
      <div className="absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,#C8102E_33.3%,#fff_33.3%_66.6%,#117A4F_66.6%)]" />
      <div aria-hidden className="chess-tex-lt absolute inset-0 opacity-[0.16]" />

      <div className="relative flex flex-col items-center gap-6">
        <Logo size={small ? 88 : 120} surface="dark" animate priority />

        <div className="loading-fade text-center">
          <div className="font-ar text-base font-bold text-white sm:text-lg">
            نادي الشطرنج والثقافة للفتيات بالشارقة
          </div>
          <div className="mt-1 font-body text-[0.8rem] font-semibold text-white/80">
            Chess &amp; Culture Club for Sharjah Women
          </div>
          <div className="mt-3 text-[0.6rem] font-bold uppercase tracking-[0.3em] text-forest-400">
            <span className="ar">الشارقة · تأسس 1991</span>
            <span className="en">Sharjah · Est. 1991</span>
          </div>
        </div>

        <div className="loading-bar mt-2 h-px w-44 overflow-hidden bg-white/12">
          <span className="loading-bar-track block h-full w-1/3 bg-gradient-to-r from-transparent via-forest-400 to-transparent" />
        </div>
      </div>
    </div>
  );
}
