"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  animate,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { EASE_EMPHASIS } from "@/lib/motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { cn } from "@/lib/utils";
import type { StatItem } from "@/lib/queries/home";

/* ── Animated counter ──────────────────────────────────────────────
   Counts up once on enter. Honours reduced motion (snaps to final).
   Supports prefix/suffix and grouped thousands. */
function CountUp({
  to,
  prefix = "",
  suffix = "",
  group = false,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  group?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();
  const mv = useMotionValue(0);
  const fmt = (n: number) =>
    prefix +
    (group ? Math.round(n).toLocaleString("en-US") : String(Math.round(n))) +
    suffix;
  const [text, setText] = useState(reduce ? fmt(to) : fmt(0));

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setText(fmt(to));
      return;
    }
    const controls = animate(mv, to, {
      duration: 2,
      ease: EASE_EMPHASIS,
      onUpdate: (v) => setText(fmt(v)),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, to, reduce]);

  return (
    <span ref={ref} className="tabular-nums">
      {text}
    </span>
  );
}

type Stat = {
  to: number;
  prefix?: string;
  suffix?: string;
  group?: boolean;
  ar: string;
  en: string;
  accent?: "green" | "red";
};

const STATS: Stat[] = [
  { to: 180, suffix: "+", ar: "لاعبة مسجّلة", en: "Registered players", accent: "green" },
  { to: 120, suffix: "+", ar: "ألقاب في البطولات", en: "Tournament wins" },
  { to: 40, suffix: "+", ar: "بطولة وطنية", en: "National championships" },
  { to: 90, suffix: "+", ar: "مشاركة دولية", en: "International appearances" },
  { to: 2150, group: true, ar: "أعلى تصنيف للاعبة", en: "Peak player rating", accent: "red" },
];

const grid: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};
const cell: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_EMPHASIS } },
};

export default function Stats({ items }: { items?: StatItem[] }) {
  const year = new Date().getFullYear();
  const DATA: StatItem[] = items && items.length ? items : STATS;

  return (
    <section className="relative overflow-hidden border-t border-line bg-cream-100">
      {/* Restrained brand ground so the subtle glass reads on light */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(10,82,52,0.05)_0%,transparent_60%),radial-gradient(ellipse_50%_60%_at_100%_100%,rgba(200,16,46,0.035)_0%,transparent_70%)]"
      />

      <div className="relative mx-auto max-w-wrap px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionTitle
            eyebrowAr="سجلّ مؤسسي"
            eyebrowEn="Institutional Record"
            titleAr="النادي في أرقام"
            titleEn="The Club in Numbers"
            size="h2"
          />
          <p className="max-w-xs text-sm leading-relaxed text-text-3 sm:text-end">
            <span className="ar">
              منذ تأسيسه عام 1991 بمرسوم من حكومة الشارقة.
            </span>
            <span className="en">
              Since its founding in 1991 by decree of the Sharjah government.
            </span>
          </p>
        </div>

        <motion.dl
          variants={grid}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-[4px] border border-line bg-line/60 sm:grid-cols-3 lg:grid-cols-5"
        >
          {DATA.map((s) => (
            <motion.div
              key={s.en}
              variants={cell}
              className="group relative bg-white/70 px-6 py-9 backdrop-blur-[3px] transition-colors duration-300 hover:bg-white sm:py-11"
            >
              <span
                aria-hidden
                className={cn(
                  "absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 transition-transform duration-500 ease-emphasis group-hover:scale-x-100 rtl:origin-right",
                  s.accent === "red"
                    ? "bg-scarlet-400"
                    : s.accent === "green"
                      ? "bg-forest-700"
                      : "bg-text-1/30",
                )}
              />
              <dt
                className={cn(
                  "font-disp text-[2.75rem] font-bold leading-none sm:text-[3.5rem] lg:text-[3.75rem]",
                  s.accent === "red"
                    ? "text-scarlet-500"
                    : s.accent === "green"
                      ? "text-forest-700"
                      : "text-text-1",
                )}
              >
                <CountUp
                  to={s.to}
                  prefix={s.prefix ?? undefined}
                  suffix={s.suffix ?? undefined}
                  group={s.group}
                />
              </dt>
              <dd className="mt-4 text-[0.8rem] font-semibold uppercase leading-snug tracking-[0.14em] text-text-3">
                <span className="ar">{s.ar}</span>
                <span className="en">{s.en}</span>
              </dd>
            </motion.div>
          ))}
        </motion.dl>

        {/* Institutional attribution — annual-report register */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.25, ease: EASE_EMPHASIS }}
          className="mt-12 flex flex-wrap items-baseline justify-between gap-3 border-t border-line pt-6 text-[0.72rem] text-text-4"
        >
          <span className="font-semibold uppercase tracking-[0.18em]">
            <span className="ar">إحصاءات معتمدة · {year}</span>
            <span className="en">Verified figures · {year}</span>
          </span>
          <span className="opacity-80">
            <span className="ar">المصدر: المراجعة السنوية للنادي</span>
            <span className="en">Source: Club annual review</span>
          </span>
        </motion.div>
      </div>
    </section>
  );
}
