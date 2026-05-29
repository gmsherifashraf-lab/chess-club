"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { Tournament } from "@/lib/queries/home";
import { useLang } from "@/context/LangContext";
import { withLocale } from "@/lib/i18n";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Status = "tba" | "upcoming" | "soon" | "live" | "done";

function statusOf(date: string | null, now: number): Status {
  if (!date) return "tba";
  const dt = new Date(date);
  if (isNaN(dt.getTime())) return "tba";
  const start = dt.setHours(0, 0, 0, 0);
  const end = dt.setHours(23, 59, 59, 999);
  if (now > end) return "done";
  if (now >= start && now <= end) return "live";
  const days = (start - now) / 86_400_000;
  return days <= 7 ? "soon" : "upcoming";
}

const STATUS_META: Record<
  Status,
  { ar: string; en: string; tone: "green" | "red" | "ink" }
> = {
  tba: { ar: "يُعلن لاحقاً", en: "Date TBA", tone: "ink" },
  upcoming: { ar: "قادمة", en: "Upcoming", tone: "green" },
  soon: { ar: "هذا الأسبوع", en: "This week", tone: "green" },
  live: { ar: "جارية الآن", en: "Live now", tone: "red" },
  done: { ar: "منتهية", en: "Completed", tone: "ink" },
};

function StatusPill({ status }: { status: Status }) {
  const m = STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-[2px] px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.18em]",
        m.tone === "green" && "bg-forest-700/10 text-forest-700",
        m.tone === "red" && "bg-scarlet-400/10 text-scarlet-500",
        m.tone === "ink" && "bg-text-1/[0.06] text-text-3",
      )}
    >
      {(status === "live" || status === "soon") && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            status === "live" ? "bg-scarlet-500" : "bg-forest-700",
            status === "live" && "animate-pulse",
          )}
        />
      )}
      <span className="ar">{m.ar}</span>
      <span className="en">{m.en}</span>
    </span>
  );
}

function useDateParts() {
  const { lang } = useLang();
  const locale = lang === "ar" ? "ar-AE" : "en-GB";
  return (d: string | null) => {
    if (!d) return { month: "—", day: "—", year: "" };
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return { month: "—", day: "—", year: "" };
    return {
      month: dt.toLocaleDateString(locale, { month: "short" }).toUpperCase(),
      day: String(dt.getDate()).padStart(2, "0"),
      year: String(dt.getFullYear()),
    };
  };
}

function DateBadge({
  date,
  parts,
  size = "md",
  invert = false,
}: {
  date: string | null;
  parts: ReturnType<typeof useDateParts>;
  size?: "md" | "lg";
  invert?: boolean;
}) {
  const p = parts(date);
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-[3px] border text-center leading-none",
        invert ? "border-white/15 bg-white/[0.04]" : "border-line bg-cream-100",
        size === "lg" ? "min-w-[5.5rem] p-4" : "min-w-[4.25rem] p-3",
      )}
    >
      <span
        className={cn(
          "font-bold uppercase tracking-[0.16em]",
          size === "lg" ? "text-[0.7rem]" : "text-[0.6rem]",
          invert ? "text-white/65" : "text-scarlet-500",
        )}
      >
        {p.month}
      </span>
      <span
        className={cn(
          "font-disp font-bold tabular-nums",
          size === "lg" ? "mt-1.5 text-5xl" : "mt-1 text-3xl",
          invert ? "text-white" : "text-text-1",
        )}
      >
        {p.day}
      </span>
      {p.year && (
        <span
          className={cn(
            "mt-1.5 tracking-[0.14em]",
            size === "lg" ? "text-[0.62rem]" : "text-[0.55rem]",
            invert ? "text-white/45" : "text-text-4",
          )}
        >
          {p.year}
        </span>
      )}
    </div>
  );
}

