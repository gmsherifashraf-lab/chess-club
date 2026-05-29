import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/layout/PageHeader";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getPartners } from "@/lib/queries/home";
import { LocaleLink } from "@/components/layout/LocaleLink";

export const revalidate = 60;

export const metadata = {
  title: "Our Events",
  description:
    "Events, ceremonies, and cultural programmes hosted by the Chess & Culture Club for Women, Sharjah through the season.",
};

interface ClubEvent {
  typeAr: string;
  typeEn: string;
  titleAr: string;
  titleEn: string;
  whenAr: string;
  whenEn: string;
  whereAr: string;
  whereEn: string;
  bodyAr: string;
  bodyEn: string;
}

/* The season's flagship event — given full prominence. */
const FEATURED: ClubEvent = {
  typeAr: "حفل",
  typeEn: "Ceremony",
  titleAr: "حفل التكريم والتقدير السنوي",
  titleEn: "Annual Awards & Recognition Evening",
  whenAr: "ختام الموسم",
  whenEn: "End of season",
  whereAr: "الشارقة، الإمارات",
  whereEn: "Sharjah, UAE",
  bodyAr:
    "أمسية النادي الكبرى التي يُحتفى فيها بإنجازات اللاعبات والمدربات والمتطوّعات على مدار الموسم، بحضور مجلس الإدارة والشركاء والضيوف.",
  bodyEn:
    "The club's flagship evening, celebrating the season's players, coaches, and volunteers before the board, partners, and invited guests.",
};

/* The rest of the season programme. */
const EVENTS: ClubEvent[] = [
  {
    typeAr: "ملتقى ثقافي",
    typeEn: "Cultural forum",
    titleAr: "ملتقى المرأة والشطرنج",
    titleEn: "Women in Chess Forum",
    whenAr: "سنوي",
    whenEn: "Annual",
    whereAr: "الشارقة",
    whereEn: "Sharjah",
    bodyAr:
      "جلسات حوارية ومحاضرات حول حضور المرأة في الشطرنج، وقصص البطلات، وآفاق المسيرة.",
    bodyEn:
      "Talks and discussion on women's place in chess, the stories of champions, and pathways in the sport.",
  },
  {
    typeAr: "مبادرة مجتمعية",
    typeEn: "Community",
    titleAr: "اليوم المفتوح للمدارس",
    titleEn: "Schools Outreach Open Day",
    whenAr: "كل فصل دراسي",
    whenEn: "Each term",
    whereAr: "الشارقة",
    whereEn: "Sharjah",
    bodyAr:
      "يوم يفتح أبواب النادي أمام طالبات المدارس للتعرّف على الشطرنج وحصص النادي.",
    bodyEn:
      "A day opening the club to schoolgirls, introducing them to chess and to the club's programmes.",
  },
  {
    typeAr: "معسكر تدريبي",
    typeEn: "Training camp",
    titleAr: "معسكر تطوير اللاعبات والمدربات",
    titleEn: "Players & Coaches Development Camp",
    whenAr: "منتصف الموسم",
    whenEn: "Mid-season",
    whereAr: "الشارقة",
    whereEn: "Sharjah",
    bodyAr:
      "برنامج مكثّف يجمع التدريب المتقدّم وتحليل المباريات وإعداد اللاعبات للبطولات.",
    bodyEn:
      "An intensive programme of advanced coaching, game analysis, and tournament preparation.",
  },
];

