"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Reveal from "@/components/motion/Reveal";
import { EASE_EMPHASIS } from "@/lib/motion";

interface Member {
  ar:        string;
  en:        string;
  arRole:    string;
  enRole:    string;
  honorific?: { ar: string; en: string };
  photo?:    string;
}

const HONORIFIC = { ar: "سعادة", en: "H.E." };

const CHAIR: Member = {
  ar:    "نجلاء عبدالله أحمد الدرويشي الشامسي",
  en:    "Najla Abdullah Ahmed Al Darwishi Al Shamsi",
  arRole: "رئيسة مجلس الإدارة",
  enRole: "Chairperson",
  honorific: HONORIFIC,
  photo:  "/images/board/najla.jpg",
};

// Maitha intentionally has no `photo` — the federation page carries an
// incorrect image for her, so the card falls back to the initials avatar.
const SECRETARY: Member = {
  ar:    "ميثاء عيسى خلفان بن عيسى الذبحاني",
  en:    "Maitha Issa Khalfan bin Isa Al Dhabahi",
  arRole: "الأمين العام",
  enRole: "Secretary General",
  honorific: HONORIFIC,
};

const MEMBERS: Member[] = [
  { ar: "أروى محمد سلطان محمد العويس",        en: "Arwa Mohammed Sultan Mohammed Al Owais",  arRole: "عضو مجلس",    enRole: "Board member", honorific: HONORIFIC, photo: "/images/board/arwa.jpg"  },
  { ar: "أمينة جمعة حسن صالح الجسمي",         en: "Amina Juma Hassan Saleh Al Jasmi",        arRole: "عضو مجلس",    enRole: "Board member", honorific: HONORIFIC, photo: "/images/board/amina.jpg" },
  { ar: "إيمان محمد مبارك محمد العلي",         en: "Iman Mohammed Mubarak Mohammed Al Ali",   arRole: "عضو مجلس",    enRole: "Board member", honorific: HONORIFIC, photo: "/images/board/iman.jpg"  },
  { ar: "حمدة سالم سلطان العقروبي السويدي",  en: "Hamda Salem Sultan Al Aqroubi Al Suwaidi", arRole: "عضو مجلس",    enRole: "Board member", honorific: HONORIFIC, photo: "/images/board/hamda.jpg" },
  { ar: "علياء علي غريب أحمد المزمي",         en: "Alia Ali Gharib Ahmed Al Mazmi",          arRole: "عضو مجلس",    enRole: "Board member", honorific: HONORIFIC, photo: "/images/board/alia.jpg"  },
];

