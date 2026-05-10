"use client";

import { motion } from "framer-motion";
import Reveal from "@/components/motion/Reveal";
import { EASE_EMPHASIS } from "@/lib/motion";

interface Partner {
  ar:  string;
  en:  string;
  type: "government" | "sports" | "cultural" | "education";
  since?: string;
}

const PARTNERS: Partner[] = [
  { ar: "حكومة الشارقة",                    en: "Sharjah Government",            type: "government", since: "1991" },
  { ar: "هيئة الشارقة للرياضة",              en: "Sharjah Sports Council",        type: "sports",     since: "1992" },
  { ar: "اتحاد الإمارات للشطرنج",           en: "UAE Chess Federation",          type: "sports",     since: "1992" },
  { ar: "الهيئة العامة للرياضة",            en: "General Authority of Sport",    type: "sports",     since: "2001" },
  { ar: "الاتحاد العربي للشطرنج",           en: "Arab Chess Federation",         type: "sports",     since: "2002" },
  { ar: "دائرة الثقافة بالشارقة",           en: "Sharjah Department of Culture", type: "cultural",   since: "1995" },
  { ar: "مجلس الشارقة للتعليم",             en: "Sharjah Education Council",     type: "education",  since: "2004" },
  { ar: "جامعة الشارقة",                    en: "University of Sharjah",         type: "education",  since: "2010" },
];

const CATEGORIES: { key: Partner["type"]; ar: string; en: string }[] = [
  { key: "government", ar: "الحكومة",         en: "Government" },
  { key: "sports",     ar: "الجهات الرياضية", en: "Sport"      },
  { key: "cultural",   ar: "الثقافة",         en: "Culture"    },
  { key: "education",  ar: "التعليم",         en: "Education"  },
];

export default function Partners() {
  return (
    <section className="relative bg-white overflow-hidden">
      <div aria-hidden className="absolute inset-0 grain-emerald pointer-events-none" />

      <div className="relative max-w-wrap mx-auto px-4 sm:px-6 lg:px-10 py-20 sm:py-22">
        {/* Header — quieter */}
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-14 sm:mb-16 items-end">
            <div className="lg:col-span-7">
              <div className="text-[0.6rem] uppercase tracking-[0.32em] text-ink3 font-bold mb-5 flex items-center gap-3">
                <span className="block w-7 h-px bg-ink3" />
                <span className="ar">الشركاء</span>
                <span className="en">Institutional partners</span>
              </div>
              <h2 className="font-disp text-[clamp(2.4rem,5vw,4rem)] text-ink leading-[1.06] tracking-tight max-w-3xl">
                <span className="ar">من نعمل معهم منذ التسعينيات.</span>
                <span className="en">Who we&rsquo;ve worked with since the 1990s.</span>
              </h2>
            </div>
            <div className="lg:col-span-5 lg:pb-2">
              <p className="text-[0.95rem] sm:text-[1.05rem] leading-[1.85] text-ink2 max-w-md">
                <span className="ar">
                  جهات حكومية ورياضية وثقافية وتعليمية في إمارة الشارقة وعلى مستوى الدولة، نتعاون معها على البرامج، الفعاليات، وتمثيل الإمارات.
                </span>
                <span className="en">
                  Government, sporting, cultural and educational bodies — in
                  Sharjah and across the country — that we collaborate with on
                  programmes, events, and international representation.
                </span>
              </p>
            </div>
          </div>
        </Reveal>

        {/* Partner table — single dense list, sectioned by category, no numbered indices */}
        <div className="border-t-2 border-ink/85">
          {CATEGORIES.map((cat) => {
            const partners = PARTNERS.filter((p) => p.type === cat.key);
            if (partners.length === 0) return null;

            return (
              <motion.div
                key={cat.key}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, ease: EASE_EMPHASIS }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-y-3 gap-x-8 lg:gap-x-12 py-7 sm:py-8 border-b border-stone"
              >
                <div className="lg:col-span-3">
                  <div className="text-[0.62rem] uppercase tracking-[0.32em] text-ink3 font-bold">
                    <span className="ar">{cat.ar}</span>
                    <span className="en">{cat.en}</span>
                  </div>
                </div>
                <ul className="lg:col-span-9 flex flex-col gap-3">
                  {partners.map((p, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: 12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.5, delay: i * 0.04, ease: EASE_EMPHASIS }}
                      className="group flex items-baseline justify-between gap-4 sm:gap-6 py-1"
                    >
                      <span className="font-disp text-[1.1rem] sm:text-[1.2rem] text-ink leading-snug transition-colors duration-280 group-hover:text-[#0B3D2E]">
                        <span className="ar">{p.ar}</span>
                        <span className="en">{p.en}</span>
                      </span>
                      {p.since && (
                        <span className="text-[0.7rem] uppercase tracking-[0.18em] text-ink3 font-semibold tabular-nums whitespace-nowrap pl-3 border-b border-stone/60 self-end pb-1">
                          <span className="ar">منذ {p.since}</span>
                          <span className="en">since {p.since}</span>
                        </span>
                      )}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
