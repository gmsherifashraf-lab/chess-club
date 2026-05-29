import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/layout/PageHeader";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getPartners } from "@/lib/queries/home";

export const revalidate = 60;

export const metadata = {
  title: "Achievements",
  description:
    "The competitive record and honours of the Chess & Culture Club for Women, Sharjah — national titles, regional medals, and three decades of distinction since 1991.",
};

/* Headline figures for the competitive record. */
const TALLY: { value: string; ar: string; en: string; accent?: "red" }[] = [
  { value: "40+", ar: "لقب وطني", en: "National titles" },
  { value: "25+", ar: "منصّة إقليمية ودولية", en: "Regional & international podiums" },
  { value: "120+", ar: "لقب في البطولات", en: "Tournament titles" },
  { value: "1991", ar: "في المنافسة منذ", en: "Competing since", accent: "red" },
];

interface Honour {
  year: string;
  titleAr: string;
  titleEn: string;
  resultAr: string;
  resultEn: string;
  categoryAr: string;
  categoryEn: string;
  tone: "gold" | "green" | "ink";
}

const FEATURED: Honour = {
  year: "2024",
  titleAr: "بطولة الإمارات للشطرنج للسيدات",
  titleEn: "UAE National Women's Chess Championship",
  resultAr: "المركز الأول · فريق النادي",
  resultEn: "First place · club team",
  categoryAr: "بطولة وطنية",
  categoryEn: "National title",
  tone: "gold",
};

/* The full chronological record. Representative entries — replace with
   the club's verified results. */
const HONOURS: Honour[] = [
  {
    year: "2023",
    titleAr: "بطولة الخليج للشطرنج",
    titleEn: "Gulf Chess Championship",
    resultAr: "ميداليتان · فردي السيدات",
    resultEn: "Two medals · women's individual",
    categoryAr: "إقليمي",
    categoryEn: "Regional",
    tone: "green",
  },
  {
    year: "2023",
    titleAr: "بطولة الإمارات للشطرنج السريع للسيدات",
    titleEn: "UAE Women's Rapid Chess Championship",
    resultAr: "حضور على منصّة التتويج",
    resultEn: "Podium finishes",
    categoryAr: "وطني",
    categoryEn: "National",
    tone: "green",
  },
  {
    year: "2022",
    titleAr: "البطولة العربية للشطرنج للسيدات",
    titleEn: "Arab Women's Chess Championship",
    resultAr: "حضور على منصّة التتويج",
    resultEn: "Podium finish",
    categoryAr: "إقليمي",
    categoryEn: "Regional",
    tone: "green",
  },
  {
    year: "2021",
    titleAr: "بطولة الشارقة المدرسية للشطرنج",
    titleEn: "Sharjah Schools Chess Championship",
    resultAr: "ألقاب في الفئات العمرية",
    resultEn: "Age-group titles",
    categoryAr: "تطوير الناشئات",
    categoryEn: "Youth development",
    tone: "ink",
  },
  {
    year: "2020",
    titleAr: "الدوري الوطني للشطرنج عبر الإنترنت",
    titleEn: "National Online Chess League",
    resultAr: "ضمن المراكز الأربعة الأولى",
    resultEn: "Top-four finish",
    categoryAr: "وطني",
    categoryEn: "National",
    tone: "ink",
  },
  {
    year: "2019",
    titleAr: "مشاركات الفرق الآسيوية",
    titleEn: "Asian team competitions",
    resultAr: "تمثيل دولي للنادي",
    resultEn: "International representation",
    categoryAr: "دولي",
    categoryEn: "International",
    tone: "green",
  },
  {
    year: "2018",
    titleAr: "اعتماد الجودة الدولي ISO 9001",
    titleEn: "ISO 9001 quality accreditation",
    resultAr: "أول ناد نسائي معتمد في الإمارة",
    resultEn: "Governance milestone",
    categoryAr: "حوكمة",
    categoryEn: "Governance",
    tone: "ink",
  },
  {
    year: "2011",
    titleAr: "عقدان من المنافسة المتواصلة",
    titleEn: "Two decades of continuous competition",
    resultAr: "حضور ثابت في بطولات الدولة",
    resultEn: "A sustained presence in national chess",
    categoryAr: "الإرث",
    categoryEn: "Legacy",
    tone: "ink",
  },
  {
    year: "1991",
    titleAr: "تأسيس النادي بمرسوم رسمي",
    titleEn: "Club founded by official decree",
    resultAr: "أقدم ناد شطرنج نسائي في الإمارات",
    resultEn: "Oldest women's chess club in the UAE",
    categoryAr: "الإرث",
    categoryEn: "Legacy",
    tone: "gold",
  },
];

const TONE_DOT: Record<Honour["tone"], string> = {
  gold: "bg-scarlet-400",
  green: "bg-forest-700",
  ink: "bg-text-1/30",
};

