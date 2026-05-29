"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { EASE_EMPHASIS } from "@/lib/motion";
import { useLang } from "@/context/LangContext";
import { withLocale } from "@/lib/i18n";
import { SectionTitle } from "@/components/ui/SectionTitle";

/* ── Honour roll ────────────────────────────────────────────────────
   A curated palmarès — the club's standing competitive record. This is
   editorial, slow-changing content (like the hero stats and QuickLinks),
   so it is held here rather than in the CMS. Entries below are
   representative; replace with the club's verified record. */

interface Honour {
  year: string;
  titleAr: string;
  titleEn: string;
  resultAr: string;
  resultEn: string;
  categoryAr: string;
  categoryEn: string;
  tone: "gold" | "green" | "ink";
}

/* The single most recent / most prestigious honour — given full prominence. */
const FEATURED: Honour = {
  year: "2024",
  titleAr: "بطولة الإمارات للشطرنج للسيدات",
  titleEn: "UAE National Women's Chess Championship",
  resultAr: "المركز الأول · فريق النادي",
  resultEn: "First place · club team",
  categoryAr: "بطولة وطنية",
  categoryEn: "National title",
  tone: "gold",
};

const HONOURS: Honour[] = [
  {
    year: "2023",
    titleAr: "بطولة الخليج للشطرنج",
    titleEn: "Gulf Chess Championship",
    resultAr: "ميداليتان · فردي السيدات",
    resultEn: "Two medals · women's individual",
    categoryAr: "إقليمي",
    categoryEn: "Regional",
    tone: "green",
  },
  {
    year: "2022",
    titleAr: "البطولة العربية للشطرنج للسيدات",
    titleEn: "Arab Women's Chess Championship",
    resultAr: "حضور على منصة التتويج",
    resultEn: "Podium finish",
    categoryAr: "إقليمي",
    categoryEn: "Regional",
    tone: "green",
  },
  {
    year: "2021",
    titleAr: "بطولة الشارقة المدرسية للشطرنج",
    titleEn: "Sharjah Schools Chess Championship",
    resultAr: "ألقاب في الفئات العمرية",
    resultEn: "Age-group titles",
    categoryAr: "تطوير الناشئات",
    categoryEn: "Youth development",
    tone: "ink",
  },
  {
    year: "2018",
    titleAr: "اعتماد الجودة الدولي ISO 9001",
    titleEn: "ISO 9001 quality accreditation",
    resultAr: "أول ناد نسائي معتمد في الإمارة",
    resultEn: "Governance milestone",
    categoryAr: "حوكمة",
    categoryEn: "Governance",
    tone: "ink",
  },
  {
    year: "1991",
    titleAr: "تأسيس النادي بمرسوم رسمي",
    titleEn: "Club founded by official decree",
    resultAr: "أقدم ناد شطرنج نسائي في الإمارات",
    resultEn: "Oldest women's chess club in the UAE",
    categoryAr: "الإرث",
    categoryEn: "Legacy",
    tone: "gold",
  },
];

const TONE_DOT: Record<Honour["tone"], string> = {
  gold: "bg-scarlet-400",
  green: "bg-forest-400",
  ink: "bg-white/35",
};

