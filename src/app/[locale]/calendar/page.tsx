import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/layout/PageHeader";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { LocaleLink } from "@/components/layout/LocaleLink";
import { buttonVariants } from "@/components/ui/Button";
import { getPartners } from "@/lib/queries/home";
import { cn } from "@/lib/utils";

export const revalidate = 60;

export const metadata = {
  title: "Event Calendar",
  description:
    "The season calendar of the Chess & Culture Club for Women, Sharjah — tournaments, training, and events in one schedule.",
};

type EntryType = "tournament" | "training" | "event";

interface Entry {
  day: string;
  weekdayAr: string;
  weekdayEn: string;
  type: EntryType;
  titleAr: string;
  titleEn: string;
  placeAr: string;
  placeEn: string;
}

interface Month {
  ar: string;
  en: string;
  entries: Entry[];
}

const TYPE_META: Record<
  EntryType,
  { ar: string; en: string; dot: string; tag: string }
> = {
  tournament: {
    ar: "بطولة",
    en: "Tournament",
    dot: "bg-scarlet-400",
    tag: "border-scarlet-400/30 text-scarlet-500",
  },
  training: {
    ar: "تدريب",
    en: "Training",
    dot: "bg-forest-700",
    tag: "border-forest-700/30 text-forest-700",
  },
  event: {
    ar: "فعالية",
    en: "Event",
    dot: "bg-text-1/40",
    tag: "border-text-1/20 text-text-2",
  },
};

/* Representative season schedule — confirmed dates are published each
   season. Entries mirror the events and tournaments shown elsewhere. */
const SCHEDULE: Month[] = [
  {
    ar: "أكتوبر",
    en: "October",
    entries: [
      {
        day: "12",
        weekdayAr: "السبت",
        weekdayEn: "Saturday",
        type: "tournament",
        titleAr: "بطولة افتتاح الموسم — شطرنج سريع",
        titleEn: "Season Opening Rapid",
        placeAr: "الشارقة",
        placeEn: "Sharjah",
      },
      {
        day: "26",
        weekdayAr: "السبت",
        weekdayEn: "Saturday",
        type: "event",
        titleAr: "اليوم المفتوح للمدارس",
        titleEn: "Schools Outreach Open Day",
        placeAr: "الشارقة",
        placeEn: "Sharjah",
      },
    ],
  },
  {
    ar: "نوفمبر",
    en: "November",
    entries: [
      {
        day: "09",
        weekdayAr: "الأحد",
        weekdayEn: "Sunday",
        type: "training",
        titleAr: "حصة فريق التطوير",
        titleEn: "Development Squad Clinic",
        placeAr: "الشارقة",
        placeEn: "Sharjah",
      },
      {
        day: "23",
        weekdayAr: "الأحد",
        weekdayEn: "Sunday",
        type: "tournament",
        titleAr: "بطولة الشارقة الكلاسيكية للسيدات",
        titleEn: "Sharjah Women's Classic",
        placeAr: "الشارقة",
        placeEn: "Sharjah",
      },
    ],
  },
  {
    ar: "ديسمبر",
    en: "December",
    entries: [
      {
        day: "14",
        weekdayAr: "الأحد",
        weekdayEn: "Sunday",
        type: "training",
        titleAr: "معسكر تطوير اللاعبات والمدربات",
        titleEn: "Players & Coaches Development Camp",
        placeAr: "الشارقة",
        placeEn: "Sharjah",
      },
      {
        day: "21",
        weekdayAr: "الأحد",
        weekdayEn: "Sunday",
        type: "event",
        titleAr: "حفل التكريم والتقدير السنوي",
        titleEn: "Annual Awards & Recognition Evening",
        placeAr: "الشارقة",
        placeEn: "Sharjah",
      },
    ],
  },
];

