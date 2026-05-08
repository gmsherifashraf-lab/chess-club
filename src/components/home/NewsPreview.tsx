"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { NewsItem } from "@/lib/queries/home";
import Reveal from "@/components/motion/Reveal";

const ACCENTS = ["#C8102E", "#1F6B4F", "#FFFFFF"];

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
    <section className="relative lux-dark lux-tex lux-section">
      <div
        aria-hidden
        className="absolute -top-32 right-1/4 w-[420px] h-[420px] rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, #1F6B4F 0%, transparent 65%)" }}
      />

      <div className="relative max-w-wrap mx-auto px-4 sm:px-6 lg:px-10 section-pad">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-5 mb-12 sm:mb-16">
            <div>
              <span className="eyebrow-lux mb-4">
                <span className="dot" />
                <span className="ar">آخر الأخبار</span>
                <span className="en">News &amp; Media</span>
              </span>
              <h2 className="font-disp t-mega text-white mt-5">
                <span className="ar">من قلب النادي.</span>
                <span className="en">From the heart of the club.</span>
              </h2>
            </div>
            <Link
              href="/news"
              className="inline-flex items-center gap-2 h-11 px-6 border border-white/25 text-white/85 text-sm font-semibold tracking-wide hover:bg-white hover:text-black hover:border-white transition-colors"
            >
              <span className="ar">كل الأخبار ←</span>
              <span className="en">All News →</span>
            </Link>
          </div>
        </Reveal>

        {items.length === 0 ? (
          <p className="text-sm text-white/50">
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
                  className="group relative bg-white/[0.03] border border-white/10 backdrop-blur p-8 flex flex-col gap-4 transition-colors duration-500 hover:bg-white/[0.06]"
                >
                  <div aria-hidden className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: accent }} />

                  {n.category && (
                    <span
                      className="self-start inline-flex items-center px-3 py-1.5 text-[0.7rem] font-bold tracking-wider uppercase"
                      style={{ background: `${accent}1F`, color: accent }}
                    >
                      {n.category}
                    </span>
                  )}
                  <h3 className="font-disp text-2xl text-white leading-snug transition-colors duration-300 group-hover:text-[#1F6B4F]">
                    {n.title}
                  </h3>
                  {n.excerpt && (
                    <p className="text-base text-white/65 leading-relaxed line-clamp-3">
                      {n.excerpt}
                    </p>
                  )}
                  <div className="mt-auto pt-3 text-[0.75rem] uppercase tracking-[0.18em] text-white/40 font-semibold">
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
