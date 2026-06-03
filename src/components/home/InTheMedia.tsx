"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { MEDIA, type MediaItem } from "@/lib/homepageMedia";
import { cn } from "@/lib/utils";

/* ── In the Media ────────────────────────────────────────────────────
   The club's coverage across UAE press and broadcast. A featured video is
   given a large cinematic frame; the remaining coverage sits in a compact
   editorial list. Mirrors the Newsroom composition so the voice stays
   consistent, while introducing mixed media (video + print). All entries
   open the original source in a new tab. */

function PlayIcon({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex items-center justify-center rounded-full bg-scarlet-500 text-white shadow-[0_10px_30px_-8px_rgba(200,16,46,0.7)] ring-1 ring-white/25 transition-transform duration-300",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" className="h-1/2 w-1/2 translate-x-[1px]" fill="currentColor">
        <path d="M8 5v14l11-7z" />
      </svg>
    </span>
  );
}

function SourceChip({ item, invert = false }: { item: MediaItem; invert?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.18em]",
        invert ? "text-white/75" : "text-text-3",
      )}
    >
      <span
        className={cn(
          "rounded-[2px] px-2 py-0.5",
          item.kind === "video"
            ? "bg-scarlet-500/12 text-scarlet-500"
            : "bg-forest-700/10 text-forest-700",
        )}
      >
        <span className="ar">{item.kind === "video" ? "فيديو" : "مقال"}</span>
        <span className="en">{item.kind === "video" ? "Video" : "Press"}</span>
      </span>
      <span className="ar">{item.sourceAr}</span>
      <span className="en">{item.sourceEn}</span>
      <span aria-hidden className="opacity-50">·</span>
      <span dir="ltr">{item.date}</span>
    </span>
  );
}

export default function InTheMedia() {
  const reduce = useReducedMotion();
  const feature = MEDIA[0];
  const rest = MEDIA.slice(1);

  const grid: Variants = {
    hidden: {},
    show: { transition: reduce ? {} : { staggerChildren: 0.12, delayChildren: 0.08 } },
  };
  const rise: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 26 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="tex-grain-soft relative overflow-hidden border-t border-line bg-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_55%_at_0%_0%,rgba(10,82,52,0.05),transparent_60%),radial-gradient(ellipse_45%_55%_at_100%_100%,rgba(200,16,46,0.04),transparent_65%)]"
      />
      <div className="relative mx-auto max-w-wrap px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
        <div className="mb-12 flex flex-col gap-5 border-b border-line pb-7 sm:mb-16 sm:flex-row sm:items-end sm:justify-between">
          <SectionTitle
            eyebrowAr="في الإعلام"
            eyebrowEn="In the Media"
            titleAr="النادي في الصحافة والإعلام الإماراتي"
            titleEn="The Club Across UAE Press & Broadcast"
            size="h2"
          />
          <p className="max-w-xs text-sm leading-relaxed text-text-3 sm:text-end">
            <span className="ar">تغطيات مختارة من تلفزيون الشارقة، الشارقة 24، وصحيفة البيان.</span>
            <span className="en">Selected coverage from Sharjah TV, Sharjah 24 and Al Bayan.</span>
          </p>
        </div>

        <motion.div
          variants={grid}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-70px" }}
          className="grid grid-cols-1 gap-7 lg:grid-cols-12 lg:gap-10"
        >
          {/* ── Featured coverage (large cinematic frame) ──────────────── */}
          <motion.article variants={rise} className="lg:col-span-7">
            <a
              href={feature.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-700 focus-visible:ring-offset-2"
            >
              <div className="zoomable relative aspect-[16/9] overflow-hidden rounded-t-[4px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={feature.cover}
                  alt={feature.altEn}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,11,9,0.10)_0%,transparent_30%,rgba(7,11,9,0.66)_100%)]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <PlayIcon className="h-[clamp(3.5rem,6vw,4.75rem)] w-[clamp(3.5rem,6vw,4.75rem)] group-hover:scale-110" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <SourceChip item={feature} invert />
                </div>
              </div>
              <div className="rounded-b-[4px] border border-t-0 border-line bg-white p-7 sm:p-9">
                <h3 className="font-disp text-[clamp(1.4rem,2.3vw,2.1rem)] font-bold leading-[1.15] tracking-tight text-text-1 transition-colors duration-300 group-hover:text-forest-700">
                  <span className="ar">{feature.titleAr}</span>
                  <span className="en">{feature.titleEn}</span>
                </h3>
                <div className="mt-6 inline-flex items-center gap-2 text-[0.82rem] font-bold uppercase tracking-[0.16em] text-scarlet-500">
                  <span className="ar">مشاهدة على يوتيوب</span>
                  <span className="en">Watch on YouTube</span>
                  <span aria-hidden className="rtl:rotate-180">→</span>
                </div>
              </div>
            </a>
          </motion.article>

          {/* ── Remaining coverage (compact list) ──────────────────────── */}
          <div className="flex flex-col gap-5 lg:col-span-5">
            {rest.map((m) => (
              <motion.article key={m.url} variants={rise} className="flex-1">
                <a
                  href={m.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full gap-5 overflow-hidden rounded-[4px] border border-line bg-white transition-all duration-300 ease-emphasis hover:-translate-y-1 hover:border-line-strong hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-700 focus-visible:ring-offset-2"
                >
                  <div className="zoomable relative aspect-[4/3] w-32 shrink-0 overflow-hidden sm:w-40">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={m.cover}
                      alt={m.altEn}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(7,11,9,0.45))]" />
                    {m.kind === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <PlayIcon className="h-10 w-10 group-hover:scale-110" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1 py-4 pe-4">
                    <div className="mb-2">
                      <SourceChip item={m} />
                    </div>
                    <h3 className="line-clamp-3 font-disp text-[1.05rem] font-bold leading-snug text-text-1 transition-colors duration-300 group-hover:text-forest-700">
                      <span className="ar">{m.titleAr}</span>
                      <span className="en">{m.titleEn}</span>
                    </h3>
                  </div>
                </a>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