function CategoryTag({ h }: { h: Honour }) {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap text-[0.62rem] font-bold uppercase tracking-[0.18em] text-text-4">
      <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${TONE_DOT[h.tone]}`} />
      <span className="ar">{h.categoryAr}</span>
      <span className="en">{h.categoryEn}</span>
    </span>
  );
}

export default async function AchievementsPage() {
  const partners = await getPartners();

  return (
    <>
      <Navbar />
      <main id="main">
        <PageHeader
          kickerAr="سجلّ الإنجازات"
          kickerEn="Honour Roll"
          titleAr="الإنجازات"
          titleEn="Achievements"
          leadAr="سجلٌّ متّصل من المشاركات والألقاب الوطنية والدولية منذ تأسيس النادي عام 1991."
          leadEn="An unbroken record of national and international honours since the club was founded in 1991."
          crumbs={[
            { href: "/about", ar: "عن النادي", en: "About Us" },
            { href: "/achievements", ar: "الإنجازات", en: "Achievements" },
          ]}
        />

        {/* ── Honours at a glance ──────────────────────────────────── */}
        <section className="border-t border-line bg-white">
          <div className="mx-auto max-w-wrap px-5 py-24 sm:px-8 sm:py-28 lg:px-10">
            <SectionTitle
              eyebrowAr="لمحة"
              eyebrowEn="At a Glance"
              titleAr="السجلّ التنافسي للنادي"
              titleEn="The club's competitive record"
              leadAr="حصيلة ثلاثة عقود من تمثيل الشارقة ودولة الإمارات على رقعة الشطرنج."
              leadEn="The product of three decades representing Sharjah and the UAE on the chessboard."
              size="h2"
            />
            <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-[4px] border border-line bg-line/60 lg:grid-cols-4">
              {TALLY.map((t) => (
                <div key={t.en} className="bg-white px-6 py-9 sm:py-11">
                  <dt
                    className={`font-disp text-[2.75rem] font-bold leading-none tabular-nums sm:text-[3.4rem] ${
                      t.accent === "red" ? "text-scarlet-500" : "text-forest-700"
                    }`}
                  >
                    {t.value}
                  </dt>
                  <dd className="mt-4 text-[0.8rem] font-semibold uppercase leading-snug tracking-[0.14em] text-text-3">
                    <span className="ar">{t.ar}</span>
                    <span className="en">{t.en}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── The honour roll ──────────────────────────────────────── */}
        <section className="border-t border-line bg-cream-100">
          <div className="mx-auto max-w-wrap px-5 py-24 sm:px-8 sm:py-28 lg:px-10">
            <SectionTitle
              eyebrowAr="السجلّ"
              eyebrowEn="The Record"
              titleAr="سجلّ الإنجازات الكامل"
              titleEn="The full honour roll"
              size="h2"
            />

            <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
              {/* Featured most-recent honour */}
              <article className="relative flex flex-col justify-between gap-10 overflow-hidden rounded-[4px] border border-line bg-white p-8 shadow-card sm:p-10 lg:col-span-5">
                <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] bg-scarlet-400" />
                <div>
                  <div className="flex items-center gap-3 text-[0.62rem] font-bold uppercase tracking-[0.24em] text-scarlet-500">
                    <span aria-hidden className="h-[2px] w-7 bg-scarlet-400" />
                    <span className="ar">أحدث الإنجازات</span>
                    <span className="en">Most recent honour</span>
                  </div>
                  <div className="mt-8 font-disp text-[clamp(4rem,7vw,6rem)] font-bold leading-none tracking-tight text-text-1">
                    {FEATURED.year}
                  </div>
                  <h3 className="mt-6 font-disp text-[clamp(1.4rem,2.2vw,1.9rem)] font-bold leading-[1.18] tracking-tight text-text-1">
                    <span className="ar">{FEATURED.titleAr}</span>
                    <span className="en">{FEATURED.titleEn}</span>
                  </h3>
                </div>
                <div className="border-t border-line pt-6">
                  <div className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-forest-700">
                    <span className="ar">النتيجة</span>
                    <span className="en">Result</span>
                  </div>
                  <p className="mt-2 text-[1.05rem] font-medium leading-snug text-text-1">
                    <span className="ar">{FEATURED.resultAr}</span>
                    <span className="en">{FEATURED.resultEn}</span>
                  </p>
                </div>
              </article>

              {/* Chronological list */}
              <ul className="lg:col-span-7">
                {HONOURS.map((h, i) => (
                  <li key={h.year + h.titleEn}>
                    <div
                      className={`group grid grid-cols-[3.5rem_1fr] items-baseline gap-x-5 gap-y-2 py-6 sm:grid-cols-[5rem_1fr_auto] sm:gap-x-7 ${
                        i === 0 ? "" : "border-t border-line"
                      }`}
                    >
                      <span className="font-disp text-[1.6rem] font-bold tabular-nums leading-none text-forest-700 sm:text-[2rem]">
                        {h.year}
                      </span>
                      <div className="min-w-0">
                        <h4 className="font-disp text-[1.1rem] font-bold leading-snug tracking-tight text-text-1 sm:text-[1.3rem]">
                          <span className="ar">{h.titleAr}</span>
                          <span className="en">{h.titleEn}</span>
                        </h4>
                        <p className="mt-1.5 text-[0.92rem] leading-snug text-text-3">
                          <span className="ar">{h.resultAr}</span>
                          <span className="en">{h.resultEn}</span>
                        </p>
                        <div className="mt-3 sm:hidden">
                          <CategoryTag h={h} />
                        </div>
                      </div>
                      <div className="col-start-2 hidden self-center sm:col-start-3 sm:block">
                        <CategoryTag h={h} />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-14 max-w-2xl text-[0.78rem] italic text-text-4">
              <span className="ar">
                — السجلّ أعلاه تمثيلي؛ سيُحدَّث بالنتائج الموثّقة مع تقرير الموسم.
              </span>
              <span className="en">
                — The record above is representative; it will be updated with
                the club&rsquo;s verified results in the season report.
              </span>
            </p>
          </div>
        </section>
      </main>
      <Footer partners={partners} />
    </>
  );
}
