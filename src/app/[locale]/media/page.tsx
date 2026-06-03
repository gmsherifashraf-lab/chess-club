import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/layout/PageHeader";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { LocaleLink } from "@/components/layout/LocaleLink";
import { SocialRow } from "@/components/brand/SocialIcons";
import { getPartners } from "@/lib/queries/home";

export const revalidate = 60;

export const metadata = {
  title: "Media Center",
  description:
    "The media center of the Chess & Culture Club for Women, Sharjah — newsroom, photography, and press resources.",
};

const EMAIL = "info@cccsw.shj.ae";

/* The two media channels. */
const CHANNELS = [
  {
    href: "/news",
    index: "01",
    glyph: "♜",
    titleAr: "غرفة الأخبار",
    titleEn: "Newsroom",
    bodyAr: "البيانات الرسمية وأخبار النادي وتغطية البطولات والفعاليات.",
    bodyEn: "Official statements, club news, and coverage of tournaments and events.",
    gradient: "from-[#0A5234] via-[#0A4D33] to-[#06140E]",
  },
  {
    href: "/gallery",
    index: "02",
    glyph: "♞",
    titleAr: "معرض الصور",
    titleEn: "Photo Gallery",
    bodyAr: "أرشيف مصوّر من التدريبات والبطولات والمناسبات الرسمية.",
    bodyEn: "A photographic archive of training, tournaments, and official occasions.",
    gradient: "from-[#11201A] via-[#0C1813] to-[#070B09]",
  },
];

/* Resources for journalists and media partners. */
const RESOURCES = [
  {
    ar: "طلبات الإعلام",
    en: "Media enquiries",
    descAr: "للمقابلات والتصريحات واعتماد التغطية الصحفية، يُرجى التواصل مع مكتب الإعلام.",
    descEn: "For interviews, statements, and press accreditation, contact the club's media desk.",
  },
  {
    ar: "الاسم والشعار",
    en: "Name & emblem",
    descAr: "يُستخدم اسم النادي وشعاره في صيغتهما الرسمية؛ تُطلب ملفات الهوية من مكتب الإعلام.",
    descEn: "The club's name and emblem are used in their official form; identity files are available on request.",
  },
  {
    ar: "الصور والفيديو",
    en: "Photography & footage",
    descAr: "تتوفّر الصور ومقاطع الفيديو الرسمية من البطولات والفعاليات عند الطلب.",
    descEn: "Official photography and video from tournaments and events are available on request.",
  },
];

