"use client";

import { motion } from "framer-motion";
import Reveal from "@/components/motion/Reveal";

interface Partner {
  ar: string;
  en: string;
  type: "government" | "sports" | "cultural" | "education";
}

const PARTNERS: Partner[] = [
  { ar: "حكومة الشارقة",                     en: "Sharjah Government",            type: "government" },
  { ar: "الهيئة العامة للرياضة",            en: "General Authority of Sports",    type: "sports"     },
  { ar: "اتحاد الإمارات للشطرنج",            en: "UAE Chess Federation",          type: "sports"     },
  { ar: "هيئة الشارقة للرياضة",              en: "Sharjah Sports Council",        type: "sports"     },
  { ar: "دائرة الثقافة بالشارقة",            en: "Sharjah Department of Culture", type: "cultural"   },
  { ar: "مجلس الشارقة للتعليم",              en: "Sharjah Education Council",     type: "education"  },
  { ar: "جامعة الشارقة",                     en: "University of Sharjah",         type: "education"  },
  { ar: "الاتحاد العربي للشطرنج",            en: "Arab Chess Federation",         type: "sports"     },
];

const typeAccent = {
  government: "#C8102E",
  sports:     "#1F6B4F",
  cultural:   "#1F6B4F",
  education:  "#FFFFFF",
} as const;

export default function Partners() {
  return (
    <section className="relative lux-dark lux-tex lux-section">
      <div
        aria-hidden
        className="absolute -top-20 right-0 w-[420px] h-[420px] rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, #1F6B4F 0%, transparent 65%)" }}
      />

      <div className="relative max-w-wrap mx-auto px-4 sm:px-6 lg:px-10 section-pad">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="eyebrow-lux mb-5">
              <span className="dot" />
              <span className="ar">الشركاء والداعمون</span>
              <span className="en">Partners &amp; Supporters</span>
            </span>
            <h2 className="font-disp t-mega text-white mb-6 mt-6">
              <span className="ar">شراكات مؤسسية تليق بالنادي.</span>
              <span className="en">Institutional partnerships of distinction.</span>
            </h2>
            <div className="h-[2px] w-32 mx-auto bg-gradient-to-r from-[#1F6B4F] via-white to-[#C8102E] mb-8" />
            <p className="text-base leading-[1.85] text-white/65 max-w-2xl mx-auto">
              <span className="ar">
                نفخر بشراكاتنا الراسخة مع الجهات الحكومية والرياضية والثقافية في الإمارات.
              </span>
              <span className="en">
                We are proud of our long-standing partnerships with UAE government,
                sporting, and cultural institutions.
              </span>
            </p>
          </div>
        </Reveal>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
        >
          {PARTNERS.map((p, i) => (
            <motion.div
              key={i}
              variants={{
                hidden:  { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.2, 0.8, 0.2, 1] } },
              }}
              className="group relative bg-white/[0.03] border-l-[2px] border-y border-r border-y-white/10 border-r-white/10 backdrop-blur p-5 sm:p-6 transition-all duration-500 hover:bg-white/[0.06] hover:-translate-y-1"
              style={{ borderLeftColor: typeAccent[p.type] }}
            >
              <div className="font-disp text-base sm:text-lg text-white leading-tight">
                <span className="ar">{p.ar}</span>
                <span className="en">{p.en}</span>
              </div>
              <div className="text-[0.6rem] uppercase tracking-[0.22em] text-white/40 font-semibold mt-2.5">
                <span className="ar">شريك مؤسسي</span>
                <span className="en">Institutional Partner</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
