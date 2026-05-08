"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Tournament } from "@/lib/queries/home";
import Reveal from "@/components/motion/Reveal";

const ROW_ACCENT = ["#C8102E", "#0B3D2E", "#141414"];

function splitDate(d: string | null): { month: string; day: string } {
  if (!d) return { month: "TBD", day: "—" };
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return { month: "TBD", day: "—" };
  return {
    month: dt.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day: String(dt.getDate()).padStart(2, "0"),
  };
}

export default function TournamentsPreview({ items }: { items: Tournament[] }) {
  return (
    <section className="relative bg-white">
      <div className="relative max-w-wrap mx-auto px-4 sm:px-6 lg:px-10 section-pad">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-5 mb-12 sm:mb-16">
            <div>
              <span className="eyebrow-light mb-4">
                <span className="dot-emerald" />
                <span className="ar">البطولات القادمة</span>
                <span className="en">Upcoming Tournaments</span>
              </span>
              <h2 className="font-disp t-mega text-ink mt-5">
                <span className="ar">احجزي مكانك على الرقعة.</span>
                <span className="en">Take your place on the board.</span>
              </h2>
            </div>
            <Link
              href="/tournaments"
              className="inline-flex items-center gap-2 h-11 px-6 border border-ink/30 text-ink text-sm font-semibold tracking-wide hover:bg-ink hover:text-ivory hover:border-ink transition-colors"
            >
              <span className="ar">الكل ←</span>
              <span className="en">All →</span>
            </Link>
          </div>
        </Reveal>

        {items.length === 0 ? (
          <p className="text-sm text-ink3/70">
            <span className="ar">لا توجد بطولات مجدولة.</span>
            <span className="en">No tournaments scheduled.</span>
          </p>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
            className="flex flex-col gap-4"
          >
            {items.map((t, i) => {
              const { month, day } = splitDate(t.date);
              const accent = ROW_ACCENT[i % ROW_ACCENT.length];
              return (
                <motion.div
                  key={t.id}
                  variants={{
                    hidden:  { opacity: 0, y: 24 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] } },
                  }}
                  whileHover={{ y: -3 }}
                  className="group flex flex-col sm:flex-row items-stretch sm:items-center gap-5 bg-ivory2 border border-stone p-5 sm:p-6 transition-all duration-500 hover:bg-white hover:shadow-[0_18px_44px_-22px_rgba(20,20,20,0.18)]"
                >
                  <div
                    className="flex-shrink-0 w-24 h-24 sm:w-[104px] sm:h-[104px] flex flex-col items-center justify-center text-white"
                    style={{ background: accent }}
                  >
                    <div className="text-[0.62rem] tracking-[0.18em] opacity-90 font-semibold">{month}</div>
                    <div className="font-disp text-4xl leading-none mt-1.5 font-bold">{day}</div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-disp text-2xl text-ink group-hover:text-[#0B3D2E] transition-colors leading-tight">
                      {t.name}
                    </div>
                    {t.location && (
                      <div className="mt-2 text-sm text-ink3 inline-flex items-center gap-1.5 uppercase tracking-wider font-semibold">
                        <span style={{ color: accent }}>●</span> {t.location}
                      </div>
                    )}
                    {t.description && (
                      <p className="mt-2.5 text-base text-ink3 leading-relaxed line-clamp-2">
                        {t.description}
                      </p>
                    )}
                  </div>

                  <Link
                    href="/register"
                    className="self-start sm:self-center inline-flex items-center gap-2 h-11 px-6 bg-[#0B3D2E] text-white text-sm font-semibold tracking-wide hover:bg-[#1F6B4F] transition-all hover:shadow-[0_10px_28px_rgba(11,61,46,0.4)]"
                  >
                    <span className="ar">سجّلي</span>
                    <span className="en">Register</span>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
