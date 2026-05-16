"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { NewsItem } from "@/lib/queries/home";
import Reveal from "@/components/motion/Reveal";
import { EASE_EMPHASIS } from "@/lib/motion";

function formatDate(d: string | null): string {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString(undefined, {
      year: "numeric", month: "short", day: "2-digit",
    });
  } catch {
    return d;
  }
}

function dayMonth(d: string | null): { day: string; month: string } {
  if (!d) return { day: "—", month: "—" };
  try {
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return { day: "—", month: "—" };
    return {
      day:   String(dt.getDate()).padStart(2, "0"),
      month: dt.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    };
  } catch {
    return { day: "—", month: "—" };
  }
}

const ACCENTS = ["#0B3D2E", "#C8102E", "#141414"];

export default function NewsPreview({ items }: { items: NewsItem[] }) {
  const feature = items[0];
  const rest    = items.slice(1, 3);

  return (
    <section className="relative bg-ivory2 overflow-hidden">
      <div aria-hidden className="absolute inset-0 grain-emerald pointer-events-none" />

      <div className="relative max-w-wrap mx-auto px-4 sm:px-6 lg:px-10 py-20 sm:py-24">
        {/* Header — quieter, single-line */}
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10 sm:mb-14 pb-6 border-b-2 border-ink/85">
            <div>
              <div className="text-[0.6rem] uppercase tracking-[0.32em] text-ink3 font-bold mb-3 flex items-center gap-3">
                <span className="block w-7 h-px bg-ink3" />
                <span className="ar">الأخبار</span>
                <span className="en">News &amp; updates</span>
              </div>
              <h2 className="font-disp text-[clamp(2rem,3.6vw,2.8rem)] text-ink leading-[1.1] tracking-tight">
                <span className="ar">آخر ما نُشر عن النادي.</span>
                <span className="en">Recent reporting from the club.</span>
              </h2>
            </div>
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-[0.78rem] uppercase tracking-[0.22em] font-bold text-ink2 hover:text-[#0B3D2E] border-b border-ink/40 hover:border-[#0B3D2E] pb-1 transition-colors duration-280"
            >
              <span className="ar">الأرشيف الكامل</span>
              <span className="en">Full archive</span>
              <span aria-hidden>→</span>
            </Link>
          </div>
        </Reveal>

        {!feature ? (
          <p className="text-sm text-ink3/70 italic">
            <span className="ar">لا توجد أخبار حالياً.</span>
            <span className="en">No news yet.</span>
          </p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
            {/* Cover feature */}
            <FeatureArticle item={feature} />

            {/* Stacked side reading */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="text-[0.6rem] uppercase tracking-[0.32em] text-ink3 font-bold mb-5">
                <span className="ar">قراءات أخرى</span>
                <span className="en">More from the desk</span>
              </div>

              {rest.length === 0 ? (
                <div className="flex-1 flex flex-col justify-center py-10">
                  <div aria-hidden className="w-10 h-px bg-ink3/50 mb-5" />
                  <p className="text-[0.95rem] text-ink2 leading-[1.85] max-w-xs">
                    <span className="ar">هذا أحدث ما نُشر عن النادي. تُحفظ الإصدارات السابقة في الأرشيف الكامل.</span>
                    <span className="en">This is the club&rsquo;s latest dispatch. Earlier reporting is preserved in the full archive.</span>
                  </p>
                </div>
              ) : (
                <motion.ul
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } } }}
                  className="flex flex-col flex-1"
                >
                  {rest.map((n, i) => {
                    const accent = ACCENTS[(i + 1) % ACCENTS.length];
                    const dm = dayMonth(n.published_at);
                    return (
                      <motion.li
                        key={n.id}
                        variants={{
                          hidden:  { opacity: 0, x: 24 },
                          visible: { opacity: 1, x: 0, transition: { duration: 0.65, ease: EASE_EMPHASIS } },
                        }}
                        className="group relative grid grid-cols-[auto_1fr] gap-5 sm:gap-6 py-7 first:pt-0 border-b border-stone last:border-b-0 hover:bg-white/60 transition-colors"
                      >
                        {/* Date stamp */}
                        <div className="text-center pr-5 border-r border-stone min-w-[4rem]">
                          <div className="text-[0.58rem] uppercase tracking-[0.18em] text-ink3 font-bold">
                            {dm.month}
                          </div>
                          <div
                            className="font-disp text-3xl font-bold leading-none mt-1"
                            style={{ color: accent }}
                          >
                            {dm.day}
                          </div>
                        </div>

                        <div className="min-w-0">
                          {n.category && (
                            <div
                              className="inline-block text-[0.58rem] uppercase tracking-[0.22em] font-bold mb-2"
                              style={{ color: accent }}
                            >
                              {n.category}
                            </div>
                          )}
                          <h3 className="font-disp text-lg sm:text-xl text-ink leading-tight mb-2 group-hover:text-[#0B3D2E] transition-colors">
                            {n.title}
                          </h3>
                          {n.excerpt && (
                            <p className="text-[0.88rem] text-ink3 leading-[1.7] line-clamp-2">
                              {n.excerpt}
                            </p>
                          )}
                        </div>
                      </motion.li>
                    );
                  })}
                </motion.ul>
              )}

              {/* Bottom small CTA */}
              <Link
                href="/news"
                className="mt-7 in-link self-start"
              >
                <span className="ar">المزيد من الأخبار</span>
                <span className="en">More stories</span>
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function FeatureArticle({ item }: { item: NewsItem }) {
  const accent = ACCENTS[0];
  const dm = dayMonth(item.published_at);

  return (
    <Reveal delay={0.08} className="lg:col-span-7">
      <article className="group relative h-full bg-white border border-stone overflow-hidden">
        {/* Hero "image" area — gradient + glyph since news has no images */}
        <div className="relative aspect-[16/9] sm:aspect-[16/8] overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0 transition-transform duration-1000 group-hover:scale-105"
            style={{
              background:
                "linear-gradient(135deg, #0B3D2E 0%, #163d2e 60%, #050a08 100%)",
            }}
          />
          <div aria-hidden className="absolute inset-0 chess-tex-lt opacity-50" />
          <span
            aria-hidden
            className="absolute -bottom-8 -right-4 text-[16rem] leading-none select-none"
            style={{ color: "rgba(255,255,255,0.07)", fontFamily: "'Noto Sans Symbols', serif" }}
          >
            ♛
          </span>

          {/* Date stamp on hero — bottom-left, no Lead Story label */}
          <div className="absolute bottom-5 left-5 text-white">
            <div className="text-[0.6rem] uppercase tracking-[0.22em] font-bold opacity-70 mb-1">{dm.month}</div>
            <div className="font-disp text-5xl font-bold leading-none">{dm.day}</div>
          </div>
        </div>

        {/* Article body */}
        <div className="relative p-7 sm:p-9 lg:p-10">
          <div
            aria-hidden
            className="absolute top-0 left-0 right-0 h-[3px]"
            style={{ background: accent }}
          />

          {item.category && (
            <span
              className="inline-flex items-center px-3 py-1 mb-5 text-[0.62rem] font-bold tracking-[0.22em] uppercase"
              style={{ background: `${accent}1A`, color: accent }}
            >
              {item.category}
            </span>
          )}
          <h3 className="font-disp text-3xl sm:text-4xl lg:text-[2.6rem] text-ink leading-[1.06] tracking-tight mb-6 group-hover:text-[#0B3D2E] transition-colors">
            {item.title}
          </h3>
          {item.excerpt && (
            <p className="text-base sm:text-[1.05rem] leading-[1.85] text-ink2 mb-7 max-w-2xl">
              {item.excerpt}
            </p>
          )}

          <div className="flex items-center justify-between gap-4 pt-6 border-t border-stone">
            <div className="text-[0.7rem] uppercase tracking-[0.18em] text-ink3 font-bold">
              {formatDate(item.published_at)}
            </div>
            <Link href="/news" className="in-link">
              <span className="ar">اقرئي المقال</span>
              <span className="en">Read story</span>
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </article>
    </Reveal>
  );
}