export default async function CalendarPage() {
  const partners = await getPartners();

  return (
    <>
      <Navbar />
      <main id="main">
        <PageHeader
          kickerAr="الرزنامة"
          kickerEn="Calendar"
          titleAr="روزنامة الفعاليات"
          titleEn="Event Calendar"
          leadAr="جدول الموسم الكامل — البطولات والتدريبات والفعاليات في رزنامة واحدة."
          leadEn="The full season schedule — tournaments, training, and events gathered into one calendar."
          crumbs={[
            { href: "/events", ar: "فعالياتنا", en: "Our Events" },
            { href: "/calendar", ar: "روزنامة الفعاليات", en: "Event Calendar" },
          ]}
        />

        {/* ── Season schedule ──────────────────────────────────────── */}
        <section className="border-t border-line bg-white">
          <div className="mx-auto max-w-wrap px-5 py-24 sm:px-8 sm:py-28 lg:px-10">
            <div className="flex flex-col gap-7 border-b border-line pb-9 sm:flex-row sm:items-end sm:justify-between">
              <SectionTitle
                eyebrowAr="الجدول"
                eyebrowEn="The Schedule"
                titleAr="رزنامة الموسم"
                titleEn="The season at a glance"
                size="h2"
              />
              {/* Legend */}
              <ul className="flex flex-wrap gap-x-6 gap-y-2.5">
                {(Object.keys(TYPE_META) as EntryType[]).map((k) => (
                  <li
                    key={k}
                    className="flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-text-3"
                  >
                    <span
                      aria-hidden
                      className={cn("h-2 w-2 rounded-full", TYPE_META[k].dot)}
                    />
                    <span className="ar">{TYPE_META[k].ar}</span>
                    <span className="en">{TYPE_META[k].en}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4">
              {SCHEDULE.map((month) => (
                <div key={month.en} className="border-b border-line py-9 sm:py-11">
                  <div className="grid grid-cols-1 gap-x-12 gap-y-6 lg:grid-cols-[14rem_1fr]">
                    {/* Month label */}
                    <div>
                      <h3 className="font-disp text-[1.75rem] font-bold tracking-tight text-text-1">
                        <span className="ar">{month.ar}</span>
                        <span className="en">{month.en}</span>
                      </h3>
                      <p className="mt-1 text-[0.72rem] font-bold uppercase tracking-[0.18em] text-text-4">
                        <span className="ar">{month.entries.length} مواعيد</span>
                        <span className="en">
                          {month.entries.length} entries
                        </span>
                      </p>
                    </div>

                    {/* Entries */}
                    <ul className="flex flex-col">
                      {month.entries.map((e, i) => {
                        const m = TYPE_META[e.type];
                        return (
                          <li
                            key={e.titleEn}
                            className={cn(
                              "group flex items-center gap-5 py-5 sm:gap-7",
                              i === 0 ? "" : "border-t border-line",
                            )}
                          >
                            {/* Date block */}
                            <div className="flex w-14 shrink-0 flex-col items-center text-center sm:w-16">
                              <span className="font-disp text-[2rem] font-bold leading-none tabular-nums text-text-1 sm:text-[2.4rem]">
                                {e.day}
                              </span>
                              <span className="mt-1 text-[0.58rem] font-bold uppercase tracking-[0.14em] text-text-4">
                                <span className="ar">{e.weekdayAr}</span>
                                <span className="en">{e.weekdayEn}</span>
                              </span>
                            </div>
                            {/* Type rule */}
                            <span
                              aria-hidden
                              className={cn(
                                "h-12 w-[3px] shrink-0 rounded-full",
                                m.dot,
                              )}
                            />
                            {/* Detail */}
                            <div className="min-w-0 flex-1">
                              <span
                                className={cn(
                                  "inline-flex items-center rounded-[2px] border px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.14em]",
                                  m.tag,
                                )}
                              >
                                <span className="ar">{m.ar}</span>
                                <span className="en">{m.en}</span>
                              </span>
                              <h4 className="mt-2 font-disp text-[1.15rem] font-bold leading-snug tracking-tight text-text-1 sm:text-[1.3rem]">
                                <span className="ar">{e.titleAr}</span>
                                <span className="en">{e.titleEn}</span>
                              </h4>
                            </div>
                            {/* Place */}
                            <span className="hidden shrink-0 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-text-4 sm:block">
                              <span className="ar">{e.placeAr}</span>
                              <span className="en">{e.placeEn}</span>
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-9 max-w-2xl text-[0.78rem] italic text-text-4">
              <span className="ar">
                — الرزنامة أعلاه تمثيلية؛ تُعتمد المواعيد النهائية وتُنشر في
                بداية كل موسم.
              </span>
              <span className="en">
                — The calendar above is representative; final dates are
                confirmed and published at the start of each season.
              </span>
            </p>
          </div>
        </section>

        {/* ── Compete CTA ──────────────────────────────────────────── */}
        <section className="border-t border-line bg-cream-100">
          <div className="mx-auto flex max-w-wrap flex-col gap-7 px-5 py-20 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
            <div className="max-w-2xl">
              <div className="mb-3 flex items-center gap-3 text-[0.62rem] font-bold uppercase tracking-[0.24em] text-forest-700">
                <span aria-hidden className="h-[2px] w-7 bg-scarlet-400" />
                <span className="ar">شاركي في الموسم</span>
                <span className="en">Take part this season</span>
              </div>
              <h2 className="font-disp text-[clamp(1.5rem,3vw,2.4rem)] font-bold leading-[1.15] tracking-tight text-text-1">
                <span className="ar">احجزي مكانك في بطولات النادي القادمة.</span>
                <span className="en">
                  Reserve your place in the club&rsquo;s upcoming tournaments.
                </span>
              </h2>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-4">
              <LocaleLink
                href="/register"
                className={cn(buttonVariants({ variant: "primary", size: "lg" }))}
              >
                <span className="ar">طلب الانضمام</span>
                <span className="en">Apply to Join</span>
              </LocaleLink>
              <LocaleLink
                href="/tournaments"
                className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}
              >
                <span className="ar">عرض البطولات</span>
                <span className="en">View Tournaments</span>
              </LocaleLink>
            </div>
          </div>
        </section>
      </main>
      <Footer partners={partners} />
    </>
  );
}
