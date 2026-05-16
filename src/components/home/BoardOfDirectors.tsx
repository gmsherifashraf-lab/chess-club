"use client";

import { useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { cn } from "@/lib/utils";

interface Member {
  ar: string;
  en: string;
  arRole: string;
  enRole: string;
  honorific?: { ar: string; en: string };
  photo?: string;
}

const HONORIFIC = { ar: "سعادة", en: "H.E." };

const CHAIR: Member = {
  ar: "نجلاء عبدالله أحمد الدرويشي الشامسي",
  en: "Najla Abdullah Ahmed Al Darwishi Al Shamsi",
  arRole: "رئيسة مجلس الإدارة",
  enRole: "Chairperson",
  honorific: HONORIFIC,
  photo: "/images/board/najla.jpg",
};

// Maitha intentionally has no `photo` — the federation page carries an
// incorrect image for her, so the card falls back to the initials avatar.
const SECRETARY: Member = {
  ar: "ميثاء عيسى خلفان بن عيسى الذبحاني",
  en: "Maitha Issa Khalfan bin Isa Al Dhabahi",
  arRole: "الأمين العام",
  enRole: "Secretary General",
  honorific: HONORIFIC,
};

const MEMBERS: Member[] = [
  { ar: "أروى محمد سلطان محمد العويس", en: "Arwa Mohammed Sultan Mohammed Al Owais", arRole: "عضو مجلس", enRole: "Board Member", honorific: HONORIFIC, photo: "/images/board/arwa.jpg" },
  { ar: "أمينة جمعة حسن صالح الجسمي", en: "Amina Juma Hassan Saleh Al Jasmi", arRole: "عضو مجلس", enRole: "Board Member", honorific: HONORIFIC, photo: "/images/board/amina.jpg" },
  { ar: "إيمان محمد مبارك محمد العلي", en: "Iman Mohammed Mubarak Mohammed Al Ali", arRole: "عضو مجلس", enRole: "Board Member", honorific: HONORIFIC, photo: "/images/board/iman.jpg" },
  { ar: "حمدة سالم سلطان العقروبي السويدي", en: "Hamda Salem Sultan Al Aqroubi Al Suwaidi", arRole: "عضو مجلس", enRole: "Board Member", honorific: HONORIFIC, photo: "/images/board/hamda.jpg" },
  { ar: "علياء علي غريب أحمد المزمي", en: "Alia Ali Gharib Ahmed Al Mazmi", arRole: "عضو مجلس", enRole: "Board Member", honorific: HONORIFIC, photo: "/images/board/alia.jpg" },
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

function Portrait({
  m,
  className,
}: {
  m: Member;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  if (!m.photo) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center bg-[linear-gradient(150deg,#0A5234_0%,#0C1310_100%)]",
          className,
        )}
        aria-hidden
      >
        <span className="font-disp text-[clamp(2rem,4vw,3rem)] font-bold tracking-tight text-white/85">
          {initials(m.en)}
        </span>
      </div>
    );
  }
  return (
    <>
      {!loaded && <div className="absolute inset-0 bg-cream-300" aria-hidden />}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={m.photo}
        alt={m.en}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        style={{ objectPosition: "50% 20%" }}
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-[opacity,transform,filter] duration-700 ease-emphasis group-hover:scale-[1.04]",
          loaded ? "opacity-100 blur-0" : "opacity-0 blur-md",
          className,
        )}
      />
    </>
  );
}

function Honorific({ m, tone = "green" }: { m: Member; tone?: "green" | "red" }) {
  if (!m.honorific) return null;
  return (
    <div
      className={cn(
        "text-[0.62rem] font-bold uppercase tracking-[0.22em]",
        tone === "red" ? "text-scarlet-500" : "text-forest-700",
      )}
    >
      <span className="ar">{m.honorific.ar}</span>
      <span className="en">{m.honorific.en}</span>
    </div>
  );
}

