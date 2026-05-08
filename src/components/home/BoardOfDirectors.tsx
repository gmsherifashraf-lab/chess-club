"use client";

import { motion } from "framer-motion";
import Reveal from "@/components/motion/Reveal";

interface Member {
  ar:        string;
  en:        string;
  arRole:    string;
  enRole:    string;
  honorific?: { ar: string; en: string };
  highlighted?: boolean;
}

const HONORIFIC = { ar: "سعادة", en: "H.E." };

const BOARD: Member[] = [
  {
    ar:    "نجلاء عبدالله أحمد الدرويشي الشامسي",
    en:    "Najla Abdullah Ahmed Al Darwishi Al Shamsi",
    arRole: "رئيسة مجلس الإدارة",
    enRole: "Chairperson of the Board",
    honorific: HONORIFIC,
    highlighted: true,
  },
  {
    ar:    "أروى محمد سلطان محمد العويس",
    en:    "Arwa Mohammed Sultan Mohammed Al Owais",
    arRole: "عضو مجلس الإدارة",
    enRole: "Board Member",
    honorific: HONORIFIC,
  },
  {
    ar:    "أمينة جمعة حسن صالح الجسمي",
    en:    "Amina Juma Hassan Saleh Al Jasmi",
    arRole: "عضو مجلس الإدارة",
    enRole: "Board Member",
    honorific: HONORIFIC,
  },
  {
    ar:    "إيمان محمد مبارك محمد العلي",
    en:    "Iman Mohammed Mubarak Mohammed Al Ali",
    arRole: "عضو مجلس الإدارة",
    enRole: "Board Member",
    honorific: HONORIFIC,
  },
  {
    ar:    "حمدة سالم سلطان العقروبي السويدي",
    en:    "Hamda Salem Sultan Al Aqroubi Al Suwaidi",
    arRole: "عضو مجلس الإدارة",
    enRole: "Board Member",
    honorific: HONORIFIC,
  },
  {
    ar:    "علياء علي غريب أحمد المزمي",
    en:    "Alia Ali Gharib Ahmed Al Mazmi",
    arRole: "عضو مجلس الإدارة",
    enRole: "Board Member",
    honorific: HONORIFIC,
  },
  {
    ar:    "ميثاء عيسى خلفان بن عيسى الذبحاني",
    en:    "Maitha Issa Khalfan bin Isa Al Dhabahi",
    arRole: "الأمين العام",
    enRole: "Secretary General",
    honorific: HONORIFIC,
    highlighted: true,
  },
];

const EXECUTIVE = {
  ar: "آمنة الملا",
  en: "Amna Al Mulla",
  arRole: "المدير التنفيذي",
  enRole: "Executive Director",
};