export default async function MediaPage() {
  const partners = await getPartners();

  return (
    <>
      <Navbar />
      <main id="main">
        <PageHeader
          kickerAr="المركز الإعلامي"
          kickerEn="Media Center"
          titleAr="المركز الإعلامي"
          titleEn="Media Center"
          leadAr="غرفة الأخبار والأرشيف المصوّر وموارد الإعلام للنادي، مجموعةً في موضع واحد."
          leadEn="The club's newsroom, photographic archive, and press resources, gathered in one place."
          crumbs={[{ href: "/media", ar: "المركز الإعلامي", en: "Media Center" }]}
        />

        {/* ── Media channels ───────────────────────────────────────── */}
        <section className="border-t border-line bg-white">
          <div className="mx-auto max-w-wrap px-5 py-24 sm:px-8 sm:py-28 lg:px-10">
            <SectionTitle
              eyebrowAr="القنوات"
              eyebrowEn="Channels"
              titleAr="تصفّحي إعلام النادي"
              titleEn="Browse the club's media"
              size="h2"
            />
            <div className="mt-12 grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-2">
              {CHANNELS.map((c) => (
                <LocaleLink
                  key={c.href}
                  href={c.href}
                  className="group relative flex h-[18rem] flex-col justify-end overflow-hidden rounded-[4px] shadow-card transition-[transform,box-shadow] duration-[450ms] ease-emphasis hover:-translate-y-1.5 hover:shadow-card-hover sm:h-[20rem]"
                >
                  {/* Branded cover */}
                  <div
                    aria-hidden
                    className="absolute inset-0 transition-transform duration-[850ms] ease-emphasis group-hover:scale-[1.05]"
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${c.gradient}`}
                    />
                    <div className="chess-tex-lt absolute inset-0 opacity-50" />
                    <span className="absolute -bottom-12 -end-6 select-none font-serif text-[15rem] leading-none text-white/[0.07]">
                      {c.glyph}
                    </span>
                  </div>
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,11,9,0.1)_0%,transparent_38%,rgba(7,11,9,0.66)_100%)]"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-[3px] bg-forest-400"
                  />
                  <span
                    aria-hidden
                    className="absolute start-7 top-6 font-disp text-[0.82rem] font-bold tracking-[0.22em] text-white/45"
                  >
                    {c.index}
                  </span>

                  <div className="relative flex items-end justify-between gap-5 p-7 sm:p-8">
                    <div className="min-w-0">
                      <h3 className="font-disp text-[clamp(1.6rem,2.4vw,2.2rem)] font-bold leading-[1.1] text-white">
                        <span className="ar">{c.titleAr}</span>
                        <span className="en">{c.titleEn}</span>
                      </h3>
                      <p className="mt-2.5 max-w-[40ch] text-[0.92rem] leading-snug text-white/75">
                        <span className="ar">{c.bodyAr}</span>
                        <span className="en">{c.bodyEn}</span>
                      </p>
                    </div>
                    <span
                      aria-hidden
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/30 text-white transition-[background-color,color,transform] duration-300 ease-emphasis group-hover:translate-x-0.5 group-hover:border-white group-hover:bg-white group-hover:text-onyx-500 rtl:group-hover:-translate-x-0.5"
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
                  </div>
                </LocaleLink>
              ))}
            </div>
          </div>
        </section>

        {/* ── Press & media resources ──────────────────────────────── */}
        <section className="border-t border-line bg-cream-100">
          <div className="mx-auto max-w-wrap px-5 py-24 sm:px-8 sm:py-28 lg:px-10">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-5">
                <SectionTitle
                  eyebrowAr="للإعلاميين"
                  eyebrowEn="For the Media"
                  titleAr="موارد الصحافة والإعلام"
                  titleEn="Press & media resources"
                  size="h2"
                />
                <p className="mt-7 text-[1.0625rem] leading-relaxed text-text-2">
                  <span className="ar">
                    يرحّب النادي بالتعاون مع وسائل الإعلام في تغطية شطرنج
                    السيدات في الشارقة. يتولّى مكتب الإعلام طلبات المقابلات
                    والتصريحات والمواد الرسمية.
                  </span>
                  <span className="en">
                    The club welcomes working with the media to cover
                    women&rsquo;s chess in Sharjah. The media desk handles
                    requests for interviews, statements, and official material.
                  </span>
                </p>
                <div className="mt-8">
                  <div className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-text-4">
                    <span className="ar">مكتب الإعلام</span>
                    <span className="en">Media desk</span>
                  </div>
                  <a
                    href={`mailto:${EMAIL}`}
                    className="mt-1.5 inline-block font-disp text-[1.1rem] font-bold tracking-tight text-text-1 transition-colors hover:text-forest-700"
                    dir="ltr"
                  >
                    {EMAIL}
                  </a>
                </div>
                <div className="mt-7">
                  <div className="mb-3 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-text-4">
                    <span className="ar">القنوات الرسمية</span>
                    <span className="en">Official channels</span>
                  </div>
                  <SocialRow variant="dark" size={18} />
                </div>
              </div>

              <div className="lg:col-span-7">
                <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-[4px] border border-line bg-line/60">
                  {RESOURCES.map((r) => (
                    <li key={r.en} className="bg-white p-7 sm:p-8">
                      <h3 className="font-disp text-[1.2rem] font-bold tracking-tight text-text-1">
                        <span className="ar">{r.ar}</span>
                        <span className="en">{r.en}</span>
                      </h3>
                      <p className="mt-2 text-[0.95rem] leading-relaxed text-text-3">
                        <span className="ar">{r.descAr}</span>
                        <span className="en">{r.descEn}</span>
                      </p>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-[0.78rem] italic text-text-4">
                  <span className="ar">
                    — تُحدَّث الموارد الإعلامية وملفات الهوية وفق توفّرها.
                  </span>
                  <span className="en">
                    — Media resources and identity files are updated as they
                    become available.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer partners={partners} />
    </>
  );
}
