"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Logo from "@/components/brand/Logo";

const PIECES: { glyph: string; top: string; left?: string; right?: string; size: number; delay: number; opacity: number }[] = [
  { glyph: "♚", top: "12%", left: "6%",  size: 100, delay: 0.10, opacity: 0.07 },
  { glyph: "♛", top: "18%", right: "5%", size: 140, delay: 0.18, opacity: 0.08 },
  { glyph: "♞", top: "62%", left: "4%",  size: 120, delay: 0.26, opacity: 0.07 },
  { glyph: "♝", top: "70%", right: "8%", size: 104, delay: 0.34, opacity: 0.08 },
  { glyph: "♜", top: "42%", right: "32%",size: 70,  delay: 0.42, opacity: 0.05 },
  { glyph: "♟", top: "32%", left: "28%", size: 56,  delay: 0.50, opacity: 0.05 },
];

const PARTICLE_COUNT = 36;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const headingY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const orbY     = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const piecesY  = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

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
      className="relative min-h-[100svh] flex items-center overflow-hidden hero-light"
    >
      {/* Soft chess texture */}
      <div className="chess-tex absolute inset-0 opacity-[0.55]" />

      {/* Layered radial glows (parallax) — emerald + scarlet on cream */}
      <motion.div
        aria-hidden
        style={{ y: orbY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div
          className="absolute -top-32 -right-40 w-[680px] h-[680px] rounded-full blur-3xl opacity-25 animate-drift"
          style={{ background: "radial-gradient(circle, #1F6B4F 0%, transparent 65%)" }}
        />
        <div
          className="absolute top-1/3 -left-48 w-[620px] h-[620px] rounded-full blur-3xl opacity-20 animate-drift"
          style={{ background: "radial-gradient(circle, #0B3D2E 0%, transparent 70%)", animationDelay: "-6s" }}
        />
        <div
          className="absolute -bottom-40 right-1/4 w-[560px] h-[560px] rounded-full blur-3xl opacity-15 animate-drift"
          style={{ background: "radial-gradient(circle, #C8102E 0%, transparent 70%)", animationDelay: "-12s" }}
        />
      </motion.div>

      {/* Floating chess pieces — dark green silhouettes on cream */}
      <motion.div aria-hidden style={{ y: piecesY }} className="absolute inset-0 pointer-events-none">
        {PIECES.map((p, i) => (
          <span
            key={i}
            className="float-piece"
            style={{
              top:    p.top,
              left:   p.left,
              right:  p.right,
              fontSize: p.size,
              color: "#0B3D2E",
              ["--p-opacity" as string]: p.opacity,
              animation: `piece-float 1.4s cubic-bezier(.2,.8,.2,1) ${p.delay}s forwards, piece-drift ${10 + i}s ease-in-out ${p.delay + 1.4}s infinite`,
            }}
          >
            {p.glyph}
          </span>
        ))}
      </motion.div>

      {/* Subtle particle field */}
      <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              left:  `${p.left}%`,
              top:   `${p.top}%`,
              width:  p.size,
              height: p.size,
              background: "#0B3D2E",
              opacity: 0,
              animation: `particle-flicker ${p.duration}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* MAIN CONTENT */}
      <motion.div
        style={{ y: headingY }}
        className="relative z-10 max-w-wrap mx-auto px-4 sm:px-6 lg:px-10 w-full pt-32 pb-28 sm:pt-40 sm:pb-32"
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
              <span className="eyebrow-light">
                <span className="dot-emerald" />
                <span className="ar">مؤسسة رسمية بالشارقة</span>
                <span className="en">Official UAE Institution</span>
              </span>
              <span className="text-[0.6rem] uppercase tracking-[0.28em] text-[#0B3D2E] font-bold">
                <span className="ar">تأسس 1991</span>
                <span className="en">Est. 1991</span>
              </span>
            </motion.div>

            {/* Logo + name */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center gap-5 mb-9"
            >
              <Logo size={92} glow animate />
              <div className="leading-tight">
                <div className="font-disp text-ink text-[1.05rem] sm:text-[1.2rem] tracking-tight">
                  <span className="ar">نادي الشطرنج والثقافة للفتيات</span>
                  <span className="en">Chess &amp; Culture Club</span>
                </div>
                <div className="text-[0.65rem] uppercase tracking-[0.28em] text-[#0B3D2E] font-bold mt-1.5">
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
              className="font-disp text-ink t-display mb-7"
            >
              <span className="ar block">
                حيث تصنع الفتاة <span className="text-[#0B3D2E]">قرارها</span>.
              </span>
              <span className="en block">
                Where every girl <span className="text-[#0B3D2E]">makes her move.</span>
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="origin-left h-[2px] w-44 bg-gradient-to-r from-[#1F6B4F] via-ink to-[#C8102E] mb-9"
            />

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.55 }}
              className="text-lg sm:text-xl leading-[1.85] text-ink2 max-w-2xl mb-12"
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

            {/* CTAs */}
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
              <Link href="/about" className="btn-outline-ink">
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
              <Metric value="34+" arLabel="سنة من العطاء" enLabel="Years of Legacy" />
              <Metric value="180+" arLabel="لاعبة"         enLabel="Active Players"  accent />
              <Metric value="ISO"  arLabel="معتمد جودة"    enLabel="ISO Certified" />
            </motion.div>
          </div>

          {/* Right column — emblem card */}
          <div className="hidden lg:flex lg:col-span-4 justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.1, delay: 0.4 }}
              className="relative"
            >
              <div className="relative bg-white border border-stone p-10 max-w-sm shadow-[0_24px_60px_-24px_rgba(11,61,46,0.35)]">
                <div
                  aria-hidden
                  className="absolute -top-px left-0 right-0 h-px"
                  style={{ background: "linear-gradient(90deg, transparent, #1F6B4F, transparent)" }}
                />
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#C8102E] via-white to-[#1F6B4F]" />
                <div className="flex items-center justify-center mb-6 mt-4">
                  <Logo size={172} glow animate />
                </div>
                <div className="text-center">
                  <div className="text-[0.6rem] uppercase tracking-[0.28em] text-[#0B3D2E] font-bold mb-3">
                    <span className="ar">الشعار الرسمي</span>
                    <span className="en">Official Emblem</span>
                  </div>
                  <div className="font-disp text-2xl text-ink leading-tight mb-3">
                    <span className="ar">منذ 1991</span>
                    <span className="en">Since 1991</span>
                  </div>
                  <div className="separator-emerald mb-3" />
                  <p className="text-[0.78rem] text-ink3 leading-relaxed">
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
        className="absolute bottom-24 inset-x-0 overflow-hidden text-ink3/30 text-[0.7rem] uppercase tracking-[0.32em] font-semibold pointer-events-none"
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
              <span className="w-1 h-1 rounded-full bg-[#1F6B4F]/50" />
            </span>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-ink3/55"
      >
        <span className="text-[0.55rem] uppercase tracking-[0.32em] font-semibold">
          <span className="ar">تابعي للأسفل</span>
          <span className="en">Scroll</span>
        </span>
        <span className="block w-px h-10 bg-gradient-to-b from-ink/55 to-transparent animate-pulse" />
      </motion.div>
    </section>
  );
}

function Metric({ value, arLabel, enLabel, accent = false }: { value: string; arLabel: string; enLabel: string; accent?: boolean }) {
  return (
    <div className="border-l-2 pl-4" style={{ borderColor: accent ? "#1F6B4F" : "rgba(20,20,20,0.18)" }}>
      <div className="font-disp text-3xl sm:text-4xl text-ink leading-none mb-2 font-bold">{value}</div>
      <div className="text-[0.6rem] uppercase tracking-[0.22em] text-ink3 font-semibold">
        <span className="ar">{arLabel}</span>
        <span className="en">{enLabel}</span>
      </div>
    </div>
  );
}
