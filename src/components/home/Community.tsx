"use client";

import { motion } from "framer-motion";
import { EASE_EMPHASIS } from "@/lib/motion";

interface Activity {
  ar:    string;
  en:    string;
  arDsc: string;
  enDsc: string;
  arWhen?: string;
  enWhen?: string;
}

const ACTIVITIES: Activity[] = [
  {
    ar:    "ورش العمل الثقافية",
    en:    "Cultural workshops",
    arDsc: "ورش متخصصة في القيادة، الفنون، والكتابة، تُنفَّذ ضمن منهج النادي لعضواته وأهالي اللاعبات.",
    enDsc: "Workshops in leadership, the arts and writing — part of the club&rsquo;s in-house curriculum, open to members and players&rsquo; families.",
    arWhen: "شهرياً",
    enWhen: "monthly",
  },
  {
    ar:    "البرامج المدرسية",
    en:    "School outreach",
    arDsc: "زيارات منتظمة لمدارس البنات في الإمارات لتقديم الشطرنج كنشاط مدرسي معتمد.",
    enDsc: "Regular visits to girls&rsquo; schools across the UAE to introduce chess as an accredited school activity.",
    arWhen: "خلال العام الدراسي",
    enWhen: "during term-time",
  },
  {
    ar:    "الشراكات المؤسسية",
    en:    "Institutional work",
    arDsc: "تعاون مع جهات حكومية ومدنية في الشارقة والإمارات على مبادرات مشتركة وبرامج تنموية.",
    enDsc: "Joint work with government and civic partners in Sharjah and across the UAE on shared initiatives.",
  },
  {
    ar:    "حفل التكريم السنوي",
    en:    "Annual recognition",
    arDsc: "حفل سنوي يُكرّم اللاعبات والمدربات والإداريات اللواتي حقّقن نتائج بارزة خلال الموسم.",
    enDsc: "An annual ceremony recognising the players, coaches and administrators behind the season&rsquo;s standout results.",
    arWhen: "ختام الموسم",
    enWhen: "end of season",
  },
];

export default function Community() {
  return (
    <section className="relative bg-ink text-ivory overflow-hidden">
      <div aria-hidden className="absolute inset-0 chess-tex-lt opacity-45 pointer-events-none" />
      <div
        aria-hidden
        className="absolute -top-48 -left-32 w-[480px] h-[480px] rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #1F6B4F 0%, transparent 70%)" }}
      />

      <div className="relative max-w-wrap mx-auto px-4 sm:px-6 lg:px-10 py-24 sm:py-28">
        {/* Header — quieter, no italic accent */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE_EMPHASIS }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 sm:mb-20 items-end"
        >
          <div className="lg:col-span-7">
            <div className="text-[0.6rem] uppercase tracking-[0.32em] text-[#1F6B4F] font-bold mb-5 flex items-center gap-3">
              <span aria-hidden className="block w-7 h-px bg-[#1F6B4F]" />
              <span className="ar">المجتمع والثقافة</span>
              <span className="en">Outside the playing room</span>
            </div>
            <h2 className="font-disp text-[clamp(2.4rem,5vw,4rem)] text-ivory leading-[1.06] tracking-tight max-w-3xl">
              <span className="ar">عمل النادي خارج طاولة المباراة.</span>
              <span className="en">What the club does between matches.</span>
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pb-2">
            <p className="text-[0.95rem] sm:text-[1.05rem] leading-[1.85] text-ivory/72 max-w-md">
              <span className="ar">
                إلى جانب الجلسات والبطولات، ينفّذ النادي برامج ثقافية وتعليمية ومجتمعية على مدار السنة، بشراكات داخلية وخارجية.
              </span>
              <span className="en">
                Alongside training and competition, the club runs a year-round
                programme of cultural, educational and community work, with
                internal and external partners.
              </span>
            </p>
          </div>
        </motion.div>

        {/* Activities table — clean editorial list, no emoji, no numbered tags */}
        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
          className="border-t border-white/15"
        >
          {ACTIVITIES.map((a, i) => (
            <motion.li
              key={i}
              variants={{
                hidden:  { opacity: 0, y: 18 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_EMPHASIS } },
              }}
              className="group grid grid-cols-1 lg:grid-cols-12 gap-y-3 gap-x-8 lg:gap-x-12 py-9 sm:py-11 border-b border-white/12 transition-colors duration-280 ease-standard hover:bg-white/[0.015]"
            >
              <h3 className="lg:col-span-4 font-disp text-[clamp(1.5rem,2.4vw,1.95rem)] text-ivory leading-[1.18] tracking-tight">
                <span className="ar">{a.ar}</span>
                <span className="en">{a.en}</span>
              </h3>
              <p className="lg:col-span-6 text-[0.95rem] sm:text-[1rem] leading-[1.85] text-ivory/70 max-w-[60ch]">
                <span className="ar">{a.arDsc}</span>
                <span className="en">{a.enDsc}</span>
              </p>
              <div className="lg:col-span-2 lg:text-right text-[0.62rem] uppercase tracking-[0.22em] font-bold text-[#1F6B4F] lg:pt-2">
                {a.arWhen || a.enWhen ? (
                  <>
                    <span className="ar">{a.arWhen}</span>
                    <span className="en">{a.enWhen}</span>
                  </>
                ) : (
                  <span className="text-ivory/35 italic normal-case tracking-normal">
                    <span className="ar">— يُجدّد سنوياً</span>
                    <span className="en">— renewed annually</span>
                  </span>
                )}
              </div>
            </motion.li>
          ))}
        </motion.ul>

      </div>
    </section>
  );
}
