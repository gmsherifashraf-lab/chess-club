import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/layout/PageHeader";
import BoardOfDirectors from "@/components/home/BoardOfDirectors";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getBoardMembers, getPartners } from "@/lib/queries/home";

export const revalidate = 60;

export const metadata = {
  title: "Board of Directors",
  description:
    "The governing board of the Chess & Culture Club for Women, Sharjah — the senior Emirati women who set the club's strategic direction within an ISO 9001 governance framework.",
};

/* What the board is responsible for. */
const MANDATE = [
  {
    ar: "التوجّه الاستراتيجي",
    en: "Strategic direction",
    descAr: "اعتماد رؤية النادي وخططه طويلة المدى وأولوياته السنوية.",
    descEn: "Setting the club's vision, long-term plans, and annual priorities.",
  },
  {
    ar: "الإشراف المالي",
    en: "Financial oversight",
    descAr: "إقرار الموازنة السنوية ومتابعة سلامة الموارد وحسن إنفاقها.",
    descEn: "Approving the annual budget and safeguarding the club's resources.",
  },
  {
    ar: "البرامج والسياسات",
    en: "Programmes & policy",
    descAr: "اعتماد البرامج التدريبية والثقافية والسياسات المنظِّمة للعمل.",
    descEn: "Approving training and cultural programmes and the policies that govern them.",
  },
  {
    ar: "مساءلة الإدارة التنفيذية",
    en: "Executive accountability",
    descAr: "الإشراف على المكتب التنفيذي ومراجعة الأداء مقابل الأهداف.",
    descEn: "Overseeing the executive office and reviewing performance against goals.",
  },
];

/* How the board operates — the governance framework. */
const FRAMEWORK = [
  {
    ar: "التشكيل",
    en: "Composition",
    valueAr: "مجلس من سبع عضوات إماراتيات",
    valueEn: "A seven-member board of Emirati women",
  },
  {
    ar: "الرئاسة",
    en: "Leadership",
    valueAr: "رئيسة المجلس والأمين العام",
    valueEn: "Chairperson and Secretary General",
  },
  {
    ar: "الاجتماعات",
    en: "Meetings",
    valueAr: "دورات منتظمة على مدار الموسم",
    valueEn: "Convenes regularly through the season",
  },
  {
    ar: "التنفيذ",
    en: "Delivery",
    valueAr: "مكتب تنفيذي يتولّى التشغيل اليومي",
    valueEn: "An executive office handles day-to-day operations",
  },
  {
    ar: "الاعتماد",
    en: "Accreditation",
    valueAr: "إطار حوكمة معتمد ISO 9001:2015",
    valueEn: "ISO 9001:2015 certified governance framework",
  },
  {
    ar: "المساءلة",
    en: "Reporting",
    valueAr: "مراجعة سنوية للأداء والموازنة",
    valueEn: "Annual review of performance and budget",
  },
];

export default async function BoardPage() {
  const [board, partners] = await Promise.all([
    getBoardMembers(),
    getPartners(),
  ]);

  return (
    <>
      <Navbar />
      <main id="main">
        <PageHeader
          kickerAr="الحوكمة"
          kickerEn="Governance"
          titleAr="مجلس الإدارة"
          titleEn="Board of Directors"
          leadAr="يقود النادي مجلسٌ من القياديات الإماراتيات، يضع توجّهه الاستراتيجي ويصون معاييره المؤسسية."
          leadEn="The club is led by a board of senior Emirati women who set its strategic direction and safeguard its institutional standards."
          crumbs={[
            { href: "/about", ar: "عن النادي", en: "About Us" },
            { href: "/board", ar: "مجلس الإدارة", en: "Board Members" },
          ]}
        />

        {/* ── The board's mandate ──────────────────────────────────── */}
        <section className="border-t border-line bg-cream-100">
          <div className="mx-auto max-w-wrap px-5 py-24 sm:px-8 sm:py-28 lg:px-10">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-5">
                <SectionTitle
                  eyebrowAr="الدور"
                  eyebrowEn="The Mandate"
                  titleAr="مسؤولية المجلس"
                  titleEn="What the board is responsible for"
                  size="h2"
                />
                <p className="mt-7 text-[1.0625rem] leading-relaxed text-text-2 sm:text-[1.1rem]">
                  <span className="ar">
                    يتولّى مجلس الإدارة الحوكمة العليا للنادي: يرسم الاتجاه،
                    ويعتمد الموارد والبرامج، ويُسائل الإدارة التنفيذية، بما
                    يضمن استمرار النادي مؤسسةً موثوقة في خدمة شطرنج السيدات.
                  </span>
                  <span className="en">
                    The board holds ultimate governance of the club: it sets
                    direction, approves resources and programmes, and holds the
                    executive office to account, keeping the club a trusted
                    institution in the service of women&rsquo;s chess.
                  </span>
                </p>
              </div>

              <div className="lg:col-span-7">
                <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[4px] border border-line bg-line/60 sm:grid-cols-2">
                  {MANDATE.map((m, i) => (
                    <div key={m.en} className="bg-white p-7 sm:p-8">
                      <div className="font-disp text-[2rem] font-bold tabular-nums leading-none text-line-strong">
                        0{i + 1}
                      </div>
                      <h3 className="mt-5 font-disp text-[1.2rem] font-bold tracking-tight text-text-1">
                        <span className="ar">{m.ar}</span>
                        <span className="en">{m.en}</span>
                      </h3>
                      <p className="mt-2.5 text-[0.92rem] leading-relaxed text-text-3">
                        <span className="ar">{m.descAr}</span>
                        <span className="en">{m.descEn}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── The board roster ─────────────────────────────────────── */}
        <BoardOfDirectors members={board} />

        {/* ── Governance framework ─────────────────────────────────── */}
        <section className="border-t border-line bg-cream-100">
          <div className="mx-auto max-w-wrap px-5 py-24 sm:px-8 sm:py-28 lg:px-10">
            <SectionTitle
              eyebrowAr="الإطار"
              eyebrowEn="The Framework"
              titleAr="كيف يعمل المجلس"
              titleEn="How the board operates"
              leadAr="إطار حوكمة منضبط يضمن الشفافية واستمرارية الأداء المؤسسي."
              leadEn="A disciplined governance framework that ensures transparency and institutional continuity."
              size="h2"
            />
            <dl className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-[4px] border border-line bg-line/60 sm:grid-cols-2 lg:grid-cols-3">
              {FRAMEWORK.map((f) => (
                <div key={f.en} className="bg-white p-7 sm:p-8">
                  <dt className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-forest-700">
                    <span className="ar">{f.ar}</span>
                    <span className="en">{f.en}</span>
                  </dt>
                  <dd className="mt-3 text-[1.05rem] font-medium leading-snug text-text-1">
                    <span className="ar">{f.valueAr}</span>
                    <span className="en">{f.valueEn}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>
      <Footer partners={partners} />
    </>
  );
}
