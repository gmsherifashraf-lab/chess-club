"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Reveal from "@/components/motion/Reveal";
import { EASE_EMPHASIS } from "@/lib/motion";

interface Program {
  ageAr:  string;
  ageEn:  string;
  ar:     string;
  en:     string;
  arDsc:  string;
  enDsc:  string;
  bullets: { ar: string; en: string }[];
  accent: "emerald" | "scarlet";
  glyph:  string;
  step:   string;
}

const PROGRAMS: Program[] = [
  {
    ageAr: "5–7 سنوات",
    ageEn: "Ages 5–7",
    ar:    "الملكات الصغيرات",
    en:    "Little Queens",
    arDsc: "البرنامج التأسيسي لتعريف الصغيرات بالشطرنج من خلال اللعب التفاعلي والقصص.",
    enDsc: "An introductory programme for our youngest girls — learning chess through play and storytelling.",
    bullets: [
      { ar: "تعلم القطع وحركاتها", en: "Pieces & basic moves"      },
      { ar: "ألعاب ومسابقات",      en: "Games & mini-tournaments"  },
      { ar: "تنمية مهارات التفكير",en: "Cognitive skill building"  },
    ],
    accent: "emerald",
    glyph:  "♟",
    step:   "I",
  },
  {
    ageAr: "8–12 سنة",
    ageEn: "Ages 8–12",
    ar:    "النجوم الصاعدات",
    en:    "Rising Stars",
    arDsc: "تطوير الفهم التكتيكي والاستراتيجي للاعبات في مرحلة عمرية حاسمة.",
    enDsc: "Building tactical and strategic understanding during a formative age range.",
    bullets: [
      { ar: "التكتيكات والمواضيع", en: "Tactics & themes"     },
      { ar: "افتتاحيات مدروسة",     en: "Curated openings"    },
      { ar: "بطولات داخلية",        en: "Internal tournaments"},
    ],
    accent: "emerald",
    glyph:  "♞",
    step:   "II",
  },
  {
    ageAr: "13–16 سنة",
    ageEn: "Ages 13–16",
    ar:    "الجيل التنافسي",
    en:    "Competitive Juniors",
    arDsc: "إعداد اللاعبات للمشاركة الفعّالة في البطولات المحلية والإقليمية.",
    enDsc: "Preparing players for active participation in local and regional tournaments.",
    bullets: [
      { ar: "تدريب البطولات",        en: "Tournament training" },
      { ar: "تحليل المباريات",       en: "Game analysis"       },
      { ar: "إعداد بدني وذهني",      en: "Mental conditioning" },
    ],
    accent: "emerald",
    glyph:  "♝",
    step:   "III",
  },
  {
    ageAr: "17 سنة فأكثر",
    ageEn: "Ages 17+",
    ar:    "فريق النخبة",
    en:    "Elite Squad",
    arDsc: "البرنامج الأرفع للاعبات المتقدمات الممثلات للنادي على المستوى الوطني والدولي.",
    enDsc: "The club&rsquo;s top tier — for advanced players representing the club nationally and internationally.",
    bullets: [
      { ar: "تدريب فردي مكثّف",       en: "Intensive 1-on-1 coaching" },
      { ar: "تمثيل دولي",              en: "International representation" },
      { ar: "إعداد لتصنيف FIDE",       en: "FIDE rating preparation" },
    ],
    accent: "scarlet",
    glyph:  "♛",
    step:   "IV",
  },
];

