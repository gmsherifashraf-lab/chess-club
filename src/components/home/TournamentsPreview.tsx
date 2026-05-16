"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Tournament } from "@/lib/queries/home";
import Reveal from "@/components/motion/Reveal";
import { EASE_EMPHASIS } from "@/lib/motion";

function splitDate(d: string | null): { month: string; day: string; year: string } {
  if (!d) return { month: "TBD", day: "—", year: "" };
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return { month: "TBD", day: "—", year: "" };
  return {
    month: dt.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day:   String(dt.getDate()).padStart(2, "0"),
    year:  String(dt.getFullYear()),
  };
}

export default function TournamentsPreview({ items }: { items: Tournament[] }) {
  const featured = items[0];
  const rest     = items.slice(1);

  return (
    <section className="relative bg-white overflow-hidden">
      <div aria-hidden className="absolute inset-0 grain-emerald pointer-events-none" />

      <div className="relative max-w-wrap mx-auto px-4 sm:px-6 lg:px-10 py-20 sm:py-22">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10 sm:mb-14 pb-6 border-b border-stone">
            <div>
              <div className="text-[0.6rem] uppercase tracking-[0.32em] text-ink3 font-bold mb-3 flex items-center gap-3">
                <span className="block w-7 h-px bg-ink3" />
                <span className="ar">رزنامة البطولات</span>
                <span className="en">Fixtures, this season</span>
              </div>
              <h2 className="font-disp text-[clamp(2rem,3.6vw,2.8rem)] text-ink leading-[1.1] tracking-tight max-w-xl">
                <span className="ar">المباريات القادمة المعتمدة من المجلس.</span>
                <span className="en">Upcoming matches, board-approved.</span>
              </h2>
            </div>
            <Link
              href="/tournaments"
              className="inline-flex items-center gap-2 text-[0.78rem] uppercase tracking-[0.22em] font-bold text-ink2 hover:text-[#0B3D2E] border-b border-ink/40 hover:border-[#0B3D2E] pb-1 transition-colors duration-280"
            >
              <span className="ar">الجدول الكامل</span>
              <span className="en">Full schedule</span>
              <span aria-hidden>→</span>
            </Link>
          </div>
        </Reveal>

        {!featured ? (
          <p className="text-sm text-ink3/70 italic">
            <span className="ar">لا توجد بطولات مجدولة حالياً.</span>
            <span className="en">No tournaments are currently scheduled.</span>
          </p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Featured fixture — luxe dark panel */}
            <FeaturedFixture t={featured} />

            {/* Sidebar of upcoming */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } }}
              className="lg:col-span-5 flex flex-col"
            >
              <div className="text-[0.6rem] uppercase tracking-[0.32em] text-ink3 font-bold mb-5">
                <span className="ar">يتبعها</span>
                <span className="en">Then</span>
              </div>

              {rest.length === 0 ? (
                <div className="flex-1 flex flex-col justify-center py-10">
                  <div aria-hidden className="w-10 h-px bg-ink3/50 mb-5" />
                  <p className="text-[0.95rem] text-ink2 leading-[1.85] max-w-xs">
                    <span className="ar">لا توجد مباريات أخرى مجدولة بعد. يُحدَّث الجدول الكامل فور اعتماد المجلس للمواعيد.</span>
                    <span className="en">No further fixtures are scheduled yet. The full calendar updates once the board confirms dates.</span>
                  </p>
                </div>
              ) : (
                <ul className="flex flex-col">
                  {rest.map((t) => {
                    const { month, day, year } = splitDate(t.date);
                    return (
                      <motion.li
                        key={t.id}
                        variants={{
                          hidden:  { opacity: 0, x: 24 },
                          visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE_EMPHASIS } },
                        }}
                        className="group relative grid grid-cols-[auto_1fr_auto] items-center gap-5 py-5 border-b border-stone first:border-t hover:bg-ivory2/60 transition-colors"
                      >
                        <div className="text-center pr-5 border-r border-stone min-w-[4rem]">
                          <div className="text-[0.58rem] uppercase tracking-[0.18em] text-ink3 font-bold">{month}</div>
                          <div className="font-disp text-3xl font-bold leading-none mt-1 text-ink">{day}</div>
                          {year && <div className="text-[0.58rem] tracking-wider text-ink3 mt-1 opacity-70">{year}</div>}
                        </div>

                        <div className="min-w-0">
                          <div className="font-disp text-lg sm:text-xl text-ink leading-tight group-hover:text-[#0B3D2E] transition-colors">
                            {t.name}
                          </div>
                          {t.location && (
                            <div className="mt-1 text-[0.78rem] text-ink3 uppercase tracking-[0.14em] font-semibold">
                              <span className="text-[#0B3D2E]">●</span> {t.location}
                            </div>
                          )}
                        </div>

                        <Link
                          href="/register"
                          className="text-[0.7rem] uppercase tracking-[0.18em] font-bold text-[#0B3D2E] underline-offset-4 hover:underline"
                        >
                          <span className="ar">سجّلي ←</span>
                          <span className="en">Enter →</span>
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}

function FeaturedFixture({ t }: { t: Tournament }) {
  const { month, day, year } = splitDate(t.date);
  return (
    <Reveal delay={0.05} className="lg:col-span-7">
      <article className="fixture-feature relative h-full min-h-[440px] p-8 sm:p-10 lg:p-12 flex flex-col">
        {/* Top hairline — single emerald rule */}
        <div aria-hidden className="absolute top-0 left-0 right-0 h-px bg-[#1F6B4F]/60" />

        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center justify-between gap-3 mb-9">
            <span className="inline-flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.32em] font-bold text-[#1F6B4F]">
              <span className="ds-dot live bg-[#1F6B4F]" />
              <span className="ar">القادمة هذا الأسبوع</span>
              <span className="en">Next on the calendar</span>
            </span>
            <span className="text-[0.62rem] uppercase tracking-[0.18em] text-white/45 font-semibold">
              <span className="ar">رياضية رسمية</span>
              <span className="en">Official fixture</span>
            </span>
          </div>

          {/* Date + name — editorial pairing */}
          <div className="flex items-end gap-6 sm:gap-8 mb-9 pb-9 border-b border-white/10">
            <div className="text-left pr-6 sm:pr-8 border-r border-white/15 min-w-[5rem]">
              <div className="text-[0.62rem] uppercase tracking-[0.18em] text-white/60 font-bold mb-1.5">{month}</div>
              <div className="font-disp text-6xl sm:text-7xl font-bold leading-none text-white tabular-nums">{day}</div>
              {year && <div className="text-[0.6rem] tracking-[0.18em] text-white/50 font-semibold mt-2.5">{year}</div>}
            </div>
            <div className="pb-1 flex-1 min-w-0">
              <h3 className="font-disp text-2xl sm:text-3xl lg:text-[2.4rem] text-white leading-[1.1] tracking-tight">
                {t.name}
              </h3>
              {t.location && (
                <div className="mt-3 text-[0.72rem] text-white/65 tracking-[0.06em] font-medium">
                  {t.location}
                </div>
              )}
            </div>
          </div>

          {t.description && (
            <p className="text-[0.95rem] sm:text-base text-white/75 leading-[1.85] mb-10 max-w-xl">
              {t.description}
            </p>
          )}

          {/* CTA strip — two restrained options */}
          <div className="mt-auto flex flex-wrap items-center gap-4 sm:gap-6">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 h-11 px-6 bg-white text-[#0B3D2E] text-[0.82rem] font-semibold tracking-wide hover:bg-[#1F6B4F] hover:text-white transition-colors duration-280 ease-standard"
            >
              <span className="ar">تسجيل اللاعبات</span>
              <span className="en">Register a player</span>
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/tournaments"
              className="text-[0.78rem] uppercase tracking-[0.22em] font-bold text-white/65 hover:text-white pb-1 border-b border-white/25 hover:border-white transition-colors duration-280"
            >
              <span className="ar">لائحة المباراة</span>
              <span className="en">Match regulations</span>
            </Link>
          </div>
        </div>
      </article>
    </Reveal>
  );
}
