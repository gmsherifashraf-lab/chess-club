import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Stats from "@/components/home/Stats";
import History from "@/components/home/History";
import VisionMission from "@/components/home/VisionMission";
import BoardOfDirectors from "@/components/home/BoardOfDirectors";
import Achievements from "@/components/home/Achievements";
import Partners from "@/components/home/Partners";
import Contact from "@/components/home/Contact";

export const metadata = {
  title: "About — Chess & Culture Club for Women",
  description:
    "The history, vision, and leadership of the Chess & Culture Club for Women in Sharjah — a UAE institution since 1991.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Cinematic page hero */}
        <section className="pg-hdr text-ivory relative">
          <div className="relative max-w-wrap mx-auto px-4 sm:px-6 lg:px-10 pt-24 pb-20 sm:pt-28 sm:pb-28">
            <div className="sec-tag inline-flex items-center gap-3 mb-6 text-ivory">
              <span className="block w-9 h-[2px] bg-red" />
              <span>
                <span className="ar">المؤسسة</span>
                <span className="en">The Institution</span>
              </span>
            </div>

            <h1 className="font-disp t-h1 text-ivory mb-6 max-w-4xl">
              <span className="ar">نادي الشطرنج والثقافة للفتيات بالشارقة</span>
              <span className="en">Chess &amp; Culture Club for Women — Sharjah</span>
            </h1>

            <div className="h-[3px] w-32 bg-gradient-to-r from-red via-white to-green2 mb-8" />

            <p className="text-lg sm:text-xl leading-[1.85] text-ivory/80 max-w-3xl">
              <span className="ar">
                مؤسسة رياضية وثقافية رائدة، تأسست عام 1991 لتقود مسيرة الشطرنج النسائي
                في الإمارات العربية المتحدة، وتُسهم في تمكين الفتاة الإماراتية ذهنياً وقيادياً
                من خلال الشطرنج، الثقافة، والتعليم.
              </span>
              <span className="en">
                A leading sports and cultural institution founded in 1991 to lead
                the women&rsquo;s chess movement in the United Arab Emirates and
                empower Emirati women intellectually and as leaders — through
                chess, culture, and education.
              </span>
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-ivory/8 border border-ivory/15 text-[0.65rem] uppercase tracking-[0.22em] font-semibold backdrop-blur">
                <span className="block w-1.5 h-1.5 rounded-full bg-red" />
                <span className="ar">تأسس 1991</span>
                <span className="en">Est. 1991</span>
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-ivory/8 border border-ivory/15 text-[0.65rem] uppercase tracking-[0.22em] font-semibold backdrop-blur">
                <span className="block w-1.5 h-1.5 rounded-full bg-green2" />
                <span className="ar">معتمد ISO</span>
                <span className="en">ISO Certified</span>
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-ivory/8 border border-ivory/15 text-[0.65rem] uppercase tracking-[0.22em] font-semibold backdrop-blur">
                <span className="block w-1.5 h-1.5 rounded-full bg-gold" />
                <span className="ar">مؤسسة نسائية رائدة</span>
                <span className="en">Leading Women&rsquo;s Institution</span>
              </span>
            </div>
          </div>
        </section>

        <Stats />

        {/* Long-form institutional intro */}
        <section className="bg-white">
          <div className="max-w-wrap-md mx-auto px-4 sm:px-6 lg:px-10 section-pad">
            <div className="sec-tag inline-flex items-center gap-3 mb-5 text-red">
              <span className="block w-9 h-[2px] bg-red" />
              <span>
                <span className="ar">من نحن</span>
                <span className="en">Who We Are</span>
              </span>
            </div>
            <h2 className="font-disp t-h2 text-ink mb-7">
              <span className="ar">إرث ممتد منذ 1991</span>
              <span className="en">A legacy since 1991</span>
            </h2>
            <div className="h-[3px] w-24 bg-gradient-to-r from-red via-white to-green2 mb-10" />

            <div className="space-y-7 text-base sm:text-lg leading-[1.9] text-ink2">
              <p>
                <span className="ar">
                  يُعدّ نادي الشطرنج والثقافة للفتيات بالشارقة أحد أعرق المؤسسات
                  النسائية في الإمارات العربية المتحدة، تأسس عام 1991 ضمن منظومة
                  الشارقة الثقافية والرياضية الرائدة، وأصبح علامة فارقة في تاريخ
                  الشطرنج النسائي بالدولة.
                </span>
                <span className="en">
                  The Chess &amp; Culture Club for Women in Sharjah is one of the
                  oldest and most respected women&rsquo;s institutions in the
                  United Arab Emirates. Established in 1991 within Sharjah&rsquo;s
                  pioneering cultural and sporting ecosystem, the club has become
                  a landmark in the history of women&rsquo;s chess in the country.
                </span>
              </p>

              <p>
                <span className="ar">
                  يُركّز النادي على تطوير اللاعبات الإماراتيات، تمكين الفتيات من
                  خلال الشطرنج والثقافة، صناعة بطلات المستقبل، والجمع بين الرياضة
                  والتعليم والثقافة وخدمة المجتمع — بما يعزز النمو الفكري وروح
                  القيادة لدى الشابات.
                </span>
                <span className="en">
                  The club focuses on developing female chess players, empowering
                  girls through chess and culture, creating future champions, and
                  combining sport, education, culture, and community development —
                  fostering intellectual growth and leadership in young women.
                </span>
              </p>

              <p>
                <span className="ar">
                  يحمل النادي سمعة راسخة في بطولات الإمارات للشطرنج النسائي،
                  ويتمتع بحضور مؤسسي مميز ومبادرات مجتمعية واسعة، ويُمثّل نموذجاً
                  يُحتذى به في الجمع بين التميّز الرياضي والقيمة الثقافية.
                </span>
                <span className="en">
                  The club holds a strong reputation in UAE women&rsquo;s chess
                  championships, is recognised for institutional excellence and
                  wide-reaching community initiatives, and stands as a model for
                  combining sporting excellence with cultural value.
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* Vision, mission, values */}
        <VisionMission />

        {/* Three-decade timeline */}
        <History />

        {/* Recognition + ISO */}
        <Achievements />

        {/* Board of Directors */}
        <BoardOfDirectors />

        {/* Partners */}
        <Partners />

        {/* Contact */}
        <Contact />
      </main>
      <Footer />
    </>
  );
}
