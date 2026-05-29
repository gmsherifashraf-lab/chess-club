"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { NewsItem } from "@/lib/queries/home";
import { useLang } from "@/context/LangContext";
import { withLocale, type Locale } from "@/lib/i18n";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { cn } from "@/lib/utils";

/* Per-article route is CMS-ready (plan: /news/[slug]); until it exists
   every link safely resolves to the news archive. */
function href(lang: Locale, n: NewsItem) {
  return withLocale(lang, n.slug ? `/news/${n.slug}` : "/news");
}

function useDate() {
  const { lang } = useLang();
  const locale = lang === "ar" ? "ar-AE" : "en-GB";
  return {
    full: (d: string | null) =>
      d
        ? new Date(d).toLocaleDateString(locale, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "",
    stamp: (d: string | null) => {
      if (!d) return { day: "—", month: "" };
      const dt = new Date(d);
      if (isNaN(dt.getTime())) return { day: "—", month: "" };
      return {
        day: String(dt.getDate()).padStart(2, "0"),
        month: dt
          .toLocaleDateString(locale, { month: "short" })
          .toUpperCase(),
      };
    },
  };
}

/* Premium branded cover when an article has no image yet. Deterministic
   per id so the layout is stable across renders. */
function Cover({
  item,
  className,
  glyphClass,
}: {
  item: NewsItem;
  className?: string;
  glyphClass?: string;
}) {
  const glyphs = ["♛", "♞", "♚", "♜", "♝"];
  const g = glyphs[Number(String(item.id).replace(/\D/g, "") || 0) % glyphs.length];

  if (item.image_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={item.image_url}
        alt={item.title}
        className={cn(
          "h-full w-full object-cover transition-transform duration-[900ms] ease-emphasis group-hover:scale-105",
          className,
        )}
      />
    );
  }
  return (
    <div
      aria-hidden
      className={cn(
        "relative h-full w-full bg-[linear-gradient(135deg,#0A5234_0%,#0C1310_70%)] transition-transform duration-[900ms] ease-emphasis group-hover:scale-105",
        className,
      )}
    >
      <div className="chess-tex-lt absolute inset-0 opacity-40" />
      <span
        className={cn(
          "absolute -bottom-6 end-0 select-none font-serif leading-none text-white/[0.07]",
          glyphClass ?? "text-[12rem]",
        )}
      >
        {g}
      </span>
    </div>
  );
}

function Category({
  value,
  variant = "solid",
}: {
  value: string | null;
  variant?: "solid" | "ghost";
}) {
  if (!value) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[2px] px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.18em]",
        variant === "solid"
          ? "bg-forest-700 text-white"
          : "border border-forest-700/25 text-forest-700",
      )}
    >
      {value}
    </span>
  );
}

function makeVariants(reduce: boolean | null): {
  grid: Variants;
  rise: Variants;
} {
  return {
    grid: {
      hidden: {},
      show: {
        transition: reduce
          ? {}
          : { staggerChildren: 0.12, delayChildren: 0.1 },
      },
    },
    rise: {
      hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 26 },
      show: {
        opacity: 1,
        y: 0,
        transition: { duration: reduce ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] },
      },
    },
  };
}

