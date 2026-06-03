import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/layout/PageHeader";
import Stats from "@/components/home/Stats";
import BoardOfDirectors from "@/components/home/BoardOfDirectors";
import { SectionTitle } from "@/components/ui/SectionTitle";

export const metadata = {
  title: "About — Chess & Culture Club for Women, Sharjah",
  description:
    "The history, governance, and mission of the Chess & Culture Club for Women in Sharjah — a UAE institution since 1991.",
};

const STORY: { ar: string; en: string }[] = [
  {
    ar: "يُعدّ نادي الشطرنج والثقافة للفتيات بالشارقة أحد أعرق المؤسسات النسائية في الإمارات العربية المتحدة، تأسس عام 1991 ضمن منظومة الشارقة الثقافية والرياضية الرائدة، وأصبح علامة فارقة في تاريخ الشطرنج النسائي بالدولة.",
    en: "The Chess & Culture Club for Women in Sharjah is one of the oldest and most respected women's institutions in the United Arab Emirates. Established in 1991 within Sharjah's pioneering cultural and sporting ecosystem, the club has become a landmark in the history of women's chess in the country.",
  },
  {
    ar: "يُركّز النادي على تطوير اللاعبات الإماراتيات، وتمكين الفتيات من خلال الشطرنج والثقافة، وصناعة بطلات المستقبل، والجمع بين الرياضة والتعليم والثقافة وخدمة المجتمع.",
    en: "The club focuses on developing Emirati players, empowering girls through chess and culture, creating future champions, and combining sport, education, culture, and community development.",
  },
  {
    ar: "يحمل النادي سمعة راسخة في بطولات الإمارات للشطرنج النسائي، ويتمتع بحضور مؤسسي مميز ومبادرات مجتمعية واسعة، ضمن إطار حوكمة معتمد بشهادة الجودة الدولية ISO 9001.",
    en: "The club holds a strong reputation in UAE women's chess championships, with distinguished institutional standing and wide community initiatives, within a governance framework certified to ISO 9001 standards.",
  },
];

const VALUES: { ar: string; en: string; descAr: string; descEn: string }[] = [
  {
    ar: "التميّز الرياضي",
    en: "Sporting Excellence",
    descAr: "تطوير لاعبات قادرات على تمثيل الدولة في أعلى المستويات.",
    descEn: "Developing players able to represent the nation at the highest level.",
  },
  {
    ar: "تمكين المرأة",
    en: "Women's Empowerment",
    descAr: "بناء القيادة والثقة لدى الفتاة الإماراتية عبر الشطرنج والثقافة.",
    descEn: "Building leadership and confidence in Emirati women through chess and culture.",
  },
  {
    ar: "الحوكمة المؤسسية",
    en: "Institutional Governance",
    descAr: "إدارة شفافة معتمدة بمعايير الجودة الدولية منذ 2023.",
    descEn: "Transparent administration certified to international quality standards since 2023.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main id="main">
        <PageHeader
          kickerAr="المؤسسة"
          kickerEn="The Institution"
          titleAr="نادي الشطرنج والثقافة للفتيات بالشارقة"
          titleEn="Chess & Culture Club for Women, Sharjah"
          leadAr="مؤسسة رياضية وثقافية رائدة منذ 1991، تقود مسيرة الشطرنج النسائي في دولة الإمارات."
          leadEn="A leading sporting and cultural institution since 1991, leading the women's chess movement in the UAE."
          crumbs={[{ href: "/about", ar: "عن النادي", en: "About" }]}
        />

        {/* Institutional narrative */}
        <section className="border-t border-line bg-white">
          <div className="mx-auto max-w-wrap-md px-5 py-24 sm:px-8 sm:py-28 lg:px-10">
            <SectionTitle
              eyebrowAr="من نحن"
              eyebrowEn="Who We Are"
              titleAr="إرث ممتد منذ 1991"
              titleEn="A legacy since 1991"
              size="h2"
            />
            <div className="mt-10 space-y-7 text-[1.0625rem] leading-relaxed text-text-2 sm:text-[1.15rem]">
              {STORY.map((p, i) => (
                <p key={i}>
                  <span className="ar">{p.ar}</span>
                  <span className="en">{p.en}</span>
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="border-t border-line bg-cream-100">
          <div className="mx-auto max-w-wrap px-5 py-24 sm:px-8 sm:py-28 lg:px-10">
            <SectionTitle
              eyebrowAr="مبادئنا"
              eyebrowEn="Our Principles"
              titleAr="القيم التي نعمل بها"
              titleEn="The values we operate by"
              size="h2"
            />
            <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-[4px] border border-line bg-line/60 sm:grid-cols-3">
              {VALUES.map((v, i) => (
                <div key={v.en} className="bg-white p-8 sm:p-10">
                  <div className="font-disp text-5xl font-bold tabular-nums text-forest-700/30">
                    0{i + 1}
                  </div>
                  <h3 className="mt-5 font-disp text-[1.3rem] font-bold tracking-tight text-text-1">
                    <span className="ar">{v.ar}</span>
                    <span className="en">{v.en}</span>
                  </h3>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-text-3">
                    <span className="ar">{v.descAr}</span>
                    <span className="en">{v.descEn}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Stats />
        <BoardOfDirectors />
      </main>
      <Footer />
    </>
  );
}
