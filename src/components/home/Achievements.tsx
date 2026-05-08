"use client";

import { motion } from "framer-motion";
import Reveal from "@/components/motion/Reveal";

interface Achievement {
  icon:  string;
  ar:    string;
  en:    string;
  arDsc: string;
  enDsc: string;
  accent: "emerald" | "scarlet" | "ink";
}

const ACHIEVEMENTS: Achievement[] = [
  {
    icon:  "🥇",
    ar:    "بطولات الإمارات النسائية",
    en:    "UAE Women's Championships",
    arDsc: "حضور مستمر على منصات التتويج في بطولات الشطرنج النسائية الرئيسية بالدولة.",
    enDsc: "A continuous presence on the podium in the UAE&rsquo;s leading women&rsquo;s chess championships.",
    accent: "scarlet",
  },
  {
    icon:  "🏛",
    ar:    "التميّز المؤسسي",
    en:    "Institutional Excellence",
    arDsc: "تكريمات وتقديرات رسمية من جهات حكومية ورياضية في الإمارات على مدار السنوات.",
    enDsc: "Repeated official recognition from UAE government and sporting bodies for institutional excellence.",
    accent: "ink",
  },
  {
    icon:  "✓",
    ar:    "اعتماد الجودة ISO",
    en:    "ISO Quality Certification",
    arDsc: "اعتماد دولي يؤكد التزام النادي بأعلى معايير الإدارة والتشغيل.",
    enDsc: "International certification confirming the club&rsquo;s commitment to top-tier management and operations standards.",
    accent: "emerald",
  },
  {
    icon:  "♕",
    ar:    "نشر الشطرنج بين الفتيات",
    en:    "Promoting Chess for Girls",
    arDsc: "مبادرات وطنية لنشر الشطرنج بين الفتيات في المدارس والمراكز المجتمعية.",
    enDsc: "National outreach initiatives bringing chess to girls in schools and community centres across the UAE.",
    accent: "emerald",
  },
  {
    icon:  "☀",
    ar:    "المخيم الصيفي",
    en:    "Summer Camp",
    arDsc: "برامج تطوير الشباب الصيفية بحضور ميداني واسع وإنجازات تدريبية ملموسة.",
    enDsc: "Annual summer development programmes drawing strong attendance and producing measurable training results.",
    accent: "scarlet",
  },
  {
    icon:  "❀",
    ar:    "الأنشطة الثقافية والمجتمعية",
    en:    "Cultural & Community Activities",
    arDsc: "حضور فاعل في الفعاليات الثقافية والمجتمعية بالشارقة والإمارات.",
    enDsc: "Active participation in cultural and community events across Sharjah and the wider UAE.",
    accent: "emerald",
  },
];

const accentMap = { emerald: "#0B3D2E", scarlet: "#C8102E", ink: "#141414" } as const;

export default function Achievements() {
  return (
    <section className="relative bg-ivory2 overflow-hidden">
      <div className="relative max-w-wrap mx-auto px-4 sm:px-6 lg:px-10 section-pad">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
            <span className="eyebrow-light mb-5">
              <span className="dot-emerald" />
              <span className="ar">الإنجازات</span>
              <span className="en">Achievements</span>
            </span>
            <h2 className="font-disp t-mega text-ink mb-6 mt-6">
              <span className="ar">إرث من التميّز والتتويج.</span>
              <span className="en">A legacy of excellence and titles.</span>
            </h2>
            <div className="h-[2px] w-32 mx-auto bg-gradient-to-r from-[#1F6B4F] via-ink to-[#C8102E]" />
          </div>
        </Reveal>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6"
        >
          {ACHIEVEMENTS.map((a, i) => (
            <motion.article
              key={i}
              variants={{
                hidden:  { opacity: 0, y: 28 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.2, 0.8, 0.2, 1] } },
              }}
              whileHover={{ y: -6 }}
              className="group relative bg-white border border-stone p-8 overflow-hidden transition-all duration-500 hover:shadow-[0_22px_50px_-25px_rgba(20,20,20,0.25)]"
            >
              <div aria-hidden className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: accentMap[a.accent] }} />
              <div
                aria-hidden
                className="absolute -top-6 -right-2 text-[7rem] opacity-[0.05] leading-none select-none transition-opacity duration-500 group-hover:opacity-[0.1]"
                style={{ color: accentMap[a.accent] }}
              >
                {a.icon}
              </div>
              <div className="relative">
                <div className="text-3xl mb-5">{a.icon}</div>
                <h3 className="font-disp text-xl sm:text-2xl text-ink mb-3 leading-tight">
                  <span className="ar">{a.ar}</span>
                  <span className="en">{a.en}</span>
                </h3>
                <p className="text-[0.92rem] leading-[1.8] text-ink3">
                  <span className="ar">{a.arDsc}</span>
                  <span className="en" dangerouslySetInnerHTML={{ __html: a.enDsc }} />
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
