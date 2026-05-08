"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Reveal from "@/components/motion/Reveal";

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
  },
];

export default function TrainingPrograms() {
  return (
    <section className="relative lux-dark lux-tex lux-section">
      <div
        aria-hidden
        className="absolute -top-40 right-1/4 w-[520px] h-[520px] rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #1F6B4F 0%, transparent 65%)" }}
      />

      <div className="relative max-w-wrap mx-auto px-4 sm:px-6 lg:px-10 section-pad">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
            <span className="eyebrow-lux mb-5">
              <span className="dot" />
              <span className="ar">برامج التدريب</span>
              <span className="en">Training Programs</span>
            </span>
            <h2 className="font-disp t-mega text-white mb-6 mt-6">
              <span className="ar">من النقلة الأولى إلى المنصة الدولية.</span>
              <span className="en">From first move to international stage.</span>
            </h2>
            <div className="h-[2px] w-32 mx-auto bg-gradient-to-r from-[#1F6B4F] via-white to-[#C8102E]" />
          </div>
        </Reveal>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6 mb-14"
        >
          {PROGRAMS.map((p, i) => {
            const isEmerald = p.accent === "emerald";
            const accentColor = isEmerald ? "#1F6B4F" : "#C8102E";
            return (
              <motion.article
                key={i}
                variants={{
                  hidden:  { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] } },
                }}
                whileHover={{ y: -6 }}
                className="group relative bg-white/[0.03] border border-white/10 backdrop-blur p-7 sm:p-9 overflow-hidden transition-colors duration-500 hover:bg-white/[0.05]"
              >
                <div aria-hidden className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: accentColor }} />
                <div
                  aria-hidden
                  className="absolute -bottom-10 -right-10 text-[14rem] font-disp opacity-[0.05] leading-none select-none transition-opacity duration-500 group-hover:opacity-[0.1]"
                  style={{ color: accentColor }}
                >
                  {p.glyph}
                </div>

                <div className="relative">
                  <div className="flex items-baseline justify-between gap-4 mb-4 flex-wrap">
                    <div>
                      <div className="text-[0.6rem] uppercase tracking-[0.28em] font-bold mb-2" style={{ color: accentColor }}>
                        <span className="ar">{p.ageAr}</span>
                        <span className="en">{p.ageEn}</span>
                      </div>
                      <h3 className="font-disp text-2xl sm:text-3xl text-white leading-tight">
                        <span className="ar">{p.ar}</span>
                        <span className="en">{p.en}</span>
                      </h3>
                    </div>
                  </div>

                  <p className="text-[0.92rem] leading-[1.85] text-white/65 mb-6">
                    <span className="ar">{p.arDsc}</span>
                    <span className="en" dangerouslySetInnerHTML={{ __html: p.enDsc }} />
                  </p>

                  <ul className="space-y-2.5 pt-4 border-t border-white/10">
                    {p.bullets.map((b, j) => (
                      <li key={j} className="flex items-start gap-3 text-[0.88rem] text-white/75">
                        <span className="mt-1.5 block w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: accentColor }} />
                        <span>
                          <span className="ar">{b.ar}</span>
                          <span className="en">{b.en}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.article>
            );
          })}
        </motion.div>

        <Reveal delay={0.2} className="text-center">
          <Link href="/register" className="btn-emerald">
            <span className="ar">انضمي إلى النادي ←</span>
            <span className="en">Join the Club →</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