function ResultTag({ h }: { h: Honour }) {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap text-[0.62rem] font-bold uppercase tracking-[0.18em] text-white/45">
      <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${TONE_DOT[h.tone]}`} />
      <span className="ar">{h.categoryAr}</span>
      <span className="en">{h.categoryEn}</span>
    </span>
  );
}

export default function Achievements() {
  const reduce = useReducedMotion();
  const { lang } = useLang();

  const group: Variants = {
    hidden: {},
    show: {
      transition: reduce ? {} : { staggerChildren: 0.09, delayChildren: 0.08 },
    },
  };
  const rise: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 0.65, ease: EASE_EMPHASIS },
    },
  };

  return (
    <section className="relative overflow-hidden border-t border-line bg-[linear-gradient(170deg,#0C1310_0%,#0A1F16_55%,#070B09_100%)] text-white">
      {/* UAE flag hairline */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,#C8102E_33.3%,#fff_33.3%_66.6%,#117A4F_66.6%)]"
      />
      <div aria-hidden className="chess-tex-lt absolute inset-0 opacity-[0.14]" />
      {/* Oversized editorial watermark — depth, not decoration */}
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-[7vw] end-[-2vw] select-none font-disp text-[22vw] font-bold leading-none tracking-tighter text-white/[0.022]"
      >
        1991
      </span>

      <div className="relative mx-auto max-w-wrap px-5 py-24 sm:px-8 sm:py-28 lg:px-10">
        {/* ── Header ───────────────────────────────────────────────── */}
        <div className="mb-14 flex flex-col gap-6 border-b border-white/10 pb-9 sm:mb-16 lg:flex-row lg:items-end lg:justify-between">
          <SectionTitle
            eyebrowAr="سجلّ الإنجازات"
            eyebrowEn="Honour Roll"
            titleAr="ثلاثة عقود من التميّز الوطني والدولي"
            titleEn="Three decades of national and international distinction"
            size="h2"
            invert
          />
          <p className="max-w-xs text-sm leading-relaxed text-white/55 lg:text-end">
            <span className="ar">
              سجلٌّ متّصل من المشاركات والألقاب منذ تأسيس النادي عام 1991.
            </span>
            <span className="en">
              An unbroken record of competition and titles since the club
              was founded in 1991.
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
          {/* ── Featured honour ────────────────────────────────────── */}
          <motion.article
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-70px" }}
            transition={{ duration: reduce ? 0 : 0.75, ease: EASE_EMPHASIS }}
            className="relative flex flex-col justify-between gap-10 overflow-hidden rounded-[4px] border border-white/12 bg-white/[0.035] p-8 sm:p-10 lg:col-span-5"
          >
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-[3px] bg-scarlet-400"
            />
            <div>
              <div className="flex items-center gap-3 text-[0.62rem] font-bold uppercase tracking-[0.24em] text-scarlet-300">
                <span aria-hidden className="h-[2px] w-7 bg-scarlet-400" />
                <span className="ar">أحدث الإنجازات</span>
                <span className="en">Most recent honour</span>
              </div>
              <div className="mt-8 font-disp text-[clamp(4rem,7vw,6rem)] font-bold leading-none tracking-tight text-white">
                {FEATURED.year}
              </div>
              <h3 className="mt-6 font-disp text-[clamp(1.4rem,2.2vw,1.9rem)] font-bold leading-[1.18] tracking-tight text-white">
                <span className="ar">{FEATURED.titleAr}</span>
                <span className="en">{FEATURED.titleEn}</span>
              </h3>
            </div>
            <div className="border-t border-white/10 pt-6">
              <div className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-forest-400">
                <span className="ar">النتيجة</span>
                <span className="en">Result</span>
              </div>
              <p className="mt-2 text-[1.05rem] font-medium leading-snug text-white/85">
                <span className="ar">{FEATURED.resultAr}</span>
                <span className="en">{FEATURED.resultEn}</span>
              </p>
            </div>
          </motion.article>

          {/* ── Honour roll ────────────────────────────────────────── */}
          <motion.ul
            variants={group}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="lg:col-span-7"
          >
            {HONOURS.map((h, i) => (
              <motion.li key={h.year + h.titleEn} variants={rise}>
                <div
                  className={`group grid grid-cols-[3.5rem_1fr] items-baseline gap-x-5 gap-y-2 py-6 transition-colors duration-300 sm:grid-cols-[5rem_1fr_auto] sm:gap-x-7 ${
                    i === 0 ? "" : "border-t border-white/10"
                  }`}
                >
                  <span className="font-disp text-[1.6rem] font-bold tabular-nums leading-none text-forest-400 transition-colors duration-300 group-hover:text-forest-300 sm:text-[2rem]">
                    {h.year}
                  </span>
                  <div className="min-w-0">
                    <h4 className="font-disp text-[1.1rem] font-bold leading-snug tracking-tight text-white transition-colors duration-300 group-hover:text-white sm:text-[1.3rem]">
                      <span className="ar">{h.titleAr}</span>
                      <span className="en">{h.titleEn}</span>
                    </h4>
                    <p className="mt-1.5 text-[0.92rem] leading-snug text-white/55">
                      <span className="ar">{h.resultAr}</span>
                      <span className="en">{h.resultEn}</span>
                    </p>
                    <div className="mt-3 sm:hidden">
                      <ResultTag h={h} />
                    </div>
                  </div>
                  <div className="col-start-2 hidden self-center sm:col-start-3 sm:block">
                    <ResultTag h={h} />
                  </div>
                </div>
              </motion.li>
            ))}

            <motion.li variants={rise} className="border-t border-white/10 pt-8">
              <Link
                href={withLocale(lang, "/achievements")}
                className="group inline-flex items-center gap-2.5 text-[0.8rem] font-bold uppercase tracking-[0.18em] text-white/75 transition-colors hover:text-white"
              >
                <span className="ar">الاطّلاع على السجل الكامل</span>
                <span className="en">See the full competition record</span>
                <span
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                >
                  →
                </span>
              </Link>
            </motion.li>
          </motion.ul>
        </div>

        {/* Representative-data note — consistent with the gallery / partners */}
        <p className="mt-14 max-w-2xl text-[0.78rem] italic text-white/35">
          <span className="ar">
            — السجلّ أعلاه تمثيلي؛ سيُحدَّث بالنتائج الموثّقة مع تقرير الموسم.
          </span>
          <span className="en">
            — The record above is representative; it will be updated with the
            club&rsquo;s verified results in the season report.
          </span>
        </p>
      </div>
    </section>
  );
}
