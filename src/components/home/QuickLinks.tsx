"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useLang } from "@/context/LangContext";
import { withLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/* Wayfinding band beneath the hero — four destinations into the club's
   content. An asymmetric 7/5 bento on desktop so it never reads as a flat
   identical-card grid. Branded covers follow the site's Cover/Tile pattern
   (gradient + chess texture + drifting glyph); each card accepts an
   optional `image` so real season photography can drop straight in. */

interface Destination {
  index: string;
  href: string;
  titleAr: string;
  titleEn: string;
  labelAr: string;
  labelEn: string;
  glyph: string;
  gradient: string;
  accent: string;
  span: string;
  image?: string;
}

const DESTINATIONS: Destination[] = [
  {
    index: "01",
    href: "/tournaments",
    titleAr: "البطولات",
    titleEn: "Tournaments",
    labelAr: "أكثر من أربعين لقباً وطنياً وحضور دولي راسخ",
    labelEn: "40+ national titles and a standing international record",
    glyph: "♛",
    gradient: "from-[#0A5234] via-[#0A5234] to-[#06140E]",
    accent: "bg-forest-400",
    span: "lg:col-span-7",
  },
  {
    index: "02",
    href: "/gallery",
    titleAr: "المعرض",
    titleEn: "Gallery",
    labelAr: "لقطات من التدريب والبطولات والفعاليات",
    labelEn: "Moments from training, tournaments and events",
    glyph: "♞",
    gradient: "from-[#11201A] via-[#0C1813] to-[#070B09]",
    accent: "bg-text-inverse/70",
    span: "lg:col-span-5",
  },
  {
    index: "03",
    href: "/news",
    titleAr: "غرفة الأخبار",
    titleEn: "Newsroom",
    labelAr: "آخر مستجدات النادي وإعلاناته الرسمية",
    labelEn: "Latest club updates and official announcements",
    glyph: "♜",
    gradient: "from-[#0C6340] via-[#0A4D33] to-[#06140E]",
    accent: "bg-forest-400",
    span: "lg:col-span-5",
  },
  {
    index: "04",
    href: "/register",
    titleAr: "الانضمام إلى النادي",
    titleEn: "Join the Club",
    labelAr: "ابدئي مسيرتك في الشطرنج مع بطلات الإمارات",
    labelEn: "Begin your chess journey with the UAE's champions",
    glyph: "♟",
    gradient: "from-[#A50D26] via-[#8A0A1F] to-[#350910]",
    accent: "bg-scarlet-400",
    span: "lg:col-span-7",
  },
];

function makeVariants(reduce: boolean | null): { grid: Variants; rise: Variants } {
  return {
    grid: {
      hidden: {},
      show: {
        transition: reduce ? {} : { staggerChildren: 0.1, delayChildren: 0.05 },
      },
    },
    rise: {
      hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 28 },
      show: {
        opacity: 1,
        y: 0,
        transition: { duration: reduce ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] },
      },
    },
  };
}

function Card({ d, rise, href }: { d: Destination; rise: Variants; href: string }) {
  return (
    <motion.div variants={rise} className={d.span}>
      <Link
        href={href}
        className={cn(
          "group relative flex h-[15rem] flex-col justify-end overflow-hidden rounded-[3px]",
          "shadow-card transition-[transform,box-shadow] duration-[450ms] ease-emphasis",
          "hover:-translate-y-1.5 hover:shadow-card-hover",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-700 focus-visible:ring-offset-2",
          "sm:h-[16.5rem] lg:h-[clamp(15rem,20vw,18.5rem)]",
        )}
      >
        {/* ── Branded cover (zooms on hover) ──────────────────────────── */}
        <div
          aria-hidden
          className="absolute inset-0 transition-transform duration-[850ms] ease-emphasis group-hover:scale-[1.06]"
        >
          {d.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={d.image}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <>
              <div className={cn("absolute inset-0 bg-gradient-to-br", d.gradient)} />
              <div className="chess-tex-lt absolute inset-0 opacity-50" />
              <span className="absolute -bottom-12 -end-6 select-none font-serif leading-none text-white/[0.07] text-[13rem] sm:text-[15rem] lg:text-[19rem]">
                {d.glyph}
              </span>
            </>
          )}
        </div>

        {/* legibility wash + top accent hairline */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,11,9,0.10)_0%,transparent_36%,rgba(7,11,9,0.62)_100%)]"
        />
        <span aria-hidden className={cn("absolute inset-x-0 top-0 h-[3px]", d.accent)} />

        {/* index marker */}
        <span
          aria-hidden
          className="absolute start-6 top-5 font-disp text-[0.82rem] font-bold tracking-[0.22em] text-white/45"
        >
          {d.index}
        </span>

        {/* content */}
        <div className="relative flex items-end justify-between gap-4 p-6 sm:p-7">
          <div className="min-w-0">
            <h3 className="font-disp text-[clamp(1.5rem,2.4vw,2.15rem)] font-bold leading-[1.1] text-white">
              <span className="ar">{d.titleAr}</span>
              <span className="en">{d.titleEn}</span>
            </h3>
            <p className="mt-2 max-w-[34ch] text-[0.875rem] leading-snug text-white/75">
              <span className="ar">{d.labelAr}</span>
              <span className="en">{d.labelEn}</span>
            </p>
          </div>
          <span
            aria-hidden
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/30 text-white transition-[background-color,color,transform] duration-300 ease-emphasis group-hover:translate-x-0.5 group-hover:border-white group-hover:bg-white group-hover:text-onyx-500 rtl:group-hover:-translate-x-0.5"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 rtl:rotate-180">
              <path
                d="M5 12h14M13 5l7 7-7 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export default function QuickLinks() {
  const reduce = useReducedMotion();
  const { lang } = useLang();
  const { grid, rise } = makeVariants(reduce);

  return (
    <section className="relative border-t border-line bg-white">
      <div className="mx-auto max-w-wrap px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <div className="mb-9 flex items-center gap-3 sm:mb-11">
          <span aria-hidden className="h-[2px] w-8 bg-scarlet-400" />
          <span className="text-[0.72rem] font-bold uppercase tracking-[0.24em] text-text-3">
            <span className="ar">استكشفي النادي</span>
            <span className="en">Explore the Club</span>
          </span>
        </div>

        <motion.div
          variants={grid}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-70px" }}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-12 lg:gap-4"
        >
          {DESTINATIONS.map((d) => (
            <Card key={d.href} d={d} rise={rise} href={withLocale(lang, d.href)} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