function Countdown({ date }: { date: string | null }) {
  const [left, setLeft] = useState<null | {
    d: number;
    h: number;
    m: number;
    s: number;
  }>(null);

  useEffect(() => {
    if (!date) return;
    const target = new Date(date).getTime();
    if (isNaN(target)) return;
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setLeft({ d: 0, h: 0, m: 0, s: 0 });
        return;
      }
      setLeft({
        d: Math.floor(diff / 86_400_000),
        h: Math.floor((diff / 3_600_000) % 24),
        m: Math.floor((diff / 60_000) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [date]);

  if (!left) return null;
  const units: { v: number; ar: string; en: string }[] = [
    { v: left.d, ar: "يوم", en: "Days" },
    { v: left.h, ar: "ساعة", en: "Hrs" },
    { v: left.m, ar: "دقيقة", en: "Min" },
    { v: left.s, ar: "ثانية", en: "Sec" },
  ];
  return (
    <div className="flex gap-2.5" role="timer" aria-label="Time until start">
      {units.map((u) => (
        <div
          key={u.en}
          className="min-w-[3.6rem] rounded-[3px] border border-white/12 bg-white/[0.04] px-2 py-2.5 text-center"
        >
          <div className="font-disp text-2xl font-bold tabular-nums text-white">
            {String(u.v).padStart(2, "0")}
          </div>
          <div className="mt-1 text-[0.55rem] font-semibold uppercase tracking-[0.16em] text-white/55">
            <span className="ar">{u.ar}</span>
            <span className="en">{u.en}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

const grid: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

export default function TournamentsPreview({
  items,
}: {
  items: Tournament[];
}) {
  const reduce = useReducedMotion();
  const { lang } = useLang();
  const parts = useDateParts();
  const [now, setNow] = useState<number | null>(null);

  // Resolve time-relative state after mount (SSR-safe; no hydration drift).
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const featured = items[0];
  const rest = items.slice(1);

  const rise: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 26 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 0.65, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const featStatus: Status = featured
    ? now === null
      ? "upcoming"
      : statusOf(featured.date, now)
    : "tba";
  const showCountdown =
    !!featured &&
    now !== null &&
    (featStatus === "upcoming" || featStatus === "soon");

  return (
    <section className="relative border-t border-line bg-cream-100">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_100%_0%,rgba(10,82,52,0.05)_0%,transparent_60%)]"
      />
      <div className="relative mx-auto max-w-wrap px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
        <div className="mb-12 flex flex-col gap-5 border-b border-line pb-7 sm:mb-16 sm:flex-row sm:items-end sm:justify-between">
          <SectionTitle
            eyebrowAr="رزنامة الموسم"
            eyebrowEn="Season Calendar"
            titleAr="البطولات والفعاليات القادمة"
            titleEn="Upcoming Tournaments & Events"
            size="h2"
          />
          <Link
            href={withLocale(lang, "/tournaments")}
            className="group inline-flex items-center gap-2 self-start border-b-2 border-line pb-1 text-[0.8rem] font-bold uppercase tracking-[0.2em] text-text-2 transition-colors hover:border-forest-700 hover:text-forest-700"
          >
            <span className="ar">الجدول الكامل</span>
            <span className="en">Full schedule</span>
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
            >
              →
            </span>
          </Link>
        </div>

        {!featured ? (
          <p className="py-16 text-center text-text-3">
            <span className="ar">لا توجد بطولات مجدولة حالياً.</span>
            <span className="en">No tournaments are currently scheduled.</span>
          </p>
        ) : (
          <motion.div
            variants={grid}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-70px" }}
            className="grid grid-cols-1 gap-7 lg:grid-cols-12 lg:gap-10"
          >
            {/* ── Featured fixture — premium dark card ──────────────── */}
            <motion.article
              variants={rise}
              className="group relative flex flex-col overflow-hidden rounded-[4px] bg-[linear-gradient(150deg,#0C1310_0%,#0A1F16_55%,#070B09_100%)] p-8 text-white sm:p-10 lg:col-span-7 lg:p-12"
            >
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,#C8102E_33.3%,#fff_33.3%_66.6%,#117A4F_66.6%)]"
              />
              <div className="mb-9 flex items-center justify-between gap-4">
                <StatusPill status={featStatus} />
                <span className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-white/45">
                  <span className="ar">بطولة رسمية</span>
                  <span className="en">Official fixture</span>
                </span>
              </div>

              <div className="mb-8 flex items-start gap-6 border-b border-white/10 pb-8">
                <DateBadge date={featured.date} parts={parts} size="lg" invert />
                <div className="min-w-0 flex-1">
                  <h3 className="font-disp text-[clamp(1.6rem,2.6vw,2.5rem)] font-bold leading-[1.12] tracking-tight">
                    {featured.name}
                  </h3>
                  {featured.location && (
                    <p className="mt-3 text-[0.85rem] font-medium tracking-wide text-white/65">
                      {featured.location}
                    </p>
                  )}
                </div>
              </div>

              {featured.description && (
                <p className="mb-9 max-w-xl text-[1rem] leading-relaxed text-white/75">
                  {featured.description}
                </p>
              )}

              {showCountdown && (
                <div className="mb-9">
                  <div className="mb-3 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-white/50">
                    <span className="ar">يبدأ خلال</span>
                    <span className="en">Starts in</span>
                  </div>
                  <Countdown date={featured.date} />
                </div>
              )}

              <div className="mt-auto flex flex-wrap items-center gap-4">
                <Link
                  href={withLocale(lang, "/register")}
                  className={cn(
                    buttonVariants({ variant: "primary", size: "md" }),
                  )}
                >
                  <span className="ar">سجّلي للمشاركة</span>
                  <span className="en">Register to Compete</span>
                </Link>
                <Link
                  href={withLocale(lang, "/tournaments")}
                  className="group/r inline-flex items-center gap-2 border-b border-white/25 pb-1 text-[0.78rem] font-bold uppercase tracking-[0.18em] text-white/65 transition-colors hover:border-white hover:text-white"
                >
                  <span className="ar">لائحة البطولة</span>
                  <span className="en">Regulations</span>
                </Link>
              </div>
            </motion.article>

            {/* ── Calendar list of upcoming ────────────────────────── */}
            <div className="flex flex-col gap-4 lg:col-span-5">
              <div className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-text-4">
                <span className="ar">يتبعها في الرزنامة</span>
                <span className="en">Next on the calendar</span>
              </div>

              {rest.length === 0 ? (
                <div className="flex flex-1 items-center justify-center rounded-[3px] border border-dashed border-line p-10 text-center text-sm text-text-4">
                  <span className="ar">سيُعلن عن مزيد من البطولات قريباً.</span>
                  <span className="en">More fixtures announced soon.</span>
                </div>
              ) : (
                rest.map((t) => {
                  const st: Status =
                    now === null ? "upcoming" : statusOf(t.date, now);
                  return (
                    <motion.article
                      key={t.id}
                      variants={rise}
                      className="group flex items-center gap-5 rounded-[3px] border border-line bg-white p-4 transition-all duration-300 ease-emphasis hover:-translate-y-0.5 hover:border-line-strong hover:shadow-card sm:p-5"
                    >
                      <DateBadge date={t.date} parts={parts} />
                      <div className="min-w-0 flex-1">
                        <div className="mb-1.5">
                          <StatusPill status={st} />
                        </div>
                        <h4 className="truncate font-disp text-[1.1rem] font-bold leading-snug text-text-1 transition-colors group-hover:text-forest-700">
                          {t.name}
                        </h4>
                        {t.location && (
                          <p className="mt-1 truncate text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-text-4">
                            {t.location}
                          </p>
                        )}
                      </div>
                      <Link
                        href={withLocale(lang, "/register")}
                        aria-label="Register for this tournament"
                        className="shrink-0 self-stretch border-s border-line ps-4 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-forest-700 transition-colors hover:text-forest-600"
                      >
                        <span className="flex h-full items-center gap-1">
                          <span className="ar">سجّلي</span>
                          <span className="en">Enter</span>
                          <span aria-hidden className="rtl:rotate-180">
                            →
                          </span>
                        </span>
                      </Link>
                    </motion.article>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
