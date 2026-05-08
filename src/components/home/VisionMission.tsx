"use client";

import { motion } from "framer-motion";
import Reveal from "@/components/motion/Reveal";

const VALUES = [
  { icon: "♛", ar: "الريادة",      en: "Leadership"        },
  { icon: "✦", ar: "التميّز",       en: "Excellence"        },
  { icon: "✧", ar: "الإبداع",       en: "Creativity"        },
  { icon: "◈", ar: "الابتكار",      en: "Innovation"        },
  { icon: "△", ar: "الانضباط",      en: "Discipline"        },
  { icon: "◯", ar: "المجتمع",       en: "Community"         },
  { icon: "♕", ar: "تمكين المرأة",  en: "Women Empowerment" },
];

export default function VisionMission() {
  return (
    <section className="relative lux-dark lux-tex lux-section">
      {/* Glows */}
      <div
        aria-hidden
        className="absolute -top-32 left-1/4 w-[520px] h-[520px] rounded-full blur-3xl opacity-25 pointer-events-none"
        style={{ background: "radial-gradient(circle, #1F6B4F 0%, transparent 65%)" }}
      />
      <div
        aria-hidden
        className="absolute bottom-0 right-0 w-[420px] h-[420px] rounded-full blur-3xl opacity-12 pointer-events-none"
        style={{ background: "radial-gradient(circle, #C8102E 0%, transparent 70%)" }}
      />

      <div className="relative max-w-wrap mx-auto px-4 sm:px-6 lg:px-10 section-pad">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
            <span className="eyebrow-lux mb-5">
              <span className="dot" />
              <span className="ar">الرؤية والرسالة</span>
              <span className="en">Vision &amp; Mission</span>
            </span>
            <h2 className="font-disp t-mega text-white mb-6 mt-6">
              <span className="ar">بوصلتنا. مرتكزاتنا.</span>
              <span className="en">Our compass. Our foundation.</span>
            </h2>
            <div className="h-[2px] w-32 mx-auto bg-gradient-to-r from-[#1F6B4F] via-white to-[#C8102E]" />
          </div>
        </Reveal>

        {/* Vision + Mission cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-20">
          <Reveal delay={0.1}>
            <article className="relative bg-white/[0.03] border border-white/10 backdrop-blur p-8 sm:p-12 overflow-hidden h-full hover:bg-white/[0.05] transition-colors duration-500">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#1F6B4F]" />
              <div className="absolute -top-10 -right-6 text-[10rem] font-disp opacity-[0.06] text-[#1F6B4F] leading-none select-none">♛</div>
              <div className="relative">
                <div className="text-[0.6rem] uppercase tracking-[0.28em] text-[#1F6B4F] font-bold mb-5">
                  <span className="ar">رؤيتنا</span>
                  <span className="en">Our Vision</span>
                </div>
                <h3 className="font-disp text-3xl sm:text-4xl text-white leading-tight mb-7">
                  <span className="ar">من أبرز أندية الشطرنج النسائية في الإمارات.</span>
                  <span className="en">Among the leading women&rsquo;s chess clubs in the UAE.</span>
                </h3>
                <p className="text-base sm:text-lg leading-[1.85] text-white/60">
                  <span className="ar">
                    نسعى إلى إلهام الأجيال القادمة من اللاعبات الإماراتيات وترسيخ مكانة
                    النادي كرمزٍ للتميّز الرياضي والثقافي للمرأة في المنطقة.
                  </span>
                  <span className="en">
                    We aspire to inspire future generations of Emirati players and
                    to anchor the club as a regional benchmark of sporting and
                    cultural excellence for women.
                  </span>
                </p>
              </div>
            </article>
          </Reveal>

          <Reveal delay={0.2}>
            <article className="relative bg-white/[0.03] border border-white/10 backdrop-blur p-8 sm:p-12 overflow-hidden h-full hover:bg-white/[0.05] transition-colors duration-500">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#C8102E]" />
              <div className="absolute -top-10 -right-6 text-[10rem] font-disp opacity-[0.06] text-[#C8102E] leading-none select-none">✦</div>
              <div className="relative">
                <div className="text-[0.6rem] uppercase tracking-[0.28em] text-[#C8102E] font-bold mb-5">
                  <span className="ar">رسالتنا</span>
                  <span className="en">Our Mission</span>
                </div>
                <h3 className="font-disp text-3xl sm:text-4xl text-white leading-tight mb-7">
                  <span className="ar">تنمية الفتيات ذهنياً وتنافسياً.</span>
                  <span className="en">Developing girls intellectually &amp; competitively.</span>
                </h3>
                <p className="text-base sm:text-lg leading-[1.85] text-white/60">
                  <span className="ar">
                    نُطوّر اللاعبات من خلال الشطرنج، الثقافة، التعليم، والمشاركة المجتمعية،
                    في بيئة احترافية ومُلهِمة تليق بمكانة المرأة الإماراتية.
                  </span>
                  <span className="en">
                    We develop players through chess, culture, education, and
                    community engagement — in a professional, empowering environment
                    worthy of Emirati women.
                  </span>
                </p>
              </div>
            </article>
          </Reveal>
        </div>

        {/* Core values */}
        <Reveal delay={0.1}>
          <div className="text-center mb-12">
            <div className="text-[0.6rem] uppercase tracking-[0.28em] text-[#1F6B4F] font-bold mb-4">
              <span className="ar">القيم الجوهرية</span>
              <span className="en">Core Values</span>
            </div>
            <h3 className="font-disp text-3xl sm:text-4xl text-white">
              <span className="ar">سبعة مرتكزات تُوجِّه عملنا</span>
              <span className="en">Seven principles that guide our work</span>
            </h3>
          </div>
        </Reveal>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden:  {},
            visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
          }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4"
        >
          {VALUES.map((v, i) => (
            <motion.div
              key={i}
              variants={{
                hidden:  { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.2, 0.8, 0.2, 1] } },
              }}
              className="group relative bg-white/[0.02] border border-white/10 py-8 px-3 text-center transition-all duration-300 hover:border-[#1F6B4F] hover:bg-white/[0.05] hover:-translate-y-1"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: "radial-gradient(circle at center, rgba(31,107,79,0.18) 0%, transparent 70%)" }} />
              <div className="relative font-disp text-3xl text-[#1F6B4F] mb-3 group-hover:scale-110 transition-transform duration-500">{v.icon}</div>
              <div className="relative text-[0.7rem] uppercase tracking-[0.16em] font-bold text-white/85">
                <span className="ar">{v.ar}</span>
                <span className="en">{v.en}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
