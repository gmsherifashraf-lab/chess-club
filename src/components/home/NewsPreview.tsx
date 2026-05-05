"use client";

import Link from "next/link";
import type { NewsItem } from "@/lib/queries/home";

const ACCENTS = ["border-t-red", "border-t-green2", "border-t-ink"];

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
    <section className="bg-ivory2">
      <div className="max-w-wrap mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10 sm:mb-14">
          <div>
            <div className="inline-flex items-center gap-3 mb-3">
              <span className="block w-7 h-[1.5px] bg-red" />
              <span className="text-[0.65rem] uppercase tracking-[0.22em] text-red font-semibold">
                <span className="ar">آخر الأخبار</span>
                <span className="en">Latest News</span>
              </span>
            </div>
            <h2 className="font-disp text-3xl sm:text-4xl lg:text-[2.6rem] text-ink leading-tight">
              <span className="ar">من قلب النادي</span>
              <span className="en">From the Club</span>
            </h2>
          </div>
          <Link
            href="/news"
            className="inline-flex items-center gap-2 h-10 px-5 border border-ink text-ink text-xs font-semibold tracking-wide hover:bg-ink hover:text-ivory transition-colors"
          >
            <span className="ar">كل الأخبار ←</span>
            <span className="en">All News →</span>
          </Link>
        </div>

        {items.length === 0 ? (
          <p className="text-sm text-ink3 opacity-70">
            <span className="ar">لا توجد أخبار حالياً.</span>
            <span className="en">No news yet.</span>
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((n, i) => (
              <article
                key={n.id}
                className={`group bg-white border border-stone border-t-[3px] ${ACCENTS[i % ACCENTS.length]} p-7 flex flex-col gap-3 transition-all hover:-translate-y-1 hover:shadow-[0_18px_40px_-20px_rgba(20,20,20,0.25)]`}
              >
                {n.category && (
                  <span className="self-start inline-flex items-center px-2.5 py-1 text-[0.62rem] font-semibold tracking-wider uppercase bg-red/10 text-red">
                    {n.category}
                  </span>
                )}
                <h3 className="font-disp text-lg text-ink leading-snug group-hover:text-red transition-colors">
                  {n.title}
                </h3>
                {n.excerpt && (
                  <p className="text-sm text-ink3 leading-relaxed line-clamp-3">
                    {n.excerpt}
                  </p>
                )}
                <div className="mt-auto pt-2 text-[0.7rem] uppercase tracking-[0.18em] text-ink3 opacity-70">
                  {formatDate(n.published_at)}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
