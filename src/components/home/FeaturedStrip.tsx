"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_EMPHASIS } from "@/lib/motion";
import { useLang } from "@/context/LangContext";
import { withLocale } from "@/lib/i18n";
import { PHOTO_LIST, type HomePhoto } from "@/lib/homepageMedia";

/* ── In Focus ────────────────────────────────────────────────────────
   A cinematic, edge-to-edge highlight reel that scrolls itself. Real club
   photography, cropped to varied aspect ratios for visual rhythm, with
   hover-zoom and hover-to-pause. Each frame links into the gallery. The
   marquee track is duplicated so translateX(-50%) loops seamlessly; it
   pauses on hover and stops entirely under prefers-reduced-motion. */

// Build a long enough base sequence (so the rail always fills wide screens),
// then render it twice for the seamless -50% loop. Display ratios vary the
// crop per frame for an editorial, mixed-media cadence.
const RATIOS = [16 / 10, 3 / 4, 4 / 3, 3 / 2, 5 / 4, 16 / 9];
const BASE: HomePhoto[] = [...PHOTO_LIST, ...PHOTO_LIST];

function Frame({
  photo,
  ratio,
  href,
  ar,
}: {
  photo: HomePhoto;
  ratio: number;
  href: string;
  ar: boolean;
}) {
  return (
    <Link
      href={href}
      className="group/frame zoomable relative block h-full shrink-0 overflow-hidden rounded-[4px] ring-1 ring-white/10"
      style={{ aspectRatio: String(ratio) }}
      tabIndex={-1}
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo.src}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_42%,rgba(5,8,6,0.82))]" />
      <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 p-3.5">
        <span aria-hidden className="h-1 w-5 shrink-0 bg-forest-400" />
        <span className="truncate text-[0.62rem] font-bold uppercase tracking-[0.16em] text-white/85">
          {ar ? photo.tagAr : photo.tagEn}
        </span>
      </div>
    </Link>
  );
}

export default function FeaturedStrip() {
  const reduce = useReducedMotion();
  const { lang } = useLang();
  const ar = lang === "ar";
  const galleryHref = withLocale(lang, "/gallery");

  return (
    <section className="tex-grain relative overflow-hidden bg-[linear-gradient(180deg,#070B09_0%,#0C1310_50%,#070B09_100%)] py-16 text-white sm:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.14),transparent)]"
      />

      {/* Header */}
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: reduce ? 0 : 0.7, ease: EASE_EMPHASIS }}
        className="mx-auto mb-10 flex max-w-wrap flex-col gap-4 px-5 sm:mb-12 sm:flex-row sm:items-end sm:justify-between sm:px-8 lg:px-10"
      >
        <div>
          <span className="inline-flex items-center gap-3 text-[0.72rem] font-bold uppercase tracking-[0.24em] text-forest-400">
            <span aria-hidden className="h-[2px] w-8 bg-scarlet-400" />
            <span className="ar">من قلب النادي</span>
            <span className="en">In Focus</span>
          </span>
          <h2 className="mt-4 font-disp text-[clamp(1.6rem,3vw,2.6rem)] font-bold leading-[1.12] tracking-tight text-white">
            <span className="ar">لقطات حيّة من التدريب والبطولات والتكريم</span>
            <span className="en">Live moments from training, competition &amp; recognition</span>
          </h2>
        </div>
        <Link
          href={galleryHref}
          className="group inline-flex items-center gap-2 self-start border-b-2 border-white/20 pb-1 text-[0.78rem] font-bold uppercase tracking-[0.18em] text-white/75 transition-colors hover:border-forest-400 hover:text-white"
        >
          <span className="ar">المعرض الكامل</span>
          <span className="en">Open the gallery</span>
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1">
            →
          </span>
        </Link>
      </motion.div>

      {/* Auto-scrolling rail */}
      <div className="strip-rail edge-fade-x relative" dir="ltr">
        <div className="strip-track h-[clamp(14rem,23vw,19rem)] gap-3 px-1.5 sm:gap-4">
          {[...BASE, ...BASE].map((photo, i) => (
            <Frame
              key={i}
              photo={photo}
              ratio={RATIOS[i % RATIOS.length]}
              href={galleryHref}
              ar={ar}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