const EXECUTIVE: Member = {
  ar: "آمنة الملا",
  en: "Amna Al Mulla",
  arRole: "المدير التنفيذي",
  enRole: "Executive Director",
  photo: "/images/board/amna.jpg",
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

/**
 * Portrait — smooth fade-in for board headshots.
 * Image starts at opacity 0 with a subtle blur + slight up-scale; once
 * the browser reports it loaded (`onLoad`), it eases to fully sharp at
 * 1.0 opacity. Cached images that load instantly still get the
 * transition because state flips inside the same paint frame.
 */
function Portrait({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onLoad={() => setLoaded(true)}
      style={{ objectPosition: "50% 22%" }}
      className={`absolute inset-0 w-full h-full object-cover transition-[opacity,filter,transform] duration-720 ease-emphasis group-hover:scale-[1.03] ${
        loaded ? "opacity-100 blur-0" : "opacity-0 blur-[6px] scale-[1.04]"
      }`}
    />
  );
}

export default function BoardOfDirectors() {
  return (
    <section className="relative bg-white overflow-hidden">
      <div aria-hidden className="absolute inset-0 grain-emerald pointer-events-none" />

      <div className="relative max-w-wrap mx-auto px-4 sm:px-6 lg:px-10 py-26 sm:py-32">
        {/* Header — short, no italic accent */}
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 sm:mb-20 items-end">
            <div className="lg:col-span-7">
              <div className="text-[0.6rem] uppercase tracking-[0.32em] text-ink3 font-bold mb-5 flex items-center gap-3">
                <span className="block w-7 h-px bg-ink3" />
                <span className="ar">مجلس الإدارة</span>
                <span className="en">Board &amp; leadership</span>
              </div>
              <h2 className="font-disp text-[clamp(2.4rem,5vw,4rem)] text-ink leading-[1.06] tracking-tight max-w-3xl">
                <span className="ar">سبع عضوات إماراتيات يدِرن النادي.</span>
                <span className="en">Seven Emirati women run the club.</span>
              </h2>
            </div>
            <div className="lg:col-span-5 lg:pb-2">
              <p className="text-[0.95rem] sm:text-[1.05rem] leading-[1.85] text-ink2 max-w-md">
                <span className="ar">
                  مسؤوليات المجلس: المسار الاستراتيجي، الموازنة السنوية، اعتماد البرامج،
                  ومتابعة الإدارة التنفيذية.
                </span>
                <span className="en">
                  The board sets strategic direction, approves the annual
                  budget, ratifies programmes, and oversees the executive
                  team.
                </span>
              </p>
            </div>
          </div>
        </Reveal>

        {/* Chair — standalone row, no card beside her. The secretary follows
            in her own row below so the chairperson holds the spotlight. */}
        <div className="max-w-2xl mx-auto mb-10 sm:mb-12">
          <FeatureCard m={CHAIR} />
        </div>
        <div className="max-w-2xl mx-auto mb-16 sm:mb-20">
          <FeatureCard m={SECRETARY} />
        </div>

        {/* Roster — quieter portrait grid, no animated rings */}
        <Reveal>
          <div className="mb-7 pb-4 border-b border-stone flex items-end justify-between">
            <div className="text-[0.6rem] uppercase tracking-[0.32em] text-ink3 font-bold">
              <span className="ar">باقي أعضاء المجلس</span>
              <span className="en">Other board members</span>
            </div>
            <div className="text-[0.62rem] text-ink3 italic">
              <span className="ar">{MEMBERS.length} عضوات</span>
              <span className="en">{MEMBERS.length} members</span>
            </div>
          </div>
        </Reveal>

        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-5 gap-y-9 mb-20 sm:mb-24"
        >
          {MEMBERS.map((m, i) => (
            <motion.li
              key={i}
              variants={{
                hidden:  { opacity: 0, y: 18 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_EMPHASIS } },
              }}
              className="group"
            >
              <div className="roster-avatar mb-4 overflow-hidden">
                {m.photo ? (
                  <Portrait src={m.photo} alt={m.en} />
                ) : (
                  <div className="ini">{initials(m.en)}</div>
                )}
                <div className="veil" />
              </div>
              <div className="text-[0.55rem] uppercase tracking-[0.22em] text-ink3 font-bold mb-1.5">
                <span className="ar">{m.honorific?.ar}</span>
                <span className="en">{m.honorific?.en}</span>
              </div>
              <div className="font-disp text-[0.92rem] text-ink leading-[1.32] mb-2">
                <span className="ar">{m.ar}</span>
                <span className="en">{m.en}</span>
              </div>
              <div className="text-[0.62rem] text-ink3">
                <span className="ar">{m.arRole}</span>
                <span className="en">{m.enRole}</span>
              </div>
            </motion.li>
          ))}
        </motion.ul>

        {/* Executive — quieter dark panel, no conic-gradient ring */}
        <Reveal>
          <article className="relative overflow-hidden bg-ink text-ivory">
            <div aria-hidden className="absolute inset-0 chess-tex-lt opacity-50 pointer-events-none" />
            <div
              aria-hidden
              className="absolute -bottom-32 -right-32 w-[320px] h-[320px] rounded-full blur-3xl opacity-20 pointer-events-none"
              style={{ background: "radial-gradient(circle, #1F6B4F 0%, transparent 70%)" }}
            />
            <div aria-hidden className="absolute top-0 left-0 right-0 h-px bg-[#1F6B4F]/60" />

            <div className="relative grid grid-cols-1 md:grid-cols-12 gap-8 p-8 sm:p-12 lg:p-14 items-center">
              <div className="md:col-span-4 flex md:justify-start">
                <div className="relative w-32 h-40 sm:w-40 sm:h-48 roster-avatar overflow-hidden">
                  {EXECUTIVE.photo ? (
                    <Portrait src={EXECUTIVE.photo} alt={EXECUTIVE.en} />
                  ) : (
                    <div className="ini text-[2.6rem]">{initials(EXECUTIVE.en)}</div>
                  )}
                  <div className="veil" />
                </div>
              </div>

              <div className="md:col-span-8">
                <div className="text-[0.6rem] uppercase tracking-[0.32em] text-[#1F6B4F] font-bold mb-5 inline-flex items-center gap-2">
                  <span className="block w-7 h-px bg-[#1F6B4F]" />
                  <span className="ar">الإدارة التنفيذية</span>
                  <span className="en">Day-to-day operations</span>
                </div>
                <h3 className="font-disp text-3xl sm:text-4xl lg:text-5xl text-ivory leading-[1.06] mb-5 tracking-tight">
                  <span className="ar">{EXECUTIVE.ar}</span>
                  <span className="en">{EXECUTIVE.en}</span>
                </h3>
                <div className="text-[0.78rem] uppercase tracking-[0.22em] font-bold text-ivory/65">
                  <span className="ar">{EXECUTIVE.arRole}</span>
                  <span className="en">{EXECUTIVE.enRole}</span>
                </div>
                <p className="mt-6 text-[0.95rem] leading-[1.8] text-ivory/70 max-w-lg">
                  <span className="ar">
                    تتولى الإدارة التنفيذية تنفيذ خطط المجلس، وتنسيق العمل بين فِرق التدريب،
                    البرامج، الشراكات، والاتصال المؤسسي.
                  </span>
                  <span className="en">
                    The executive office carries out the board&rsquo;s plans
                    and coordinates between the coaching, programming,
                    partnerships, and communications teams.
                  </span>
                </p>
              </div>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}

function FeatureCard({ m }: { m: Member }) {
  return (
    <Reveal delay={0.05}>
      <article className="group relative h-full bg-white border border-stone shadow-card transition-shadow duration-480 ease-standard hover:shadow-card-hover">
        <div className="grid grid-cols-[8rem_1fr] sm:grid-cols-[10rem_1fr] gap-0 h-full">
          {/* Portrait column — photo if available, initials otherwise.
              The shared <Portrait> handles the lazy load + fade-in and
              biases the crop toward the upper-centre of the source so
              faces sit at editorial-portrait height in the 4:5 column. */}
          <div className="roster-avatar h-full min-h-[210px] overflow-hidden">
            {m.photo ? (
              <Portrait src={m.photo} alt={m.en} />
            ) : (
              <div className="ini text-[2rem]">{initials(m.en)}</div>
            )}
            <div className="veil" />
          </div>

          {/* Content column */}
          <div className="p-6 sm:p-7 flex flex-col">
            <div className="text-[0.55rem] uppercase tracking-[0.22em] text-[#0B3D2E] font-bold mb-2">
              <span className="ar">{m.honorific?.ar}</span>
              <span className="en">{m.honorific?.en}</span>
            </div>
            <h3 className="font-disp text-[1.15rem] sm:text-[1.3rem] text-ink leading-[1.25] mb-3">
              <span className="ar">{m.ar}</span>
              <span className="en">{m.en}</span>
            </h3>
            <div className="mt-auto text-[0.7rem] uppercase tracking-[0.22em] font-bold text-ink2 pt-3 border-t border-stone">
              <span className="ar">{m.arRole}</span>
              <span className="en">{m.enRole}</span>
            </div>
          </div>
        </div>
      </article>
    </Reveal>
  );
}
