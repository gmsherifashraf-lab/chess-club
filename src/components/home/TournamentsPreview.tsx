"use client";

import Link from "next/link";
import type { Tournament } from "@/lib/queries/home";

const ROW_BG = ["bg-red", "bg-green2", "bg-ink"];

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
    <section className="bg-white">
      <div className="max-w-wrap mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10 sm:mb-14">
          <div>
            <div className="inline-flex items-center gap-3 mb-3">
              <span className="block w-7 h-[1.5px] bg-red" />
              <span className="text-[0.65rem] uppercase tracking-[0.22em] text-red font-semibold">
                <span className="ar">البطولات القادمة</span>
                <span className="en">Upcoming Tournaments</span>
              </span>
            </div>
            <h2 className="font-disp text-3xl sm:text-4xl lg:text-[2.6rem] text-ink leading-tight">
              <span className="ar">احجزي مكانك على الرقعة</span>
              <span className="en">Take Your Place on the Board</span>
            </h2>
          </div>
          <Link
            href="/tournaments"
            className="inline-flex items-center gap-2 h-10 px-5 border border-ink text-ink text-xs font-semibold tracking-wide hover:bg-ink hover:text-ivory transition-colors"
          >
            <span className="ar">الكل ←</span>
            <span className="en">All →</span>
          </Link>
        </div>

        {items.length === 0 ? (
          <p className="text-sm text-ink3 opacity-70">
            <span className="ar">لا توجد بطولات مجدولة.</span>
            <span className="en">No tournaments scheduled.</span>
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {items.map((t, i) => {
              const { month, day } = splitDate(t.date);
              return (
                <div
                  key={t.id}
                  className="group flex flex-col sm:flex-row items-stretch sm:items-center gap-5 bg-white border border-stone p-5 sm:p-6 transition-all hover:border-red/50 hover:shadow-[0_12px_36px_-20px_rgba(20,20,20,0.25)]"
                >
                  <div className={`flex-shrink-0 ${ROW_BG[i % ROW_BG.length]} w-20 h-20 sm:w-[88px] sm:h-[88px] flex flex-col items-center justify-center text-white`}>
                    <div className="text-[0.55rem] tracking-[0.16em] opacity-80">{month}</div>
                    <div className="font-disp text-3xl leading-none mt-1">{day}</div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-disp text-lg sm:text-xl text-ink group-hover:text-red transition-colors">
                      {t.name}
                    </div>
                    {t.location && (
                      <div className="mt-1.5 text-xs text-ink3 inline-flex items-center gap-1.5 uppercase tracking-wider">
                        <span className="text-red">●</span> {t.location}
                      </div>
                    )}
                    {t.description && (
                      <p className="mt-2 text-sm text-ink3 leading-relaxed line-clamp-2">
                        {t.description}
                      </p>
                    )}
                  </div>

                  <Link
                    href="/register/tournament"
                    className="self-start sm:self-center inline-flex items-center gap-2 h-10 px-5 bg-red text-white text-xs font-semibold tracking-wide hover:bg-red-dk transition-all hover:shadow-[0_8px_24px_rgba(212,43,60,0.35)]"
                  >
                    <span className="ar">سجّلي</span>
                    <span className="en">Register</span>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
