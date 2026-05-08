"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { NewsItem } from "@/lib/queries/home";
import Reveal from "@/components/motion/Reveal";

const ACCENTS = ["#C8102E", "#0B3D2E", "#141414"];

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

export default function NewsPreview({ items }: { items: NewsItem[] }) {
  return (
    <section className="relative bg-ivory2">
      <div className="relative max-w-wrap mx-auto px-4 sm:px-6 lg:px-10 section-pad">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-5 mb-12 sm:mb-16">
            <div>
              <span className="eyebrow-light mb-4">
                <span className="dot-emerald" />
                <span className="ar">آخر الأخبار</span>
                <span className="en">News &amp; Media</span>
              </span>
              <h2 className="font-disp t-mega text-ink mt-5">
                <span className="ar">من قلب النادي.</span>
                <span className="en">From the heart of the club.</span>
              </h2>
            </div>
            <Link
              href="/news"
              className="inline-flex items-center gap-2 h-11 px-6 border border-ink/30 text-ink text-sm font-semibold tracking-wide hover:bg-ink hover:text-ivory hover:border-ink transition-colors"
            >
              <span className="ar">كل الأخبار ←</span>
              <span className="en">All News →</span>
            </Link>
          </div>
        </Reveal>

        {items.length === 0 ? (
          <p className="text-sm text-ink3/70">
            <span className="ar">لا توجد أخبار حالياً.</span>
            <span className="en">No news yet.</span>
          </p>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {items.map((n, i) => {
              const accent = ACCENTS[i % ACCENTS.length];
              return (
                <motion.article
                  key={n.id}
                  variants={{
                    hidden:  { opacity: 0, y: 28 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] } },
                  }}
                  whileHover={{ y: -6 }}
                  className="group relative bg-white border border-stone p-8 flex flex-col gap-4 transition-all duration-500 hover:shadow-[0_22px_50px_-25px_rgba(20,20,20,0.25)]"
                >
                  <div aria-hidden className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: accent }} />

                  {n.category && (
                    <span
                      className="self-start inline-flex items-center px-3 py-1.5 text-[0.7rem] font-bold tracking-wider uppercase"
                      style={{ background: `${accent}1A`, color: accent }}
                    >
                      {n.category}
                    </span>
                  )}
                  <h3 className="font-disp text-2xl text-ink leading-snug transition-colors duration-300 group-hover:text-[#0B3D2E]">
                    {n.title}
                  </h3>
                  {n.excerpt && (
                    <p className="text-base text-ink3 leading-relaxed line-clamp-3">
                      {n.excerpt}
                    </p>
                  )}
                  <div className="mt-auto pt-3 text-[0.75rem] uppercase tracking-[0.18em] text-ink3 font-semibold opacity-80">
                    {formatDate(n.published_at)}
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
