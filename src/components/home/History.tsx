"use client";

import { motion } from "framer-motion";
import Reveal from "@/components/motion/Reveal";
import { EASE_EMPHASIS } from "@/lib/motion";

interface Milestone {
  year:  string;
  ar:    string;
  en:    string;
  arDsc: string;
  enDsc: string;
  accent: "emerald" | "scarlet" | "ink";
  glyph:  string;
}

const MILESTONES: Milestone[] = [
  {
    year:  "1991",
    ar:    "التأسيس",
    en:    "Foundation",
    arDsc: "تأسس النادي رسمياً ليكون أول كيان نسائي مخصص للشطرنج والثقافة في إمارة الشارقة.",
    enDsc: "The club is officially established as one of the first dedicated women&rsquo;s chess and cultural institutions in the Emirate of Sharjah.",
    accent: "scarlet",
    glyph:  "♟",
  },
  {
    year:  "2000s",
    ar:    "البنية الاحترافية",
    en:    "Professional Era",
    arDsc: "إطلاق برامج تدريبية احترافية وتأهيل أول جيل من المدربات الإماراتيات.",
    enDsc: "Launch of professional training programmes and the qualification of the first generation of Emirati women coaches.",
    accent: "emerald",
    glyph:  "♞",
  },
  {
    year:  "2010s",
    ar:    "التميّز الإقليمي",
    en:    "Regional Excellence",
    arDsc: "حصد الميداليات في البطولات الخليجية والعربية، وتمثيل الإمارات في المحافل الدولية.",
    enDsc: "Medal-winning performances at GCC and Arab championships, and international representation of the UAE.",
    accent: "ink",
    glyph:  "♝",
  },
  {
    year:  "2018",
    ar:    "اعتماد الجودة",
    en:    "ISO Certification",
    arDsc: "حصل النادي على شهادة الجودة العالمية ISO تتويجاً لمنظومته الإدارية الاحترافية.",
    enDsc: "The club is awarded international ISO quality certification, recognising its professional management framework.",
    accent: "emerald",
    glyph:  "♜",
  },
  {
    year:  "2025",
    ar:    "اليوم",
    en:    "Present day",
    arDsc: "نحو 180 لاعبة في برامج النادي، عبر أربع فئات عمرية، تدعمها منصّة رقمية لإدارة التدريب والتقييم.",
    enDsc: "Around 180 active players across four age groups, supported by a digital platform for training and assessment.",
    accent: "scarlet",
    glyph:  "♛",
  },
];

const accentColor = { emerald: "#0B3D2E", scarlet: "#C8102E", ink: "#141414" } as const;

export default function History() {
  return (
    <section className="relative bg-ivory2 overflow-hidden">
      <div aria-hidden className="chess-tex absolute inset-0 opacity-30" />
      <div aria-hidden className="absolute top-0 left-0 right-0 h-px bg-stone" />

      <div className="relative max-w-wrap mx-auto px-4 sm:px-6 lg:px-10 section-pad">
        {/* Header — opens with year-range stamp, no bilingual eyebrow */}
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-14 sm:mb-20 items-end">
            <div className="lg:col-span-7">
              <div className="font-disp text-[0.95rem] tracking-[0.18em] text-ink2 font-semibold tabular-nums mb-5">
                1991 — {new Date().getFullYear()}
              </div>
              <h2 className="font-disp text-[clamp(2.4rem,5vw,4rem)] text-ink leading-[1.06] tracking-tight">
                <span className="ar">المسيرة في خمس محطات.</span>
                <span className="en">The club, in five moments.</span>
              </h2>
            </div>
            <div className="lg:col-span-5 lg:pb-2">
              <p className="text-[0.95rem] sm:text-[1.05rem] leading-[1.85] text-ink2">
                <span className="ar">
                  من المرسوم التأسيسي، إلى أول جيل من المدربات الإماراتيات،
                  إلى تمثيل الدولة في المحافل الدولية.
                </span>
                <span className="en">
                  From the founding decree to the first generation of Emirati
                  women coaches, and on to international competition.
                </span>
              </p>
            </div>
          </div>
        </Reveal>

        {/* Timeline track — horizontal rail w/ a global hairline */}
        <div className="relative">
          {/* Connecting hairline (decorative) */}
          <div
            aria-hidden
            className="hidden md:block absolute left-0 right-0 top-[3.4rem] h-px bg-gradient-to-r from-transparent via-stone to-transparent pointer-events-none"
          />

          {/* Mobile: stacked */}
          <div className="md:hidden flex flex-col gap-7">
            {MILESTONES.map((m, i) => {
              const color = accentColor[m.accent];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, ease: EASE_EMPHASIS }}
                  className="relative pl-7"
                >
                  <span
                    aria-hidden
                    className="absolute left-0 top-2 w-3 h-3 rounded-full ring-4 ring-ivory2"
                    style={{ background: color, boxShadow: `0 0 14px ${color}66` }}
                  />
                  <span aria-hidden className="absolute left-[5px] top-7 bottom-0 w-px bg-stone" />
                  <div
                    className="font-disp text-4xl font-bold leading-none mb-1"
                    style={{ color }}
                  >
                    {m.year}
                  </div>
                  <div className="text-[0.62rem] uppercase tracking-[0.28em] font-bold text-ink mb-3">
                    <span className="ar">{m.ar}</span>
                    <span className="en">{m.en}</span>
                  </div>
                  <p className="text-[0.95rem] leading-[1.85] text-ink2">
                    <span className="ar">{m.arDsc}</span>
                    <span className="en" dangerouslySetInnerHTML={{ __html: m.enDsc }} />
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Desktop: 5-up rail, all cards baseline-aligned (calm chronicle) */}
          <div className="hidden md:grid grid-cols-5 gap-5 lg:gap-8">
            {MILESTONES.map((m, i) => {
              const color = accentColor[m.accent];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7, ease: EASE_EMPHASIS, delay: i * 0.06 }}
                  className="relative"
                >
                  {/* Dot on the rail */}
                  <div className="relative h-[3.4rem] flex items-end justify-start">
                    <span
                      aria-hidden
                      className="absolute -top-[2px] left-0 w-[10px] h-[10px] rounded-full ring-4 ring-ivory2"
                      style={{ background: color }}
                    />
                  </div>

                  {/* Year, left-aligned (not centred — feels more authored) */}
                  <div className="mt-4">
                    <div
                      className="font-disp text-4xl xl:text-5xl font-bold leading-none mb-2 tracking-tight"
                      style={{ color }}
                    >
                      {m.year}
                    </div>
                    <div className="text-[0.6rem] uppercase tracking-[0.22em] font-bold text-ink2 mb-4">
                      <span className="ar">{m.ar}</span>
                      <span className="en">{m.en}</span>
                    </div>
                    <p className="text-[0.86rem] leading-[1.75] text-ink2 max-w-[24ch]">
                      <span className="ar">{m.arDsc}</span>
                      <span className="en" dangerouslySetInnerHTML={{ __html: m.enDsc }} />
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
