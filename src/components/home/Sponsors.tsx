"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { EASE_EMPHASIS } from "@/lib/motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import type { Partner } from "@/lib/queries/home";
import { cn } from "@/lib/utils";

/* ── Partners & Supporters ──────────────────────────────────────────
   A showcase of the institutions that support the club. Names come from
   the CMS (`partners` table); the first published partner is given the
   principal-partner treatment. Falls back to a representative list when
   the CMS is empty — replace with the club's confirmed affiliations. */

const FALLBACK: Partner[] = [
  { ar: "مجلس الشارقة الرياضي", en: "Sharjah Sports Council" },
  { ar: "اتحاد الإمارات للشطرنج", en: "UAE Chess Federation" },
  { ar: "مكتب الشارقة لرياضة المرأة", en: "Sharjah Women's Sport" },
  { ar: "الاتحاد الآسيوي للشطرنج", en: "Asian Chess Federation" },
];

const CONTACT_EMAIL = "info@sharjah-women-chess.ae";

export default function Sponsors({ partners }: { partners?: Partner[] }) {
  const reduce = useReducedMotion();
  const list = partners && partners.length ? partners : FALLBACK;
  const [principal, ...rest] = list;

  const group: Variants = {
    hidden: {},
    show: {
      transition: reduce ? {} : { staggerChildren: 0.08, delayChildren: 0.06 },
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
    <section className="relative border-t border-line bg-white">
      <div className="mx-auto max-w-wrap px-5 py-24 sm:px-8 sm:py-28 lg:px-10">
        {/* ── Header ───────────────────────────────────────────────── */}
        <div className="mb-14 flex flex-col gap-6 border-b border-line pb-9 sm:mb-16 lg:flex-row lg:items-end lg:justify-between">
          <SectionTitle
            eyebrowAr="الشركاء والداعمون"
            eyebrowEn="Partners & Supporters"
            titleAr="بدعمٍ من المؤسسات التي تقف خلف الشطرنج في الإمارات"
            titleEn="Backed by the institutions behind chess in the UAE"
            size="h2"
          />
          <p className="max-w-xs text-sm leading-relaxed text-text-3 lg:text-end">
            <span className="ar">
              تعمل هذه الجهات مع النادي على تطوير شطرنج السيدات وتمثيل
              الإمارات إقليمياً ودولياً.
            </span>
            <span className="en">
              These organisations work with the club to advance women&rsquo;s
              chess and represent the UAE regionally and internationally.
            </span>
          </p>
        </div>

        <motion.div
          variants={group}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-70px" }}
          className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6"
        >
          {/* ── Principal partner ──────────────────────────────────── */}
          {principal && (
            <motion.div
              variants={rise}
              className="group relative flex flex-col justify-between gap-10 overflow-hidden rounded-[4px] border border-line bg-cream-100 p-8 transition-[border-color,box-shadow] duration-[450ms] ease-emphasis hover:border-line-strong hover:shadow-card sm:p-10 lg:col-span-5"
            >
              <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] bg-forest-700" />
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-10 -end-4 select-none font-serif text-[13rem] leading-none text-forest-700/[0.05]"
              >
                ♛
              </span>
              <div className="relative flex items-center gap-3 text-[0.62rem] font-bold uppercase tracking-[0.24em] text-forest-700">
                <span aria-hidden className="h-[2px] w-7 bg-scarlet-400" />
                <span className="ar">الشريك الرئيسي</span>
                <span className="en">Principal partner</span>
              </div>
              <div className="relative">
                <div className="font-disp text-[clamp(1.7rem,2.6vw,2.5rem)] font-bold leading-[1.15] tracking-tight text-text-1">
                  <span className="ar">{principal.ar}</span>
                  <span className="en">{principal.en}</span>
                </div>
                <p className="mt-4 text-[0.95rem] leading-relaxed text-text-3">
                  <span className="ar">
                    شريك مؤسسي في تطوير برامج النادي وتمكين لاعباته.
                  </span>
                  <span className="en">
                    An institutional partner in the club&rsquo;s programmes and
                    the development of its players.
                  </span>
                </p>
              </div>
            </motion.div>
          )}

          {/* ── Supporting partners ────────────────────────────────── */}
          <div className="lg:col-span-7">
            <div className="mb-4 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-text-4">
              <span className="ar">بالشراكة كذلك مع</span>
              <span className="en">Also in partnership with</span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {rest.map((p, i) => (
                <motion.div
                  key={p.en}
                  variants={rise}
                  className="group flex flex-col justify-between gap-8 rounded-[3px] border border-line bg-white p-6 transition-[transform,border-color,box-shadow] duration-300 ease-emphasis hover:-translate-y-1 hover:border-line-strong hover:shadow-card sm:p-7"
                >
                  <span className="font-disp text-[0.8rem] font-bold tracking-[0.2em] text-line-strong">
                    {String(i + 2).padStart(2, "0")}
                  </span>
                  <div className="font-disp text-[1.15rem] font-bold leading-[1.25] tracking-tight text-text-1 transition-colors duration-300 group-hover:text-forest-700 sm:text-[1.3rem]">
                    <span className="ar">{p.ar}</span>
                    <span className="en">{p.en}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Partnership CTA ──────────────────────────────────────── */}
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: reduce ? 0 : 0.7, ease: EASE_EMPHASIS }}
          className="mt-12 flex flex-col gap-5 border-t border-line pt-9 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="max-w-xl text-[0.95rem] leading-relaxed text-text-2">
            <span className="ar">
              مهتمّون بدعم شطرنج السيدات في الشارقة؟ يسعد النادي بالحديث عن
              فرص الشراكة والرعاية.
            </span>
            <span className="en">
              Interested in supporting women&rsquo;s chess in Sharjah? The club
              welcomes conversations about partnership and sponsorship.
            </span>
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className={cn(
              "group inline-flex shrink-0 items-center gap-2.5 self-start border-b-2 border-line pb-1 text-[0.8rem] font-bold uppercase tracking-[0.18em] text-text-2 transition-colors hover:border-forest-700 hover:text-forest-700 sm:self-auto",
            )}
          >
            <span className="ar">للتواصل بشأن الشراكة</span>
            <span className="en">Partnership enquiries</span>
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
            >
              →
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
