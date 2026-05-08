"use client";

import { motion } from "framer-motion";
import Reveal from "@/components/motion/Reveal";

interface Milestone {
  year:  string;
  ar:    string;
  en:    string;
  arDsc: string;
  enDsc: string;
  accent: "emerald" | "scarlet" | "ink";
}

const MILESTONES: Milestone[] = [
  {
    year:  "1991",
    ar:    "التأسيس",
    en:    "Foundation",
    arDsc: "تأسس النادي رسمياً ليكون أول كيان نسائي مخصص للشطرنج والثقافة في إمارة الشارقة.",
    enDsc: "The club is officially established as one of the first dedicated women&rsquo;s chess and cultural institutions in the Emirate of Sharjah.",
    accent: "scarlet",
  },
  {
    year:  "2000s",
    ar:    "البنية الاحترافية",
    en:    "Professional Era",
    arDsc: "إطلاق برامج تدريبية احترافية وتأهيل أول جيل من المدربات الإماراتيات.",
    enDsc: "Launch of professional training programmes and the qualification of the first generation of Emirati women coaches.",
    accent: "emerald",
  },
  {
    year:  "2010s",
    ar:    "التميّز الإقليمي",
    en:    "Regional Excellence",
    arDsc: "حصد الميداليات في البطولات الخليجية والعربية، وتمثيل الإمارات في المحافل الدولية.",
    enDsc: "Medal-winning performances at GCC and Arab championships, and international representation of the UAE.",
    accent: "ink",
  },
  {
    year:  "2018",
    ar:    "اعتماد الجودة",
    en:    "ISO Certification",
    arDsc: "حصل النادي على شهادة الجودة العالمية ISO تتويجاً لمنظومته الإدارية الاحترافية.",
    enDsc: "The club is awarded international ISO quality certification, recognising its professional management framework.",
    accent: "emerald",
  },
  {
    year:  "اليوم • Today",
    ar:    "الجيل الجديد",
    en:    "The New Generation",
    arDsc: "أكثر من 180 لاعبة في برامج النادي، ومنظومة رقمية حديثة لإدارة التدريب والتقييم.",
    enDsc: "Over 180 active players across our programmes, supported by a modern digital platform for training and assessment.",
    accent: "scarlet",
  },
];

const accentColor = { emerald: "#0B3D2E", scarlet: "#C8102E", ink: "#141414" } as const;

export default function History() {
  return (
    <section className="relative bg-ivory2 overflow-hidden">
      <div className="chess-tex absolute inset-0 opacity-30" />
      <div className="relative max-w-wrap mx-auto px-4 sm:px-6 lg:px-10 section-pad">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
            <span className="eyebrow-light mb-5">
              <span className="dot-emerald" />
              <span className="ar">التاريخ والإرث</span>
              <span className="en">History &amp; Legacy</span>
            </span>
            <h2 className="font-disp t-mega text-ink mb-6 mt-6">
              <span className="ar">أكثر من ثلاثة عقود من العطاء.</span>
              <span className="en">Over three decades of legacy.</span>
            </h2>
            <div className="h-[2px] w-32 mx-auto bg-gradient-to-r from-[#1F6B4F] via-ink to-[#C8102E]" />
          </div>
        </Reveal>

        <div className="relative">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-stone to-transparent" />

          <div className="space-y-12 md:space-y-20">
            {MILESTONES.map((m, i) => {
              const isLeft = i % 2 === 0;
              const color  = accentColor[m.accent];

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 36 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
                  className="md:grid md:grid-cols-2 md:gap-10 items-center"
                >
                  <div className={`${isLeft ? "md:text-right md:order-1" : "md:order-2 md:pl-8"}`}>
                    <div className="font-disp text-6xl sm:text-7xl font-bold leading-none mb-2" style={{ color }}>
                      {m.year}
                    </div>
                    <div className="text-[0.6rem] uppercase tracking-[0.28em] font-bold text-ink">
                      <span className="ar">{m.ar}</span>
                      <span className="en">{m.en}</span>
                    </div>
                  </div>

                  <div className="hidden md:block absolute left-1/2 -translate-x-1/2" style={{ top: "50%" }}>
                    <div
                      className="w-4 h-4 rounded-full ring-4 ring-ivory2"
                      style={{ background: color, boxShadow: `0 0 18px ${color}55` }}
                    />
                  </div>

                  <div className={`mt-3 md:mt-0 ${isLeft ? "md:order-2 md:pl-8" : "md:order-1 md:text-right md:pr-8"}`}>
                    <div className={`bg-white border-t-[2px] border border-stone p-6 sm:p-7 max-w-md ${isLeft ? "" : "md:ml-auto"}`} style={{ borderTopColor: color }}>
                      <p className="text-base leading-[1.85] text-ink2">
                        <span className="ar">{m.arDsc}</span>
                        <span className="en" dangerouslySetInnerHTML={{ __html: m.enDsc }} />
                      </p>
                    </div>
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
