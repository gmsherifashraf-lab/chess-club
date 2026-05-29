"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import type { GalleryImage } from "@/lib/queries/home";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { cn } from "@/lib/utils";

const FALLBACK: GalleryImage[] = [
  { id: "f1", title_ar: "البطولات", title_en: "Tournaments", subtitle_ar: "بطولات الشطرنج النسائية", subtitle_en: "Women's chess championships", image_url: null, emoji: "♛", span: "wide", accent: "red", sort_order: 0 },
  { id: "f2", title_ar: "اللاعبات", title_en: "Players", subtitle_ar: "بطلات النادي", subtitle_en: "Club champions", image_url: null, emoji: "♟", span: "normal", accent: "ink", sort_order: 1 },
  { id: "f3", title_ar: "الميداليات", title_en: "Medals", subtitle_ar: "إنجازات على المنصة", subtitle_en: "Podium achievements", image_url: null, emoji: "♞", span: "normal", accent: "gold", sort_order: 2 },
  { id: "f4", title_ar: "حصص التدريب", title_en: "Training", subtitle_ar: "جلسات أسبوعية احترافية", subtitle_en: "Weekly training sessions", image_url: null, emoji: "♜", span: "tall", accent: "green", sort_order: 3 },
  { id: "f5", title_ar: "ورش العمل", title_en: "Workshops", subtitle_ar: "تطوير ذهني وثقافي", subtitle_en: "Cultural workshops", image_url: null, emoji: "♝", span: "normal", accent: "red", sort_order: 4 },
  { id: "f6", title_ar: "الفعاليات الثقافية", title_en: "Cultural events", subtitle_ar: "حضور إماراتي راقٍ", subtitle_en: "Cultural representation", image_url: null, emoji: "♚", span: "normal", accent: "ink", sort_order: 5 },
  { id: "f7", title_ar: "حفلات التكريم", title_en: "Recognition", subtitle_ar: "تتويج البطلات والمدربات", subtitle_en: "Honouring players and coaches", image_url: null, emoji: "♛", span: "wide", accent: "gold", sort_order: 6 },
  { id: "f8", title_ar: "المجتمع", title_en: "Community", subtitle_ar: "مبادرات مجتمعية", subtitle_en: "Community initiatives", image_url: null, emoji: "♟", span: "normal", accent: "green", sort_order: 7 },
];

const ACCENT_RULE: Record<GalleryImage["accent"], string> = {
  red: "bg-scarlet-400",
  green: "bg-forest-700",
  ink: "bg-text-1",
  gold: "bg-forest-700",
};
const ACCENT_GRAD: Record<GalleryImage["accent"], string> = {
  red: "from-[#A50D26] to-[#3a0a12]",
  green: "from-[#0A5234] to-[#06281A]",
  ink: "from-[#1f1f1f] to-[#080808]",
  gold: "from-[#0C6340] to-[#06281A]",
};

const gridV: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

function Tile({
  item,
  onOpen,
  rise,
}: {
  item: GalleryImage;
  onOpen?: () => void;
  rise: Variants;
}) {
  const span =
    item.span === "wide"
      ? "sm:col-span-2"
      : item.span === "tall"
        ? "row-span-2"
        : "";
  const interactive = !!onOpen;

  const inner = (
    <>
      {item.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.image_url}
          alt={item.title_en || item.title_ar}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[850ms] ease-emphasis group-hover:scale-[1.05]"
        />
      ) : (
        <>
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br",
              ACCENT_GRAD[item.accent],
            )}
          />
          <div className="chess-tex-lt absolute inset-0 opacity-40" />
          <span
            aria-hidden
            className="absolute -bottom-6 end-0 select-none font-serif leading-none text-white/[0.07] transition-transform duration-[850ms] ease-emphasis group-hover:-translate-y-1"
            style={{ fontSize: item.span === "tall" ? "20rem" : "13rem" }}
          >
            {item.emoji ?? "♛"}
          </span>
        </>
      )}

      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(7,11,9,0.72)_100%)]" />
      <span
        className={cn(
          "absolute inset-x-0 top-0 h-[3px] opacity-80",
          ACCENT_RULE[item.accent],
        )}
      />

      {interactive && (
        <span
          aria-hidden
          className="absolute end-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4">
            <path
              d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
      )}

      <div className="relative flex h-full flex-col justify-end p-5 text-white sm:p-6">
        <div className="translate-y-1.5 font-disp text-base leading-tight transition-transform duration-300 group-hover:translate-y-0 sm:text-lg">
          <span className="ar">{item.title_ar}</span>
          <span className="en">{item.title_en}</span>
        </div>
        {(item.subtitle_ar || item.subtitle_en) && (
          <div className="mt-1.5 text-[0.68rem] uppercase tracking-[0.16em] text-white/65">
            <span className="ar">{item.subtitle_ar}</span>
            <span className="en">{item.subtitle_en}</span>
          </div>
        )}
      </div>
    </>
  );

  if (interactive) {
    return (
      <motion.button
        type="button"
        variants={rise}
        onClick={onOpen}
        aria-label={`Open image: ${item.title_en || item.title_ar}`}
        className={cn(
          "group relative block cursor-pointer overflow-hidden rounded-[3px] text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-700 focus-visible:ring-offset-2",
          span,
        )}
      >
        {inner}
      </motion.button>
    );
  }

  return (
    <motion.div
      variants={rise}
      className={cn(
        "group relative block overflow-hidden rounded-[3px]",
        span,
      )}
    >
      {inner}
    </motion.div>
  );
}

