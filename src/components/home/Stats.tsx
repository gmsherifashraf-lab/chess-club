"use client";

import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const FOUNDED = 1991;
const YEARS   = new Date().getFullYear() - FOUNDED;

interface Stat {
  target:  number | null;
  display: string;
  ar:      string;
  en:      string;
  accent:  "emerald" | "scarlet" | "ink";
}

const STATS: Stat[] = [
  { target: YEARS, display: `${YEARS}+`, ar: "سنة من العطاء", en: "Years of Legacy",  accent: "scarlet" },
  { target: 180,   display: "180+",      ar: "لاعبة نشطة",     en: "Active Players",   accent: "emerald" },
  { target: null,  display: "ISO",       ar: "شهادة الجودة",   en: "Quality Certified",accent: "ink"     },
  { target: 12,    display: "12",        ar: "مدرّبة معتمدة",   en: "Certified Coaches",accent: "emerald" },
];

const accentMap = { emerald: "#0B3D2E", scarlet: "#C8102E", ink: "#141414" } as const;

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
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
      duration: 1.6,
      ease: [0.2, 0.8, 0.2, 1],
    });
    return () => controls.stop();
  }, [inView, motionVal, to]);

  return <span ref={ref}>{text}</span>;
}

export default function Stats() {
  return (
    <section className="relative bg-white border-y border-stone">
      <div className="relative max-w-wrap mx-auto px-4 sm:px-6 lg:px-10 py-20 sm:py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
        >
          {STATS.map((s, i) => (
            <motion.div
              key={i}
              variants={{
                hidden:  { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
              }}
              className="group relative text-center py-5"
            >
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-[2px] opacity-90 group-hover:w-24 transition-all duration-500"
                style={{ background: accentMap[s.accent] }}
              />
              <div className="font-disp text-5xl sm:text-6xl text-ink font-bold mb-3 leading-none">
                {s.target == null
                  ? <span style={{ color: accentMap[s.accent] }}>{s.display}</span>
                  : <CountUp to={s.target} suffix={s.display.includes("+") ? "+" : ""} />}
              </div>
              <div className="text-[0.62rem] sm:text-[0.7rem] uppercase tracking-[0.24em] text-ink3 font-semibold">
                <span className="ar">{s.ar}</span>
                <span className="en">{s.en}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
