"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Tournament } from "@/lib/queries/home";
import Reveal from "@/components/motion/Reveal";

const ROW_ACCENT = ["#C8102E", "#1F6B4F", "#FFFFFF"];

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
    <section className="relative lux-dark lux-tex lux-section">
      <div
        aria-hidden
        className="absolute -top-32 left-0 w-[420px] h-[420px] rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, #1F6B4F 0%, transparent 65%)" }}
      />

      <div className="relative max-w-wrap mx-auto px-4 sm:px-6 lg:px-10 section-pad">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-5 mb-12 sm:mb-16">
            <div>
              <span className="eyebrow-lux mb-4">
                <span className="dot" />
                <span className="ar">البطولات القادمة</span>
                <span className="en">Upcoming Tournaments</span>
              </span>
              <h2 className="font-disp t-mega text-white mt-5">
                <span className="ar">احجزي مكانك على الرقعة.</span>
                <span className="en">Take your place on the board.</span>
              </h2>
            </div>
            <Link
              href="/tournaments"
              className="inline-flex items-center gap-2 h-11 px-6 border border-white/25 text-white/85 text-sm font-semibold tracking-wide hover:bg-white hover:text-black hover:border-white transition-colors"
            >
              <span className="ar">الكل ←</span>
              <span className="en">All →</span>
            </Link>
          </div>
        </Reveal>

        {items.length === 0 ? (
          <p className="text-sm text-white/50">
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
                  className="group flex flex-col sm:flex-row items-stretch sm:items-center gap-5 bg-white/[0.03] border border-white/10 backdrop-blur p-5 sm:p-6 transition-colors duration-500 hover:bg-white/[0.06]"
                >
                  <div
                    className="flex-shrink-0 w-24 h-24 sm:w-[104px] sm:h-[104px] flex flex-col items-center justify-center text-white"
                    style={{ background: accent === "#FFFFFF" ? "rgba(255,255,255,0.08)" : accent, border: accent === "#FFFFFF" ? "1px solid rgba(255,255,255,0.15)" : "none" }}
                  >
                    <div className="text-[0.62rem] tracking-[0.18em] opacity-90 font-semibold">{month}</div>
                    <div className="font-disp text-4xl leading-none mt-1.5 font-bold">{day}</div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-disp text-2xl text-white group-hover:text-[#1F6B4F] transition-colors leading-tight">
                      {t.name}
                    </div>
                    {t.location && (
                      <div className="mt-2 text-sm text-white/55 inline-flex items-center gap-1.5 uppercase tracking-wider font-semibold">
                        <span style={{ color: accent }}>●</span> {t.location}
                      </div>
                    )}
                    {t.description && (
                      <p className="mt-2.5 text-base text-white/65 leading-relaxed line-clamp-2">
                        {t.description}
                      </p>
                    )}
                  </div>

                  <Link
                    href="/register"
                    className="self-start sm:self-center inline-flex items-center gap-2 h-11 px-6 bg-[#0B3D2E] text-white text-sm font-semibold tracking-wide hover:bg-[#1F6B4F] transition-all hover:shadow-[0_10px_28px_rgba(31,107,79,0.45)]"
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
