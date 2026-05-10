"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import Logo from "@/components/brand/Logo";
import { EASE_EMPHASIS } from "@/lib/motion";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  // Single, restrained parallax — page contents drift up subtly on scroll.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);

  // Hide the video layer if the file fails to load (e.g. not uploaded yet),
  // so the existing light hero still renders perfectly.
  const [videoOk, setVideoOk] = useState(true);

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] flex items-center overflow-hidden hero-light"
    >
      {/* Background video — silent, looping, ~25% so the cream wash and
          text contrast stay intact. Hidden if file missing or if the user
          prefers reduced motion (see the CSS rule in globals.css). */}
      {videoOk && (
        <video
          aria-hidden
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onError={() => setVideoOk(false)}
          className="hero-bg-video absolute inset-0 w-full h-full object-cover opacity-[0.28] pointer-events-none"
        >
          <source src="/videos/hero.webm" type="video/webm" />
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
      )}

      {/* Cream wash on top of the video to keep the light-luxury palette */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(237,233,226,0.55) 0%, rgba(237,233,226,0.75) 60%, rgba(237,233,226,0.92) 100%)",
        }}
      />

      {/* Soft chess texture — single layer, very subtle */}
      <div aria-hidden className="chess-tex absolute inset-0 opacity-[0.45]" />

      {/* Two restrained ambient glows — no parallax, no drift animation */}
      <div
        aria-hidden
        className="absolute -top-40 -right-32 w-[600px] h-[600px] rounded-full blur-3xl opacity-[0.18] pointer-events-none"
        style={{ background: "radial-gradient(circle, #1F6B4F 0%, transparent 65%)" }}
      />
      <div
        aria-hidden
        className="absolute top-1/2 -left-48 w-[520px] h-[520px] rounded-full blur-3xl opacity-[0.12] pointer-events-none"
        style={{ background: "radial-gradient(circle, #0B3D2E 0%, transparent 70%)" }}
      />

      {/* MAIN CONTENT */}
      <motion.div
        style={{ y: contentY }}
        className="relative z-10 max-w-wrap mx-auto px-4 sm:px-6 lg:px-10 w-full pt-32 pb-24 sm:pt-36 sm:pb-28"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-end">
          {/* Text column */}
          <div className="lg:col-span-8">
            {/* Dateline only — branding lives in navbar + emblem panel */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.05, ease: EASE_EMPHASIS }}
              className="mb-9 lg:mb-12 text-[0.6rem] uppercase tracking-[0.32em] text-ink2 font-bold flex items-center gap-3"
            >
              <span className="block w-7 h-px bg-ink2" />
              <span className="ar">الشارقة، الإمارات · تأسس 1991</span>
              <span className="en">Sharjah, UAE · Est. 1991</span>
            </motion.div>

            {/* Mobile-only logo (right-side emblem hides under lg) */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12, ease: EASE_EMPHASIS }}
              className="lg:hidden mb-8"
            >
              <Logo size={64} glow animate />
            </motion.div>

            {/* Display heading */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.18, ease: EASE_EMPHASIS }}
              className="font-disp text-ink t-display mb-9"
            >
              <span className="ar block">
                نادٍ نسائي للشطرنج، في الشارقة.
              </span>
              <span className="en block">
                A women&rsquo;s chess club, in Sharjah.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.32, ease: EASE_EMPHASIS }}
              className="text-lg sm:text-xl leading-[1.8] text-ink2 max-w-2xl mb-12"
            >
              <span className="ar">
                مؤسسة رياضية وثقافية تعمل منذ 1991. نُدرّب لاعبات من سن السابعة، ونمثّل الإمارات في البطولات الإقليمية والدولية.
              </span>
              <span className="en">
                A sporting and cultural institution operating since 1991. We
                train players from age seven, and represent the UAE in
                regional and international competition.
              </span>
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45, ease: EASE_EMPHASIS }}
              className="flex flex-wrap gap-3 sm:gap-4 mb-14"
            >
              <Link href="/register" className="ds-btn ds-btn-primary ds-btn-lg">
                <span className="ar">طلب الانضمام</span>
                <span className="en">Apply to join</span>
                <span aria-hidden>→</span>
              </Link>
              <Link href="/about" className="ds-btn ds-btn-secondary ds-btn-lg">
                <span className="ar">عن المؤسسة</span>
                <span className="en">About the club</span>
              </Link>
            </motion.div>

            {/* Hero metrics strip */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.6, ease: EASE_EMPHASIS }}
              className="grid grid-cols-3 gap-5 sm:gap-10 max-w-2xl pt-7 border-t border-stone/70"
            >
              <Metric value="1991" arLabel="سنة التأسيس"            enLabel="founded" />
              <Metric value="180"  arLabel="لاعبة في برامج النادي"  enLabel="active players" accent />
              <Metric value="ISO"  arLabel="معتمد منذ 2018"          enLabel="certified, 2018" />
            </motion.div>
          </div>

          {/* Right column — quiet emblem panel */}
          <div className="hidden lg:flex lg:col-span-4 justify-end">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95, delay: 0.32, ease: EASE_EMPHASIS }}
              className="relative"
            >
              <div className="relative bg-white/85 backdrop-blur-sm border border-stone p-10 sm:p-11 max-w-xs shadow-card">
                <div className="flex items-center justify-center mb-7">
                  <Logo size={140} glow animate />
                </div>
                <div className="text-center pt-6 border-t border-stone/70">
                  <div className="font-disp text-[1.05rem] text-ink leading-tight">
                    <span className="ar">نادي الشطرنج والثقافة للفتيات</span>
                    <span className="en">Chess &amp; Culture Club for Women</span>
                  </div>
                  <div className="text-[0.62rem] uppercase tracking-[0.22em] text-ink3 mt-2.5 font-bold">
                    <span className="ar">الشارقة · تأسس 1991</span>
                    <span className="en">Sharjah · Est. 1991</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function Metric({ value, arLabel, enLabel, accent = false }: { value: string; arLabel: string; enLabel: string; accent?: boolean }) {
  return (
    <div className="border-l-2 pl-4" style={{ borderColor: accent ? "#1F6B4F" : "rgba(20,20,20,0.18)" }}>
      <div className="font-disp text-3xl sm:text-4xl text-ink leading-none mb-2 font-bold tabular-nums">{value}</div>
      <div className="text-[0.58rem] uppercase tracking-[0.22em] text-ink3 font-semibold leading-snug">
        <span className="ar">{arLabel}</span>
        <span className="en">{enLabel}</span>
      </div>
    </div>
  );
}