export default function NewsPreview({ items }: { items: NewsItem[] }) {
  const reduce = useReducedMotion();
  const { lang } = useLang();
  const date = useDate();
  const { grid, rise } = makeVariants(reduce);
  const feature = items[0];
  const secondary = items.slice(1, 3);

  return (
    <section className="relative border-t border-line bg-white">
      <div className="mx-auto max-w-wrap px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
        <div className="mb-12 flex flex-col gap-5 border-b border-line pb-7 sm:mb-16 sm:flex-row sm:items-end sm:justify-between">
          <SectionTitle
            eyebrowAr="غرفة الأخبار"
            eyebrowEn="Newsroom"
            titleAr="آخر الأخبار"
            titleEn="Latest News"
            size="h2"
          />
          <Link
            href={withLocale(lang, "/news")}
            className="group inline-flex items-center gap-2 self-start border-b-2 border-line pb-1 text-[0.8rem] font-bold uppercase tracking-[0.2em] text-text-2 transition-colors hover:border-forest-700 hover:text-forest-700"
          >
            <span className="ar">الأرشيف الكامل</span>
            <span className="en">Full archive</span>
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
            >
              →
            </span>
          </Link>
        </div>

        {!feature ? (
          <p className="py-16 text-center text-text-3">
            <span className="ar">لا توجد أخبار منشورة حالياً.</span>
            <span className="en">No news published yet.</span>
          </p>
        ) : (
          <motion.div
            variants={grid}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-70px" }}
            className="grid grid-cols-1 gap-7 lg:grid-cols-12 lg:gap-10"
          >
            {/* ── Featured article ─────────────────────────────────── */}
            <motion.article
              variants={rise}
              className="group lg:col-span-7"
            >
              <Link href={href(lang, feature)} className="block">
                <div className="relative aspect-[16/10] overflow-hidden rounded-t-[3px] sm:aspect-[16/9]">
                  <Cover item={feature} glyphClass="text-[15rem]" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(7,11,9,0.62)_100%)]" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
                    <Category value={feature.category} />
                    <span className="text-right font-disp leading-none text-white">
                      <span className="block text-[0.65rem] font-bold uppercase tracking-[0.2em] opacity-75">
                        {date.stamp(feature.published_at).month}
                      </span>
                      <span className="text-4xl font-bold">
                        {date.stamp(feature.published_at).day}
                      </span>
                    </span>
                  </div>
                </div>
                <div className="border border-t-0 border-line bg-white p-7 sm:p-9 lg:p-10">
                  <h3 className="font-disp text-[clamp(1.6rem,2.6vw,2.4rem)] font-bold leading-[1.12] tracking-tight text-text-1 transition-colors duration-300 group-hover:text-forest-700">
                    {feature.title}
                  </h3>
                  {feature.excerpt && (
                    <p className="mt-5 line-clamp-3 max-w-2xl text-[1.0625rem] leading-relaxed text-text-3">
                      {feature.excerpt}
                    </p>
                  )}
                  <div className="mt-7 flex items-center justify-between gap-4 border-t border-line pt-5">
                    <span className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-text-4">
                      {date.full(feature.published_at)}
                    </span>
                    <span className="inline-flex items-center gap-2 text-[0.82rem] font-bold uppercase tracking-[0.16em] text-forest-700">
                      <span className="ar">اقرئي المقال</span>
                      <span className="en">Read story</span>
                      <span aria-hidden className="rtl:rotate-180">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>

            {/* ── Secondary grid ───────────────────────────────────── */}
            <div className="flex flex-col gap-7 lg:col-span-5">
              {secondary.length === 0 ? (
                <div className="flex flex-1 items-center justify-center rounded-[3px] border border-dashed border-line p-10 text-center text-sm text-text-4">
                  <span className="ar">المزيد من الأخبار قريباً.</span>
                  <span className="en">More stories coming soon.</span>
                </div>
              ) : (
                secondary.map((n) => (
                  <motion.article
                    key={n.id}
                    variants={rise}
                    className="group flex-1"
                  >
                    <Link
                      href={href(lang, n)}
                      className="flex h-full gap-5 overflow-hidden rounded-[3px] border border-line bg-white transition-all duration-300 ease-emphasis hover:-translate-y-1 hover:border-line-strong hover:shadow-card"
                    >
                      <div className="relative aspect-square w-28 shrink-0 overflow-hidden sm:w-36">
                        <Cover item={n} glyphClass="text-[6rem]" />
                      </div>
                      <div className="min-w-0 flex-1 py-5 pe-5">
                        <div className="mb-2 flex items-center gap-3">
                          <Category value={n.category} variant="ghost" />
                          <span className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-text-4">
                            {date.full(n.published_at)}
                          </span>
                        </div>
                        <h3 className="line-clamp-2 font-disp text-[1.15rem] font-bold leading-snug text-text-1 transition-colors duration-300 group-hover:text-forest-700">
                          {n.title}
                        </h3>
                        {n.excerpt && (
                          <p className="mt-2 line-clamp-2 text-[0.9rem] leading-relaxed text-text-3">
                            {n.excerpt}
                          </p>
                        )}
                      </div>
                    </Link>
                  </motion.article>
                ))
              )}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
