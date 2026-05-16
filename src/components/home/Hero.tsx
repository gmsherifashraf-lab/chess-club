"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { EASE_EMPHASIS } from "@/lib/motion";
import { useIsMobile } from "@/hooks/useMediaQuery";
import Logo from "@/components/brand/Logo";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/* Orchestrated entrance: one composed page-load, staggered, ease-out. */
const group: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.2 } },
};
const rise: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE_EMPHASIS } },
};

const STATS = [
  { value: "1991", ar: "سنة التأسيس", en: "Established" },
  { value: "180+", ar: "لاعبة نشطة", en: "Active players", accent: true },
  { value: "40+", ar: "بطولة وطنية", en: "National titles" },
  { value: "ISO", ar: "معتمد · 2018", en: "Certified · 2018" },
];

/* Engraved chess-piece glyphs that drift in the deep background. */
const PIECES = [
  { g: "♛", cls: "left-[6%] top-[24%] text-[22vw] sm:text-[14vw]", d: 0 },
  { g: "♞", cls: "right-[10%] bottom-[14%] text-[20vw] sm:text-[12vw]", d: 1.4 },
  { g: "♚", cls: "left-[44%] top-[8%] hidden text-[9vw] lg:block", d: 2.6 },
];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const isMobile = useIsMobile();
  // Phones skip scroll-linked + infinite background motion (battery,
  // jank); the one-shot entrance still plays.
  const lite = !!reduce || isMobile;
  const [videoOk, setVideoOk] = useState(true);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-9%"]);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const boardY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const overlayFade = useTransform(scrollYProgress, [0, 1], [1, 0.5]);

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-onyx-500 text-text-inverse"
      aria-label="Chess & Culture Club for Women, Sharjah"
    >
      {/* ── Background media ─────────────────────────────────────────── */}
      <motion.div
        aria-hidden
        style={{ scale: lite ? 1 : mediaScale }}
        className="absolute inset-0 -z-20"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_0%,#11201A_0%,#0A130F_55%,#070B09_100%)]" />
        {videoOk && (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onError={() => setVideoOk(false)}
            className="hero-bg-video absolute inset-0 h-full w-full object-cover opacity-[0.55]"
          >
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>
        )}
      </motion.div>

      {/* ── Animated chess identity: drifting engraved pieces ───────── */}
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        {PIECES.map((p, i) => (
          <motion.span
            key={i}
            className={cn(
              "absolute font-serif leading-none text-white/[0.045] select-none",
              p.cls,
            )}
            initial={{ opacity: 0 }}
            animate={
              lite
                ? { opacity: 1 }
                : { opacity: 1, y: [0, -22, 0], rotate: [0, 1.5, 0] }
            }
            transition={
              lite
                ? { duration: 0.6 }
                : {
                    opacity: { duration: 1.6, delay: 0.4 + p.d * 0.2 },
                    y: { duration: 16 + i * 4, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 20 + i * 5, repeat: Infinity, ease: "easeInOut" },
                  }
            }
          >
            {p.g}
          </motion.span>
        ))}
      </div>

      {/* ── Animated chessboard identity panel (trailing side) ──────── */}
      <motion.div
        aria-hidden
        style={{ y: lite ? 0 : boardY }}
        className="absolute end-0 top-1/2 -z-10 hidden h-[clamp(28rem,46vw,44rem)] w-[clamp(28rem,46vw,44rem)] -translate-y-1/2 translate-x-[18%] [mask-image:radial-gradient(circle_at_60%_50%,#000_30%,transparent_72%)] md:block"
      >
        <motion.div
          className="grid h-full w-full grid-cols-8 grid-rows-8 rotate-[14deg]"
          variants={{ show: { transition: { staggerChildren: 0.018 } } }}
          initial="hidden"
          animate="show"
        >
          {Array.from({ length: 64 }).map((_, idx) => {
            const row = Math.floor(idx / 8);
            const col = idx % 8;
            const dark = (row + col) % 2 === 0;
            return (
              <motion.span
                key={idx}
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: dark ? 0.5 : 0.14,
                    transition: { duration: reduce ? 0 : 0.5, ease: EASE_EMPHASIS },
                  },
                }}
                className={cn(
                  "border-[0.5px] border-white/[0.04]",
                  dark ? "bg-forest-700/30" : "bg-white/[0.03]",
                )}
              />
            );
          })}
        </motion.div>
      </motion.div>

      {/* ── Overlay system: green-black wash, left-bias, vignette ───── */}
      <motion.div
        aria-hidden
        style={{ opacity: lite ? 1 : overlayFade }}
        className="absolute inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(7,12,9,0.94)_0%,rgba(8,19,14,0.74)_44%,rgba(8,19,14,0.40)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,11,9,0.55)_0%,transparent_30%,transparent_52%,rgba(7,11,9,0.88)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_72%_60%_at_46%_50%,transparent_52%,rgba(5,8,6,0.6)_100%)]" />
      </motion.div>

      {/* UAE flag hairline, pinned to the very top */}
      <div className="absolute inset-x-0 top-0 z-10 h-[3px] bg-[linear-gradient(90deg,#C8102E_33.3%,#fff_33.3%_66.6%,#117A4F_66.6%)]" />

      {/* ── Content ──────────────────────────────────────────────────── */}
      <motion.div
        style={{ y: lite ? 0 : contentY }}
        className="relative z-10 mx-auto w-full max-w-wrap px-5 pb-24 pt-32 sm:px-8 sm:pb-32 sm:pt-40 lg:px-10"
      >
        <motion.div
          variants={group}
          initial="hidden"
          animate="show"
          className="max-w-4xl"
        >
          {/* Official seal + institutional dateline */}
          <motion.div
            variants={rise}
            className="mb-8 flex items-center gap-4"
          >
            <Logo size={46} tone="white" />
            <span className="h-9 w-px bg-white/20" />
            <span className="flex items-center gap-3 text-eyebrow font-semibold uppercase text-text-inverse/85">
              <span className="h-[2px] w-8 bg-scarlet-400" />
              <span className="ar">الشارقة، الإمارات · تأسس 1991</span>
              <span className="en">Sharjah, United Arab Emirates · Est. 1991</span>
            </span>
          </motion.div>

          {/* Club name */}
          <motion.h1
            variants={rise}
            className="font-disp t-hero text-white [text-wrap:balance]"
          >
            <span className="ar block">
              نادي الشطرنج والثقافة
              <span className="block text-forest-400">للفتيات بالشارقة</span>
            </span>
            <span className="en block">
              Chess &amp; Culture Club
              <span className="block text-forest-400">
                for Women, Sharjah
                <span className="text-scarlet-400">.</span>
              </span>
            </span>
          </motion.h1>

          {/* Official tagline */}
          <motion.p
            variants={rise}
            className="mt-8 max-w-2xl text-balance text-lg leading-relaxed text-text-inverse/80 sm:text-xl"
          >
            <span className="ar">
              مؤسسة رياضية وثقافية رائدة منذ 1991، تُطوّر بطلات الشطرنج
              وتُمكّن الفتيات من خلال الرياضة والثقافة والقيادة، وتمثّل دولة
              الإمارات في المحافل الإقليمية والدولية.
            </span>
            <span className="en">
              A leading sporting and cultural institution since 1991,
              developing chess champions and empowering women through sport,
              culture, and leadership, representing the UAE on the regional
              and international stage.
            </span>
          </motion.p>

          {/* Calls to action */}
          <motion.div
            variants={rise}
            className="mt-11 flex flex-col gap-3.5 sm:flex-row sm:items-center"
          >
            <Link
              href="/register"
              className={cn(buttonVariants({ variant: "primary", size: "lg" }))}
            >
              <span className="ar">طلب الانضمام</span>
              <span className="en">Apply to Join</span>
            </Link>
            <Link
              href="/about"
              className={cn(buttonVariants({ variant: "light", size: "lg" }))}
            >
              <span className="ar">عن النادي</span>
              <span className="en">About the Club</span>
            </Link>
          </motion.div>

          {/* Achievement highlights */}
          <motion.dl
            variants={rise}
            className="mt-16 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-[3px] border border-white/12 bg-white/[0.04] sm:grid-cols-4"
          >
            {STATS.map((s) => (
              <div
                key={s.en}
                className="bg-white/[0.02] px-5 py-6 backdrop-blur-[2px]"
              >
                <dt
                  className={cn(
                    "font-disp text-3xl font-bold leading-none tabular-nums sm:text-4xl",
                    s.accent ? "text-forest-400" : "text-white",
                  )}
                >
                  {s.value}
                </dt>
                <dd className="mt-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-text-inverse/60">
                  <span className="ar">{s.ar}</span>
                  <span className="en">{s.en}</span>
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>
      </motion.div>

      {/* ── Scroll indicator ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8, ease: EASE_EMPHASIS }}
        className="absolute inset-x-0 bottom-7 z-10 hidden justify-center sm:flex"
      >
        <div className="flex flex-col items-center gap-2.5">
          <span className="text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-text-inverse/55">
            <span className="ar">مرّر للأسفل</span>
            <span className="en">Scroll</span>
          </span>
          <span className="relative h-11 w-px overflow-hidden bg-white/20">
            <motion.span
              className="absolute inset-x-0 top-0 h-4 bg-forest-400"
              animate={reduce ? {} : { y: ["-100%", "280%"] }}
              transition={{
                duration: 1.9,
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 0.3,
              }}
            />
          </span>
        </div>
      </motion.div>
    </section>
  );
}
