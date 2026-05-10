"use client";

import { motion } from "framer-motion";
import Reveal from "@/components/motion/Reveal";
import { EASE_EMPHASIS } from "@/lib/motion";

interface Quote {
  ar:    string;
  en:    string;
  whoAr: string;
  whoEn: string;
  roleAr: string;
  roleEn: string;
  accent: "emerald" | "scarlet" | "ink";
}

const FEATURED: Quote = {
  ar:     "بدأتُ في النادي وأنا في السابعة. اليوم أُمثّل الإمارات في البطولات الدولية. كل ما حققته بدأ من هنا.",
  en:     "I started at the club when I was seven. Today I represent the UAE in international tournaments. Everything I&rsquo;ve achieved began here.",
  whoAr:  "لاعبة في فريق النخبة",
  whoEn:  "Elite Squad player",
  roleAr: "لاعبة دولية",
  roleEn: "International Player",
  accent: "ink",
};

const MARGIN: Quote[] = [
  {
    ar:     "النادي لم يُعلّم ابنتي الشطرنج فقط، بل علّمها كيف تُفكّر وكيف تختار قراراتها بثقة.",
    en:     "The club didn&rsquo;t just teach my daughter chess — it taught her how to think and how to make decisions with confidence.",
    whoAr:  "أم لاعبة في فريق النخبة",
    whoEn:  "Parent of an Elite Squad player",
    roleAr: "ولية أمر",
    roleEn: "Parent",
    accent: "scarlet",
  },
  {
    ar:     "بيئة احترافية ومُلهِمة، ونموذج راقٍ لما يجب أن يكون عليه النادي النسائي في الإمارات.",
    en:     "A professional and inspiring environment — a model of what a women&rsquo;s sporting club should be in the UAE.",
    whoAr:  "ممثل جهة شريكة",
    whoEn:  "Institutional partner",
    roleAr: "شريك مؤسسي",
    roleEn: "Institutional Partner",
    accent: "emerald",
  },
];

const accentMap = { emerald: "#0B3D2E", scarlet: "#C8102E", ink: "#141414" } as const;

export default function Testimonials() {
  return (
    <section className="relative bg-white overflow-hidden">
      <div aria-hidden className="absolute inset-0 grain-emerald pointer-events-none" />

      <div className="relative max-w-wrap mx-auto px-4 sm:px-6 lg:px-10 py-28 sm:py-32">
        {/* No eyebrow — caption ABOVE the headline, italicised. Different cadence from neighbouring sections. */}
        <Reveal>
          <div className="max-w-2xl mb-14 sm:mb-20">
            <p className="text-[0.85rem] text-ink3 italic mb-3">
              <span className="ar">— ثلاث وجهات نظر، جُمعت في 2024:</span>
              <span className="en">— three perspectives, collected in 2024:</span>
            </p>
            <h2 className="font-disp text-[clamp(2rem,4vw,3rem)] text-ink leading-[1.1] tracking-tight">
              <span className="ar">لاعبة، ولية أمر، وشريك مؤسسي.</span>
              <span className="en">A player, a parent, an institutional partner.</span>
            </h2>
          </div>
        </Reveal>

        {/* Featured pull quote — center stage */}
        <motion.figure
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.85, ease: EASE_EMPHASIS }}
          className="relative max-w-4xl mx-auto text-center mb-20 sm:mb-28"
        >
          <span
            aria-hidden
            className="block font-disp text-7xl sm:text-9xl leading-none mb-2"
            style={{ color: accentMap[FEATURED.accent], opacity: 0.18 }}
          >
            &ldquo;
          </span>
          <blockquote className="font-disp text-3xl sm:text-4xl lg:text-5xl text-ink leading-[1.18] tracking-tight px-2 sm:px-6">
            <span className="ar" dangerouslySetInnerHTML={{ __html: FEATURED.ar }} />
            <span className="en" dangerouslySetInnerHTML={{ __html: FEATURED.en }} />
          </blockquote>
          <span
            aria-hidden
            className="block mx-auto h-px w-20 my-8 bg-gradient-to-r from-transparent via-ink to-transparent"
          />
          <figcaption>
            <div className="font-disp text-lg text-ink mb-1">
              <span className="ar">{FEATURED.whoAr}</span>
              <span className="en">{FEATURED.whoEn}</span>
            </div>
            <div className="text-[0.62rem] uppercase tracking-[0.32em] font-bold text-[#0B3D2E]">
              <span className="ar">{FEATURED.roleAr}</span>
              <span className="en">{FEATURED.roleEn}</span>
            </div>
          </figcaption>
        </motion.figure>

        {/* Marginalia quotes — asymmetric pair, offset, no panel numbering */}
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {MARGIN.map((q, i) => {
            const color = accentMap[q.accent];
            const isLeft = i === 0;
            return (
              <motion.figure
                key={i}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: EASE_EMPHASIS }}
                className={`relative ${isLeft ? "lg:col-span-7 lg:translate-y-0" : "lg:col-span-5 lg:translate-y-10"}`}
              >
                <div className="quote-panel p-8 sm:p-10 h-full flex flex-col">
                  <div className="text-[0.6rem] uppercase tracking-[0.28em] font-bold mb-6" style={{ color }}>
                    <span className="ar">{q.roleAr}</span>
                    <span className="en">{q.roleEn}</span>
                  </div>

                  <blockquote className="font-disp text-xl sm:text-[1.4rem] text-ink leading-[1.42] mb-7 flex-1">
                    <span className="ar" dangerouslySetInnerHTML={{ __html: q.ar }} />
                    <span className="en" dangerouslySetInnerHTML={{ __html: q.en }} />
                  </blockquote>

                  <figcaption className="text-[0.85rem] text-ink2 leading-snug">
                    <span className="ar">— {q.whoAr}</span>
                    <span className="en">— {q.whoEn}</span>
                  </figcaption>
                </div>
              </motion.figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
