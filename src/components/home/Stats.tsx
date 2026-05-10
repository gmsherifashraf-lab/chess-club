"use client";

import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { EASE_EMPHASIS } from "@/lib/motion";

const FOUNDED = 1991;
const YEARS   = new Date().getFullYear() - FOUNDED;

function CountUp({ to, suffix = "", className = "" }: { to: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const motionVal = useMotionValue(0);
  const rounded   = useTransform(motionVal, (v) => Math.round(v).toString() + suffix);
  const [text, setText] = useState("0" + suffix);

  useEffect(() => {
    const unsub = rounded.on("change", setText);
    return unsub;
  }, [rounded]);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(motionVal, to, {
      duration: 1.8,
      ease: EASE_EMPHASIS,
    });
    return () => controls.stop();
  }, [inView, motionVal, to]);

  return <span ref={ref} className={className}>{text}</span>;
}

const SUB_STATS: { ar: string; en: string; valueAr: string; valueEn: string }[] = [
  { ar: "لاعبة في برامج النادي", en: "active players across all programmes", valueAr: "180", valueEn: "180" },
  { ar: "مدرّبة معتمدة",          en: "certified coaches on staff",          valueAr: "12",  valueEn: "12"  },
  { ar: "اعتماد جودة",            en: "ISO 9001:2015 certified since 2018",  valueAr: "ISO", valueEn: "ISO" },
];

export default function Stats() {
  return (
    <section className="relative bg-white overflow-hidden border-t border-stone">
      <div aria-hidden className="absolute inset-0 grain-emerald pointer-events-none" />

      <div className="relative max-w-wrap mx-auto px-4 sm:px-6 lg:px-10 py-18 sm:py-22">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-end">
          {/* Mega editorial stat — no eyebrow at all. The number IS the heading. */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.85, ease: EASE_EMPHASIS }}
            className="lg:col-span-6 relative"
          >
            <div className="relative leading-none">
              <span className="mega-num">
                <CountUp to={YEARS} />
              </span>
            </div>

            <div className="mt-3 text-[0.62rem] uppercase tracking-[0.32em] text-ink2 font-bold">
              <span className="ar">سنوات منذ التأسيس · 1991—{new Date().getFullYear()}</span>
              <span className="en">years since founding · 1991—{new Date().getFullYear()}</span>
            </div>

            <p className="mt-8 text-[0.95rem] sm:text-base leading-[1.8] text-ink2 max-w-md">
              <span className="ar">
                تأسس النادي عام 1991 بمرسوم من حكومة الشارقة، وهو أحد أقدم الكيانات الرياضية النسائية المتخصصة في الإمارات.
              </span>
              <span className="en">
                Founded in 1991 by decree of the Sharjah government, the club is among the oldest dedicated women&rsquo;s sporting institutions in the United Arab Emirates.
              </span>
            </p>
          </motion.div>

          {/* Sub-stat ladder — value + sentence-cased label, no accent rules */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } } }}
            className="lg:col-span-6 lg:pb-2 flex flex-col"
          >
            {SUB_STATS.map((s, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden:  { opacity: 0, y: 18 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE_EMPHASIS } },
                }}
                className="grid grid-cols-[auto_1fr] items-baseline gap-6 sm:gap-8 py-5 sm:py-6 border-b border-stone first:border-t"
              >
                <div className="font-disp text-4xl sm:text-5xl leading-none font-bold text-ink min-w-[3.5rem] tabular-nums">
                  <span className="ar">{s.valueAr}</span>
                  <span className="en">{s.valueEn}</span>
                </div>
                <div className="text-[0.92rem] sm:text-base text-ink2 leading-snug pt-1">
                  <span className="ar">{s.ar}</span>
                  <span className="en">{s.en}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Footer: institutional attribution — feels like a real annual report */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE_EMPHASIS }}
          className="mt-14 sm:mt-16 pt-6 border-t border-stone flex flex-wrap items-baseline justify-between gap-3 text-[0.7rem] text-ink3"
        >
          <span className="tracking-[0.18em] uppercase font-semibold">
            <span className="ar">إحصاءات يناير 2025</span>
            <span className="en">Figures as of January 2025</span>
          </span>
          <span className="italic opacity-70">
            <span className="ar">المصدر: التقرير السنوي للنادي</span>
            <span className="en">Source: Club annual review, 2024</span>
          </span>
        </motion.div>
      </div>
    </section>
  );
}