const gridV: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

export default function BoardOfDirectors() {
  const reduce = useReducedMotion();
  const rise: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 0.65, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="relative border-t border-line bg-white">
      <div className="mx-auto max-w-wrap px-5 py-24 sm:px-8 sm:py-28 lg:px-10">
        <div className="mb-16 flex flex-col gap-6 sm:mb-20 lg:flex-row lg:items-end lg:justify-between">
          <SectionTitle
            eyebrowAr="الحوكمة"
            eyebrowEn="Governance"
            titleAr="مجلس الإدارة والقيادة"
            titleEn="Board of Directors & Leadership"
            leadAr="سبع عضوات إماراتيات يقُدن المسار الاستراتيجي للنادي."
            leadEn="Seven Emirati women lead the strategic direction of the club."
            size="h2"
          />
          <p className="max-w-sm text-sm leading-relaxed text-text-3 lg:text-end">
            <span className="ar">
              يضع المجلس الاتجاه الاستراتيجي، ويعتمد الموازنة السنوية
              والبرامج، ويُشرف على الإدارة التنفيذية.
            </span>
            <span className="en">
              The board sets strategic direction, approves the annual
              budget and programmes, and oversees the executive office.
            </span>
          </p>
        </div>

        {/* ── Chairperson — own row, full prominence ───────────────── */}
        <motion.article
          initial={reduce ? undefined : { opacity: 0, y: 28 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="group relative mb-6 grid grid-cols-1 overflow-hidden rounded-[4px] border border-line bg-white shadow-card transition-shadow duration-500 hover:shadow-feature sm:grid-cols-[20rem_1fr]"
        >
          <div className="relative aspect-[4/5] sm:aspect-auto sm:min-h-[26rem]">
            <Portrait m={CHAIR} />
            <div className="absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,#C8102E_33.3%,#fff_33.3%_66.6%,#117A4F_66.6%)]" />
          </div>
          <div className="flex flex-col justify-center p-8 sm:p-12">
            <Honorific m={CHAIR} />
            <h3 className="mt-3 font-disp text-[clamp(1.6rem,3vw,2.4rem)] font-bold leading-[1.15] tracking-tight text-text-1">
              <span className="ar">{CHAIR.ar}</span>
              <span className="en">{CHAIR.en}</span>
            </h3>
            <div className="mt-6 inline-flex w-fit items-center gap-3 border-t border-line pt-5 text-sm font-bold uppercase tracking-[0.2em] text-forest-700">
              <span className="h-[2px] w-7 bg-forest-700" />
              <span className="ar">{CHAIR.arRole}</span>
              <span className="en">{CHAIR.enRole}</span>
            </div>
          </div>
        </motion.article>

        {/* ── Secretary General — own row ──────────────────────────── */}
        <motion.article
          initial={reduce ? undefined : { opacity: 0, y: 24 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="group relative mb-16 grid grid-cols-[8rem_1fr] overflow-hidden rounded-[4px] border border-line bg-white transition-all duration-300 hover:border-line-strong hover:shadow-card sm:mb-20 sm:grid-cols-[12rem_1fr]"
        >
          <div className="relative aspect-square sm:aspect-auto">
            <Portrait m={SECRETARY} />
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-9">
            <Honorific m={SECRETARY} />
            <h3 className="mt-2.5 font-disp text-[1.2rem] font-bold leading-snug tracking-tight text-text-1 sm:text-[1.45rem]">
              <span className="ar">{SECRETARY.ar}</span>
              <span className="en">{SECRETARY.en}</span>
            </h3>
            <div className="mt-4 text-[0.75rem] font-bold uppercase tracking-[0.2em] text-text-3">
              <span className="ar">{SECRETARY.arRole}</span>
              <span className="en">{SECRETARY.enRole}</span>
            </div>
          </div>
        </motion.article>

        {/* ── Board roster ─────────────────────────────────────────── */}
        <div className="mb-8 flex items-end justify-between border-b border-line pb-4">
          <div className="text-[0.72rem] font-bold uppercase tracking-[0.22em] text-text-4">
            <span className="ar">أعضاء مجلس الإدارة</span>
            <span className="en">Board Members</span>
          </div>
          <div className="text-[0.72rem] font-semibold text-text-4">
            <span className="ar">{MEMBERS.length} عضوات</span>
            <span className="en">{MEMBERS.length} members</span>
          </div>
        </div>

        <motion.ul
          variants={gridV}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mb-20 grid grid-cols-2 gap-5 sm:mb-24 sm:grid-cols-3 lg:grid-cols-5"
        >
          {MEMBERS.map((m) => (
            <motion.li
              key={m.en}
              variants={rise}
              className="group overflow-hidden rounded-[3px] border border-line bg-white transition-all duration-300 ease-emphasis hover:-translate-y-1 hover:border-line-strong hover:shadow-card"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Portrait m={m} />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,rgba(7,11,9,0.45)_100%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-forest-700 transition-transform duration-500 ease-emphasis group-hover:scale-x-100 rtl:origin-right"
                />
              </div>
              <div className="p-4 sm:p-5">
                <Honorific m={m} />
                <h4 className="mt-2 font-disp text-[0.95rem] font-semibold leading-[1.3] text-text-1">
                  <span className="ar">{m.ar}</span>
                  <span className="en">{m.en}</span>
                </h4>
                <div className="mt-2.5 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-text-4">
                  <span className="ar">{m.arRole}</span>
                  <span className="en">{m.enRole}</span>
                </div>
              </div>
            </motion.li>
          ))}
        </motion.ul>

        {/* ── Executive Director — dark institutional panel ────────── */}
        <motion.article
          initial={reduce ? undefined : { opacity: 0, y: 26 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="group relative overflow-hidden rounded-[4px] bg-[linear-gradient(150deg,#0C1310_0%,#0A1F16_55%,#070B09_100%)] text-white"
        >
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,#C8102E_33.3%,#fff_33.3%_66.6%,#117A4F_66.6%)]"
          />
          <div className="grid grid-cols-1 items-center gap-8 p-8 sm:p-12 md:grid-cols-12 lg:p-14">
            <div className="md:col-span-4">
              <div className="relative aspect-[4/5] max-w-[16rem] overflow-hidden rounded-[3px] border border-white/12">
                <Portrait m={EXECUTIVE} />
              </div>
            </div>
            <div className="md:col-span-8">
              <div className="mb-5 inline-flex items-center gap-3 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-forest-400">
                <span className="h-[2px] w-7 bg-forest-400" />
                <span className="ar">الإدارة التنفيذية</span>
                <span className="en">Executive Office</span>
              </div>
              <h3 className="font-disp text-[clamp(1.8rem,4vw,3rem)] font-bold leading-[1.08] tracking-tight">
                <span className="ar">{EXECUTIVE.ar}</span>
                <span className="en">{EXECUTIVE.en}</span>
              </h3>
              <div className="mt-4 text-[0.8rem] font-bold uppercase tracking-[0.22em] text-white/65">
                <span className="ar">{EXECUTIVE.arRole}</span>
                <span className="en">{EXECUTIVE.enRole}</span>
              </div>
              <p className="mt-6 max-w-lg text-[0.95rem] leading-relaxed text-white/70">
                <span className="ar">
                  تتولى الإدارة التنفيذية تنفيذ خطط المجلس وتنسيق العمل بين
                  فرق التدريب والبرامج والشراكات والاتصال المؤسسي.
                </span>
                <span className="en">
                  The executive office carries out the board&rsquo;s plans
                  and coordinates the coaching, programmes, partnerships,
                  and communications teams.
                </span>
              </p>
            </div>
          </div>
        </motion.article>
      </div>
    </section>
  );
}