function initials(name: string): string {
  return name
    .replace(/^(H\.E\.|Her Excellency|سعادة)\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

export default function BoardOfDirectors() {
  return (
    <section className="relative lux-dark lux-tex lux-section">
      <div
        aria-hidden
        className="absolute -top-20 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-3xl opacity-25 pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(31,107,79,0.6) 0%, transparent 65%)" }}
      />

      <div className="relative max-w-wrap mx-auto px-4 sm:px-6 lg:px-10 section-pad">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
            <span className="eyebrow-lux mb-5">
              <span className="dot" />
              <span className="ar">مجلس الإدارة</span>
              <span className="en">Board of Directors</span>
            </span>
            <h2 className="font-disp t-mega text-white mb-6 mt-6">
              <span className="ar">القيادة المؤسسية للنادي.</span>
              <span className="en">Institutional leadership.</span>
            </h2>
            <div className="h-[2px] w-32 mx-auto bg-gradient-to-r from-[#1F6B4F] via-white to-[#C8102E] mb-8" />
            <p className="text-base sm:text-lg leading-[1.85] text-white/65">
              <span className="ar">
                يقود النادي مجلس إدارة من سيدات إماراتيات يجمعن بين الخبرة المؤسسية والريادة الاجتماعية.
              </span>
              <span className="en">
                The club is led by a board of distinguished Emirati women combining
                institutional expertise with social leadership.
              </span>
            </p>
          </div>
        </Reveal>

        {/* Board cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6 mb-20"
        >
          {BOARD.map((m, i) => (
            <motion.article
              key={i}
              variants={{
                hidden:  { opacity: 0, y: 28 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] } },
              }}
              whileHover={{ y: -6 }}
              className={`group relative bg-white/[0.03] border ${m.highlighted ? "border-[#1F6B4F]/60" : "border-white/10"} backdrop-blur pt-9 pb-7 px-6 text-center transition-colors duration-500 hover:bg-white/[0.06]`}
            >
              <div aria-hidden className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#1F6B4F] via-white to-[#C8102E]" />

              <div className="relative w-24 h-24 mx-auto mb-5">
                <div className="absolute -inset-1 bg-gradient-to-br from-[#1F6B4F] via-white to-[#C8102E] rounded-full opacity-50 group-hover:opacity-90 transition-opacity duration-500" />
                <div className="relative w-full h-full rounded-full bg-black/80 overflow-hidden flex items-center justify-center text-white border border-white/10">
                  <span className="font-disp text-2xl">{initials(m.en)}</span>
                </div>
              </div>

              {m.honorific && (
                <div className="text-[0.6rem] uppercase tracking-[0.28em] text-[#1F6B4F] font-bold mb-2">
                  <span className="ar">{m.honorific.ar}</span>
                  <span className="en">{m.honorific.en}</span>
                </div>
              )}

              <h3 className="font-disp text-[1.05rem] text-white mb-3 leading-tight px-1">
                <span className="ar">{m.ar}</span>
                <span className="en">{m.en}</span>
              </h3>

              <div className="text-[0.7rem] uppercase tracking-[0.18em] text-white/55 font-semibold border-t border-white/10 pt-3 mt-3">
                <span className="ar">{m.arRole}</span>
                <span className="en">{m.enRole}</span>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Executive Leadership */}
        <Reveal>
          <div className="border-t border-white/10 pt-16">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="text-[0.6rem] uppercase tracking-[0.28em] text-[#1F6B4F] font-bold mb-3">
                <span className="ar">الإدارة التنفيذية</span>
                <span className="en">Executive Leadership</span>
              </div>
              <h3 className="font-disp text-3xl sm:text-4xl text-white">
                <span className="ar">القيادة التنفيذية للنادي</span>
                <span className="en">Operational Leadership</span>
              </h3>
            </div>

            <div className="max-w-md mx-auto">
              <article className="relative bg-gradient-to-br from-[#0B3D2E]/40 via-black/40 to-[#0B3D2E]/40 border border-[#1F6B4F]/30 backdrop-blur pt-10 pb-9 px-6 text-center overflow-hidden">
                <div aria-hidden className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#1F6B4F] via-white to-[#C8102E]" />
                <div
                  aria-hidden
                  className="absolute -bottom-20 -right-20 w-[280px] h-[280px] rounded-full blur-3xl opacity-30 pointer-events-none"
                  style={{ background: "radial-gradient(circle, #1F6B4F 0%, transparent 70%)" }}
                />
                <div className="relative">
                  <div className="relative w-28 h-28 mx-auto mb-6">
                    <div className="absolute -inset-1 bg-gradient-to-br from-[#1F6B4F] via-white to-[#C8102E] rounded-full opacity-80" />
                    <div className="relative w-full h-full rounded-full bg-white overflow-hidden flex items-center justify-center text-black">
                      <span className="font-disp text-3xl">{initials(EXECUTIVE.en)}</span>
                    </div>
                  </div>
                  <h3 className="font-disp text-2xl sm:text-3xl text-white mb-3 leading-tight">
                    <span className="ar">{EXECUTIVE.ar}</span>
                    <span className="en">{EXECUTIVE.en}</span>
                  </h3>
                  <div className="text-[0.7rem] uppercase tracking-[0.28em] text-[#1F6B4F] font-bold">
                    <span className="ar">{EXECUTIVE.arRole}</span>
                    <span className="en">{EXECUTIVE.enRole}</span>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