export default async function EventsPage() {
  const partners = await getPartners();

  return (
    <>
      <Navbar />
      <main id="main">
        <PageHeader
          kickerAr="الفعاليات"
          kickerEn="Programme"
          titleAr="فعالياتنا"
          titleEn="Our Events"
          leadAr="إلى جانب البطولات، يقدّم النادي برنامجاً من الفعاليات الثقافية والمجتمعية وحفلات التكريم على مدار الموسم."
          leadEn="Alongside its tournaments, the club runs a programme of cultural events, community initiatives, and ceremonies through the season."
          crumbs={[{ href: "/events", ar: "فعالياتنا", en: "Our Events" }]}
        />

        {/* ── The season programme ─────────────────────────────────── */}
        <section className="border-t border-line bg-white">
          <div className="mx-auto max-w-wrap px-5 py-24 sm:px-8 sm:py-28 lg:px-10">
            <SectionTitle
              eyebrowAr="برنامج الموسم"
              eyebrowEn="The Season"
              titleAr="فعاليات وبرامج النادي"
              titleEn="Events & programmes"
              size="h2"
            />

            <div className="mt-12 grid grid-cols-1 gap-7 lg:grid-cols-12 lg:gap-10">
              {/* Featured event — dark institutional card */}
              <article className="relative flex flex-col overflow-hidden rounded-[4px] bg-[linear-gradient(150deg,#0C1310_0%,#0A1F16_55%,#070B09_100%)] p-8 text-white sm:p-10 lg:col-span-7 lg:p-12">
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,#C8102E_33.3%,#fff_33.3%_66.6%,#117A4F_66.6%)]"
                />
                <div className="mb-9 flex items-center justify-between gap-4">
                  <span className="inline-flex items-center rounded-[2px] bg-scarlet-400/15 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-scarlet-300">
                    <span className="ar">{FEATURED.typeAr}</span>
                    <span className="en">{FEATURED.typeEn}</span>
                  </span>
                  <span className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-white/45">
                    <span className="ar">فعالية رئيسية</span>
                    <span className="en">Flagship event</span>
                  </span>
                </div>
                <h3 className="font-disp text-[clamp(1.7rem,3vw,2.6rem)] font-bold leading-[1.12] tracking-tight">
                  <span className="ar">{FEATURED.titleAr}</span>
                  <span className="en">{FEATURED.titleEn}</span>
                </h3>
                <p className="mt-5 max-w-xl text-[1rem] leading-relaxed text-white/75">
                  <span className="ar">{FEATURED.bodyAr}</span>
                  <span className="en">{FEATURED.bodyEn}</span>
                </p>
                <dl className="mt-9 grid grid-cols-2 gap-px overflow-hidden rounded-[3px] border border-white/12 bg-white/[0.04]">
                  <div className="bg-white/[0.02] px-5 py-4">
                    <dt className="text-[0.58rem] font-bold uppercase tracking-[0.2em] text-forest-400">
                      <span className="ar">التوقيت</span>
                      <span className="en">When</span>
                    </dt>
                    <dd className="mt-1.5 font-medium text-white/90">
                      <span className="ar">{FEATURED.whenAr}</span>
                      <span className="en">{FEATURED.whenEn}</span>
                    </dd>
                  </div>
                  <div className="bg-white/[0.02] px-5 py-4">
                    <dt className="text-[0.58rem] font-bold uppercase tracking-[0.2em] text-forest-400">
                      <span className="ar">المكان</span>
                      <span className="en">Where</span>
                    </dt>
                    <dd className="mt-1.5 font-medium text-white/90">
                      <span className="ar">{FEATURED.whereAr}</span>
                      <span className="en">{FEATURED.whereEn}</span>
                    </dd>
                  </div>
                </dl>
              </article>

              {/* Programme list */}
              <div className="flex flex-col gap-4 lg:col-span-5">
                <div className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-text-4">
                  <span className="ar">بقية برنامج الموسم</span>
                  <span className="en">Also this season</span>
                </div>
                {EVENTS.map((e) => (
                  <article
                    key={e.titleEn}
                    className="rounded-[3px] border border-line bg-white p-5 transition-[border-color,box-shadow] duration-300 ease-emphasis hover:border-line-strong hover:shadow-card sm:p-6"
                  >
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center rounded-[2px] border border-forest-700/25 px-2.5 py-0.5 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-forest-700">
                        <span className="ar">{e.typeAr}</span>
                        <span className="en">{e.typeEn}</span>
                      </span>
                      <span className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-text-4">
                        <span className="ar">{e.whenAr}</span>
                        <span className="en">{e.whenEn}</span>
                      </span>
                    </div>
                    <h3 className="mt-3 font-disp text-[1.2rem] font-bold leading-snug tracking-tight text-text-1">
                      <span className="ar">{e.titleAr}</span>
                      <span className="en">{e.titleEn}</span>
                    </h3>
                    <p className="mt-2 text-[0.9rem] leading-relaxed text-text-3">
                      <span className="ar">{e.bodyAr}</span>
                      <span className="en">{e.bodyEn}</span>
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <p className="mt-12 max-w-2xl text-[0.78rem] italic text-text-4">
              <span className="ar">
                — البرنامج أعلاه تمثيلي؛ ستُنشر المواعيد المؤكّدة في روزنامة الفعاليات.
              </span>
              <span className="en">
                — The programme above is representative; confirmed dates are
                published in the event calendar.
              </span>
            </p>
          </div>
        </section>

        {/* ── Plan your season ─────────────────────────────────────── */}
        <section className="border-t border-line bg-cream-100">
          <div className="mx-auto max-w-wrap px-5 py-24 sm:px-8 sm:py-28 lg:px-10">
            <SectionTitle
              eyebrowAr="خطّطي لموسمك"
              eyebrowEn="Plan Ahead"
              titleAr="تابعي مواعيد النادي"
              titleEn="Follow the club's schedule"
              size="h2"
            />
            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
              <CrossLink
                href="/calendar"
                titleAr="روزنامة الفعاليات"
                titleEn="Event Calendar"
                bodyAr="جدول الموسم الكامل من الفعاليات والتدريبات في موضع واحد."
                bodyEn="The full season schedule of events and training in one place."
              />
              <CrossLink
                href="/tournaments"
                titleAr="البطولات"
                titleEn="Tournaments"
                bodyAr="البطولات الرسمية القادمة وأبواب التسجيل للمشاركة."
                bodyEn="Upcoming official tournaments and how to register to compete."
              />
            </div>
          </div>
        </section>
      </main>
      <Footer partners={partners} />
    </>
  );
}

function CrossLink({
  href,
  titleAr,
  titleEn,
  bodyAr,
  bodyEn,
}: {
  href: string;
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
}) {
  return (
    <LocaleLink
      href={href}
      className="group flex items-center justify-between gap-6 rounded-[4px] border border-line bg-white p-7 transition-[transform,border-color,box-shadow] duration-300 ease-emphasis hover:-translate-y-1 hover:border-line-strong hover:shadow-card sm:p-8"
    >
      <div>
        <h3 className="font-disp text-[1.4rem] font-bold tracking-tight text-text-1 transition-colors duration-300 group-hover:text-forest-700">
          <span className="ar">{titleAr}</span>
          <span className="en">{titleEn}</span>
        </h3>
        <p className="mt-2 max-w-sm text-[0.92rem] leading-relaxed text-text-3">
          <span className="ar">{bodyAr}</span>
          <span className="en">{bodyEn}</span>
        </p>
      </div>
      <span
        aria-hidden
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line-strong text-forest-700 transition-[background-color,color,transform] duration-300 ease-emphasis group-hover:translate-x-0.5 group-hover:border-forest-700 group-hover:bg-forest-700 group-hover:text-white rtl:group-hover:-translate-x-0.5"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 rtl:rotate-180">
          <path
            d="M5 12h14M13 5l7 7-7 7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </LocaleLink>
  );
}
