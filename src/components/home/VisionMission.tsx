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
    <section className="relative bg-white overflow-hidden">
      <div className="relative max-w-wrap mx-auto px-4 sm:px-6 lg:px-10 section-pad">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
            <span className="eyebrow-light mb-5">
              <span className="dot-emerald" />
              <span className="ar">الرؤية والرسالة</span>
              <span className="en">Vision &amp; Mission</span>
            </span>
            <h2 className="font-disp t-mega text-ink mb-6 mt-6">
              <span className="ar">بوصلتنا. مرتكزاتنا.</span>
              <span className="en">Our compass. Our foundation.</span>
            </h2>
            <div className="h-[2px] w-32 mx-auto bg-gradient-to-r from-[#1F6B4F] via-ink to-[#C8102E]" />
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-20">
          <Reveal delay={0.1}>
            <article className="relative bg-ivory2 border border-stone p-8 sm:p-12 overflow-hidden h-full hover:-translate-y-1 hover:shadow-[0_22px_50px_-25px_rgba(11,61,46,0.4)] transition-all duration-500">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#0B3D2E]" />
              <div className="absolute -top-10 -right-6 text-[10rem] font-disp opacity-[0.06] text-[#0B3D2E] leading-none select-none">♛</div>
              <div className="relative">
                <div className="text-[0.6rem] uppercase tracking-[0.28em] text-[#0B3D2E] font-bold mb-5">
                  <span className="ar">رؤيتنا</span>
                  <span className="en">Our Vision</span>
                </div>
                <h3 className="font-disp text-3xl sm:text-4xl text-ink leading-tight mb-7">
                  <span className="ar">من أبرز أندية الشطرنج النسائية في الإمارات.</span>
                  <span className="en">Among the leading women&rsquo;s chess clubs in the UAE.</span>
                </h3>
                <p className="text-base sm:text-lg leading-[1.85] text-ink3">
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
            <article className="relative bg-ivory2 border border-stone p-8 sm:p-12 overflow-hidden h-full hover:-translate-y-1 hover:shadow-[0_22px_50px_-25px_rgba(200,16,46,0.35)] transition-all duration-500">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#C8102E]" />
              <div className="absolute -top-10 -right-6 text-[10rem] font-disp opacity-[0.06] text-[#C8102E] leading-none select-none">✦</div>
              <div className="relative">
                <div className="text-[0.6rem] uppercase tracking-[0.28em] text-[#C8102E] font-bold mb-5">
                  <span className="ar">رسالتنا</span>
                  <span className="en">Our Mission</span>
                </div>
                <h3 className="font-disp text-3xl sm:text-4xl text-ink leading-tight mb-7">
                  <span className="ar">تنمية الفتيات ذهنياً وتنافسياً.</span>
                  <span className="en">Developing girls intellectually &amp; competitively.</span>
                </h3>
                <p className="text-base sm:text-lg leading-[1.85] text-ink3">
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

        <Reveal delay={0.1}>
          <div className="text-center mb-12">
            <div className="text-[0.6rem] uppercase tracking-[0.28em] text-[#0B3D2E] font-bold mb-4">
              <span className="ar">القيم الجوهرية</span>
              <span className="en">Core Values</span>
            </div>
            <h3 className="font-disp text-3xl sm:text-4xl text-ink">
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
              className="group relative bg-white border border-stone py-8 px-3 text-center transition-all duration-300 hover:border-[#0B3D2E] hover:bg-ivory2 hover:-translate-y-1 hover:shadow-[0_18px_44px_-22px_rgba(11,61,46,0.3)]"
            >
              <div className="relative font-disp text-3xl text-[#0B3D2E] mb-3 group-hover:scale-110 transition-transform duration-500">{v.icon}</div>
              <div className="relative text-[0.7rem] uppercase tracking-[0.16em] font-bold text-ink">
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