export default function Gallery({
  items,
  hideHeader = false,
}: {
  items?: GalleryImage[];
  hideHeader?: boolean;
}) {
  const reduce = useReducedMotion();
  const tiles = items && items.length > 0 ? items : FALLBACK;
  const photos = tiles.filter((t) => !!t.image_url);
  const hasRealImages = photos.length > 0;

  const [index, setIndex] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  const open = (id: GalleryImage["id"]) => {
    lastFocused.current = document.activeElement as HTMLElement;
    setIndex(photos.findIndex((p) => p.id === id));
  };
  // Plain handlers — the React Compiler memoizes them; a manual useCallback
  // here can't be preserved by the compiler (it reads props-derived state).
  const close = () => {
    setIndex(null);
    lastFocused.current?.focus?.();
  };
  const step = (d: number) =>
    setIndex((i) =>
      i === null ? i : (i + d + photos.length) % photos.length,
    );

  useEffect(() => {
    if (index === null) return;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const len = photos.length;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIndex(null);
        lastFocused.current?.focus?.();
      } else if (e.key === "ArrowRight") {
        setIndex((i) => (i === null ? i : (i + 1 + len) % len));
      } else if (e.key === "ArrowLeft") {
        setIndex((i) => (i === null ? i : (i - 1 + len) % len));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [index, photos.length]);

  const rise: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 22 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const active = index === null ? null : photos[index];

  return (
    <section className="relative border-t border-line bg-cream-100">
      <div className="mx-auto max-w-wrap px-5 py-24 sm:px-8 sm:py-28 lg:px-10">
        {!hideHeader && (
          <div className="mb-12 flex flex-col gap-5 border-b border-line pb-7 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
            <SectionTitle
              eyebrowAr="المعرض"
              eyebrowEn="Gallery"
              titleAr="من التدريب والبطولات والفعاليات"
              titleEn="From Training, Tournaments & Events"
              size="h2"
            />
            <div className="flex items-center gap-3 self-start text-[0.72rem] font-bold uppercase tracking-[0.2em] text-text-4">
              <span className="h-1.5 w-1.5 rounded-full bg-forest-700" />
              <span className="ar">المعرض الرسمي · يُحدَّث كل موسم</span>
              <span className="en">Official set · updated each season</span>
            </div>
          </div>
        )}

        <motion.div
          variants={gridV}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid auto-rows-[170px] grid-cols-2 gap-2.5 sm:auto-rows-[230px] sm:grid-cols-3 sm:gap-3 lg:grid-cols-4"
        >
          {tiles.map((item) => (
            <Tile
              key={item.id}
              item={item}
              rise={rise}
              onOpen={item.image_url ? () => open(item.id) : undefined}
            />
          ))}
        </motion.div>

        {!hasRealImages && (
          <p className="mt-8 max-w-2xl text-[0.78rem] italic text-text-4">
            <span className="ar">
              — البلاطات أعلاه تمثيلية. سيُنشر الإصدار الكامل مع تقرير الموسم.
            </span>
            <span className="en">
              — The tiles above are placeholders. The full set will be
              published with the season report.
            </span>
          </p>
        )}
      </div>

      {/* ── Lightbox ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {active && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Image viewer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.25 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/92 p-4 backdrop-blur-sm sm:p-8"
            onClick={close}
          >
            <button
              ref={closeRef}
              onClick={close}
              aria-label="Close"
              className="absolute end-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {photos.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    step(-1);
                  }}
                  aria-label="Previous image"
                  className="absolute start-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 rtl:rotate-180">
                    <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    step(1);
                  }}
                  aria-label="Next image"
                  className="absolute end-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 rtl:rotate-180">
                    <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </>
            )}

            <motion.figure
              key={String(active.id)}
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
              transition={{ duration: reduce ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex max-h-[88vh] max-w-5xl flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={active.image_url ?? ""}
                alt={active.title_en || active.title_ar}
                className="max-h-[78vh] w-auto rounded-[3px] object-contain"
              />
              <figcaption className="mt-4 flex items-center justify-between gap-4 text-white">
                <div>
                  <div className="font-disp text-lg">
                    <span className="ar">{active.title_ar}</span>
                    <span className="en">{active.title_en}</span>
                  </div>
                  {(active.subtitle_ar || active.subtitle_en) && (
                    <div className="mt-1 text-[0.72rem] uppercase tracking-[0.16em] text-white/55">
                      <span className="ar">{active.subtitle_ar}</span>
                      <span className="en">{active.subtitle_en}</span>
                    </div>
                  )}
                </div>
                <span className="shrink-0 text-[0.75rem] font-semibold tabular-nums tracking-[0.16em] text-white/55">
                  {(index ?? 0) + 1} / {photos.length}
                </span>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
