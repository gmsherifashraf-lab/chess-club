"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Logo, { LogoWatermark } from "@/components/brand/Logo";

// Floating chess piece glyph layout — positioned in viewport units
// so it scales with the hero. Each piece floats subtly via CSS.
const PIECES: { glyph: string; top: string; left?: string; right?: string; size: number; delay: number; opacity: number }[] = [
  { glyph: "♚", top: "12%", left: "8%",  size: 88,  delay: 0.10, opacity: 0.10 },
  { glyph: "♛", top: "18%", right: "6%", size: 130, delay: 0.18, opacity: 0.13 },
  { glyph: "♞", top: "62%", left: "5%",  size: 110, delay: 0.26, opacity: 0.10 },
  { glyph: "♝", top: "70%", right: "10%",size: 96,  delay: 0.34, opacity: 0.11 },
  { glyph: "♜", top: "42%", right: "32%",size: 64,  delay: 0.42, opacity: 0.06 },
  { glyph: "♟", top: "32%", left: "28%", size: 52,  delay: 0.50, opacity: 0.06 },
];

const PARTICLE_COUNT = 56;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  // Parallax: the heading drifts up as the user scrolls past the hero.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const headingY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const orbY      = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const piecesY   = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  // Static, deterministic particle positions seeded from index so SSR
  // and client render identically.
  const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    left: ((i * 47) % 100),
    top:  ((i * 73) % 100),
    size: 1 + ((i * 13) % 3),
    delay: (i % 7) * 0.4,
    duration: 3 + ((i * 17) % 7),
  }));

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] flex items-center overflow-hidden lux-dark lux-tex"
    >
      {/* UAE-flag accent strip (kept thin and subtle) */}
      <div className="absolute top-0 left-0 right-0 h-[2px] z-10 bg-gradient-to-r from-[#C8102E] via-white to-[#1F6B4F] opacity-90" />

      {/* Layered radial glows (parallax) */}
      <motion.div
        aria-hidden
        style={{ y: orbY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div
          className="absolute -top-32 -right-40 w-[680px] h-[680px] rounded-full blur-3xl opacity-30 animate-drift"
          style={{ background: "radial-gradient(circle, #1F6B4F 0%, transparent 65%)" }}
        />
        <div
          className="absolute top-1/3 -left-48 w-[620px] h-[620px] rounded-full blur-3xl opacity-25 animate-drift"
          style={{ background: "radial-gradient(circle, #0B3D2E 0%, transparent 70%)", animationDelay: "-6s" }}
        />
        <div
          className="absolute -bottom-40 right-1/4 w-[560px] h-[560px] rounded-full blur-3xl opacity-20 animate-drift"
          style={{ background: "radial-gradient(circle, #C8102E 0%, transparent 70%)", animationDelay: "-12s" }}
        />
      </motion.div>

      {/* Logo watermark on the right edge — large, low-opacity */}
      <LogoWatermark
        size={720}
        opacity={0.05}
        className="hidden lg:block top-1/2 -translate-y-1/2 -right-40 rtl:left-0 rtl:right-auto rtl:-left-40"
      />

      {/* Floating chess pieces */}
      <motion.div aria-hidden style={{ y: piecesY }} className="absolute inset-0 pointer-events-none">
        {PIECES.map((p, i) => (
          <span
            key={i}
            className="float-piece text-white"
            style={{
              top:    p.top,
              left:   p.left,
              right:  p.right,
              fontSize: p.size,
              ["--p-opacity" as string]: p.opacity,
              animation: `piece-float 1.4s cubic-bezier(.2,.8,.2,1) ${p.delay}s forwards, piece-drift ${10 + i}s ease-in-out ${p.delay + 1.4}s infinite`,
            }}
          >
            {p.glyph}
          </span>
        ))}
      </motion.div>

      {/* Particle field */}
      <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left:  `${p.left}%`,
              top:   `${p.top}%`,
              width:  p.size,
              height: p.size,
              opacity: 0,
              animation: `particle-flicker ${p.duration}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* MAIN CONTENT */}
      <motion.div
        style={{ y: headingY }}
        className="relative z-10 max-w-wrap mx-auto px-4 sm:px-6 lg:px-10 w-full py-32 sm:py-40"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Text column */}
          <div className="lg:col-span-8">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="flex flex-wrap items-center gap-3 mb-8"
            >
              <span className="eyebrow-lux">
                <span className="dot" />
                <span className="ar">مؤسسة رسمية بالشارقة</span>
                <span className="en">Official UAE Institution</span>
              </span>
              <span className="text-[0.6rem] uppercase tracking-[0.28em] text-white/45 font-semibold">
                <span className="ar">تأسس 1991</span>
                <span className="en">Est. 1991</span>
              </span>
            </motion.div>

            {/* Logo + name (mobile / large block) */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center gap-5 mb-9"
            >
              <Logo size={92} glow animate tone="white" />
              <div className="leading-tight">
                <div className="font-disp text-white/90 text-[1.05rem] sm:text-[1.2rem] tracking-tight">
                  <span className="ar">نادي الشطرنج والثقافة للفتيات</span>
                  <span className="en">Chess &amp; Culture Club</span>
                </div>
                <div className="text-[0.65rem] uppercase tracking-[0.28em] text-[#1F6B4F] font-semibold mt-1.5">
                  <span className="ar">الشارقة • الإمارات</span>
                  <span className="en">Sharjah · UAE</span>
                </div>
              </div>
            </motion.div>

            {/* Cinematic display heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3 }}
              className="font-disp text-white t-display mb-7"
            >
              <span className="ar block">
                حيث تصنع الفتاة <span className="text-[#1F6B4F]">قرارها</span>.
              </span>
              <span className="en block">
                Where every girl <span className="text-[#1F6B4F]">makes her move.</span>
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="origin-left h-[2px] w-44 bg-gradient-to-r from-[#1F6B4F] via-white to-[#C8102E] mb-9"
            />

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.55 }}
              className="text-lg sm:text-xl leading-[1.85] text-white/75 max-w-2xl mb-12"
            >
              <span className="ar">
                مؤسسة رياضية وثقافية رائدة منذ عام 1991. نُخرّج بطلات يُمثّلن الإمارات
                على المنصات الدولية، ونبني جيلاً من القائدات في عاصمة الثقافة.
              </span>
              <span className="en">
                A leading sports &amp; cultural institution since 1991. We graduate
                champions who represent the UAE on international stages and shape
                a generation of women leaders in the cultural capital.
              </span>
            </motion.p>

            {/* CTAs — official-club wording, no "Academy" */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.7 }}
              className="flex flex-wrap gap-3 sm:gap-4 mb-14"
            >
              <Link href="/register" className="btn-emerald">
                <span className="ar">انضمي إلى النادي ←</span>
                <span className="en">Join the Club →</span>
              </Link>
              <Link href="/about" className="btn-ghost-red">
                <span className="ar">عن المؤسسة</span>
                <span className="en">Discover the Club</span>
              </Link>
            </motion.div>

            {/* Hero metrics strip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.85 }}
              className="grid grid-cols-3 gap-5 sm:gap-10 max-w-2xl"
            >
              <Metric value="34+" arLabel="سنة من العطاء"  enLabel="Years of Legacy" />
              <Metric value="180+" arLabel="لاعبة"          enLabel="Active Players"  accent />
              <Metric value="ISO"  arLabel="معتمد جودة"     enLabel="ISO Certified" />
            </motion.div>
          </div>

          {/* Right column — large logo + light card on desktop */}
          <div className="hidden lg:flex lg:col-span-4 justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.1, delay: 0.4 }}
              className="relative"
            >
              {/* Big card */}
              <div className="relative bg-white/[0.03] border border-white/10 backdrop-blur p-10 max-w-sm">
                <div
                  aria-hidden
                  className="absolute -top-px left-0 right-0 h-px"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(31,107,79,0.7), transparent)" }}
                />
                <div className="flex items-center justify-center mb-6">
                  <Logo size={172} glow animate ring tone="white" />
                </div>
                <div className="text-center">
                  <div className="text-[0.6rem] uppercase tracking-[0.28em] text-[#1F6B4F] font-bold mb-3">
                    <span className="ar">الشعار الرسمي</span>
                    <span className="en">Official Emblem</span>
                  </div>
                  <div className="font-disp text-2xl text-white leading-tight mb-3">
                    <span className="ar">منذ 1991</span>
                    <span className="en">Since 1991</span>
                  </div>
                  <div className="separator-emerald mb-3" />
                  <p className="text-[0.78rem] text-white/55 leading-relaxed">
                    <span className="ar">إرث ممتد عبر ثلاثة عقود من القيادة النسائية</span>
                    <span className="en">Three decades of women&rsquo;s leadership in chess</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Slow institutional word marquee */}
      <div
        aria-hidden
        className="absolute bottom-24 inset-x-0 overflow-hidden text-white/15 text-[0.7rem] uppercase tracking-[0.32em] font-semibold pointer-events-none"
      >
        <div className="hero-marquee py-2">
          {[
            "Excellence", "تميّز",
            "Leadership", "ريادة",
            "Heritage", "إرث",
            "Empowerment", "تمكين",
            "Sharjah · 1991",
            "Excellence", "تميّز",
            "Leadership", "ريادة",
            "Heritage", "إرث",
            "Empowerment", "تمكين",
            "Sharjah · 1991",
          ].map((w, i) => (
            <span key={i} className="inline-flex items-center gap-12">
              <span>{w}</span>
              <span className="w-1 h-1 rounded-full bg-[#1F6B4F]/60" />
            </span>
          ))}
        </div>
      </div>

      {/* Bottom scroll cue */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/45"
      >
        <span className="text-[0.55rem] uppercase tracking-[0.32em] font-semibold">
          <span className="ar">تابعي للأسفل</span>
          <span className="en">Scroll</span>
        </span>
        <span className="block w-px h-10 bg-gradient-to-b from-white/60 to-transparent animate-pulse" />
      </motion.div>
    </section>
  );
}

function Metric({ value, arLabel, enLabel, accent = false }: { value: string; arLabel: string; enLabel: string; accent?: boolean }) {
  return (
    <div className="border-l-2 pl-4" style={{ borderColor: accent ? "#1F6B4F" : "rgba(255,255,255,0.15)" }}>
      <div className="font-disp text-3xl sm:text-4xl text-white leading-none mb-2 font-bold">{value}</div>
      <div className="text-[0.6rem] uppercase tracking-[0.22em] text-white/50 font-semibold">
        <span className="ar">{arLabel}</span>
        <span className="en">{enLabel}</span>
      </div>
    </div>
  );
}