export default function TrainingPrograms() {
  return (
    <section className="relative bg-white overflow-hidden">
      {/* Subtle background grid */}
      <div aria-hidden className="absolute inset-0 grain-emerald pointer-events-none" />

      <div className="relative max-w-wrap mx-auto px-4 sm:px-6 lg:px-10 py-24 sm:py-28">
        {/* Header — quieter, calmer */}
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 sm:mb-20 items-end">
            <div className="lg:col-span-7">
              <div className="text-[0.6rem] uppercase tracking-[0.32em] text-ink3 font-bold mb-5 flex items-center gap-3">
                <span className="block w-7 h-px bg-ink3" />
                <span className="ar">برامج التدريب</span>
                <span className="en">Training programmes</span>
              </div>
              <h2 className="font-disp text-[clamp(2.4rem,5vw,4rem)] text-ink leading-[1.06] tracking-tight">
                <span className="ar">أربع مراحل، من السابعة إلى التمثيل الدولي.</span>
                <span className="en">Four stages, from age seven to international play.</span>
              </h2>
            </div>
            <div className="lg:col-span-5 lg:pb-2">
              <p className="text-[0.95rem] sm:text-[1.05rem] leading-[1.85] text-ink2 max-w-md">
                <span className="ar">
                  جلسات أسبوعية يقودها مدربات معتمدات، مدعومة ببطولات داخلية ومنهج معدّ على مدار السنة.
                </span>
                <span className="en">
                  Weekly sessions led by certified women coaches, supported by
                  internal tournaments and a year-round curriculum.
                </span>
              </p>
            </div>
          </div>
        </Reveal>

        {/* Programme list — table-style editorial. Each row: age + name + description + bullets */}
        <div className="border-t-2 border-ink/85">
          {PROGRAMS.map((p, i) => {
            const isEmerald = p.accent === "emerald";
            const color = isEmerald ? "#0B3D2E" : "#C8102E";

            return (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, ease: EASE_EMPHASIS, delay: i * 0.04 }}
                className="group relative grid grid-cols-1 lg:grid-cols-12 gap-y-5 gap-x-8 lg:gap-x-12 py-9 sm:py-12 border-b border-stone transition-colors duration-280 ease-standard hover:bg-ivory2/40"
              >
                {/* Stage marker — left rail, single quiet number */}
                <div className="lg:col-span-2 flex lg:flex-col items-baseline lg:items-start gap-4 lg:gap-3">
                  <span
                    className="font-disp text-2xl sm:text-3xl font-bold leading-none tabular-nums"
                    style={{ color }}
                  >
                    {p.step}
                  </span>
                  <span className="text-[0.62rem] uppercase tracking-[0.22em] text-ink3 font-bold">
                    <span className="ar">{p.ageAr}</span>
                    <span className="en">{p.ageEn}</span>
                  </span>
                </div>

                {/* Title + description */}
                <div className="lg:col-span-6">
                  <h3 className="font-disp text-[clamp(1.6rem,2.4vw,2rem)] text-ink leading-[1.18] tracking-tight mb-3">
                    <span className="ar">{p.ar}</span>
                    <span className="en">{p.en}</span>
                  </h3>
                  <p className="text-[0.95rem] sm:text-[1rem] leading-[1.85] text-ink2 max-w-[58ch]">
                    <span className="ar">{p.arDsc}</span>
                    <span className="en" dangerouslySetInnerHTML={{ __html: p.enDsc }} />
                  </p>
                </div>

                {/* Curriculum bullets — sparse, no dots */}
                <ul className="lg:col-span-4 flex flex-col gap-2.5 lg:pl-6 lg:border-l lg:border-stone">
                  <li className="text-[0.6rem] uppercase tracking-[0.22em] text-ink3 font-bold mb-1">
                    <span className="ar">المنهج</span>
                    <span className="en">Curriculum</span>
                  </li>
                  {p.bullets.map((b, j) => (
                    <li key={j} className="text-[0.92rem] text-ink2 leading-[1.65] flex items-start gap-2.5">
                      <span className="text-ink3/60 select-none">—</span>
                      <span>
                        <span className="ar">{b.ar}</span>
                        <span className="en">{b.en}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.article>
            );
          })}
        </div>

        {/* CTA — quiet, single line */}
        <Reveal delay={0.1}>
          <div className="mt-14 sm:mt-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <p className="text-[0.95rem] text-ink2 max-w-md">
              <span className="ar">
                التسجيل مفتوح للموسم الجديد. الأماكن محدودة في كل فئة عمرية.
              </span>
              <span className="en">
                Registration is open for the new season. Places are limited in
                each age group.
              </span>
            </p>
            <Link href="/register" className="ds-btn ds-btn-primary">
              <span className="ar">طلب الانضمام</span>
              <span className="en">Apply to join</span>
              <span aria-hidden>→</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
