"use client";

import { motion } from "framer-motion";
import Reveal from "@/components/motion/Reveal";

interface Quote {
  ar:    string;
  en:    string;
  whoAr: string;
  whoEn: string;
  roleAr: string;
  roleEn: string;
  accent: "emerald" | "scarlet" | "white";
}

const QUOTES: Quote[] = [
  {
    ar:     "النادي لم يُعلّم ابنتي الشطرنج فقط، بل علّمها كيف تُفكّر وكيف تختار قراراتها بثقة. اليوم هي إنسانة مختلفة.",
    en:     "The club didn&rsquo;t just teach my daughter chess — it taught her how to think and how to make decisions with confidence. She is a different person today.",
    whoAr:  "أم لاعبة في فريق النخبة",
    whoEn:  "Parent of an Elite Squad player",
    roleAr: "ولية أمر",
    roleEn: "Parent",
    accent: "scarlet",
  },
  {
    ar:     "بيئة احترافية ومُلهِمة، ونموذج راقٍ لما يجب أن يكون عليه النادي النسائي في الإمارات. شراكتنا مع النادي مصدر فخر.",
    en:     "A professional and inspiring environment — a model of what a women&rsquo;s sporting club should be in the UAE. Our partnership is a source of pride.",
    whoAr:  "ممثل جهة شريكة",
    whoEn:  "Institutional partner",
    roleAr: "شريك مؤسسي",
    roleEn: "Institutional Partner",
    accent: "emerald",
  },
  {
    ar:     "بدأتُ في النادي وأنا في السابعة. اليوم أُمثّل الإمارات في البطولات الدولية. كل ما حققته بدأ من هنا.",
    en:     "I started at the club when I was seven. Today I represent the UAE in international tournaments. Everything I&rsquo;ve achieved began here.",
    whoAr:  "لاعبة في فريق النخبة",
    whoEn:  "Elite Squad player",
    roleAr: "لاعبة",
    roleEn: "Player",
    accent: "white",
  },
];

const accentMap = { emerald: "#1F6B4F", scarlet: "#C8102E", white: "#FFFFFF" } as const;

export default function Testimonials() {
  return (
    <section className="relative lux-dark lux-tex lux-section">
      <div
        aria-hidden
        className="absolute top-0 right-1/4 w-[520px] h-[400px] rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(ellipse, #1F6B4F 0%, transparent 70%)" }}
      />

      <div className="relative max-w-wrap mx-auto px-4 sm:px-6 lg:px-10 section-pad">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
            <span className="eyebrow-lux mb-5">
              <span className="dot" />
              <span className="ar">شهادات</span>
              <span className="en">Testimonials</span>
            </span>
            <h2 className="font-disp t-mega text-white mb-6 mt-6">
              <span className="ar">بصوت عائلتنا.</span>
              <span className="en">In their own words.</span>
            </h2>
            <div className="h-[2px] w-32 mx-auto bg-gradient-to-r from-[#1F6B4F] via-white to-[#C8102E]" />
          </div>
        </Reveal>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {QUOTES.map((q, i) => (
            <motion.figure
              key={i}
              variants={{
                hidden:  { opacity: 0, y: 32 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] } },
              }}
              whileHover={{ y: -6 }}
              className="relative bg-white/[0.03] border border-white/10 backdrop-blur p-8 sm:p-10 hover:bg-white/[0.06] transition-colors duration-500"
            >
              <div
                className="absolute top-3 right-5 font-disp text-7xl leading-none opacity-20 select-none"
                style={{ color: accentMap[q.accent] }}
              >
                &ldquo;
              </div>
              <blockquote className="relative text-base sm:text-lg leading-[1.85] text-white/80 mb-7">
                <span className="ar" dangerouslySetInnerHTML={{ __html: q.ar }} />
                <span className="en" dangerouslySetInnerHTML={{ __html: q.en }} />
              </blockquote>
              <div className="h-px w-12 mb-4" style={{ background: accentMap[q.accent] }} />
              <figcaption>
                <div className="font-disp text-base text-white mb-1">
                  <span className="ar">{q.whoAr}</span>
                  <span className="en">{q.whoEn}</span>
                </div>
                <div className="text-[0.6rem] uppercase tracking-[0.28em] font-bold" style={{ color: accentMap[q.accent] }}>
                  <span className="ar">{q.roleAr}</span>
                  <span className="en">{q.roleEn}</span>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
