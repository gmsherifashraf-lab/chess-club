"use client";

import Reveal from "@/components/motion/Reveal";

const VALUES = [
  { ar: "الريادة",     en: "Leadership"        },
  { ar: "التميّز",      en: "Excellence"        },
  { ar: "الإبداع",      en: "Creativity"        },
  { ar: "الابتكار",     en: "Innovation"        },
  { ar: "الانضباط",     en: "Discipline"        },
  { ar: "المجتمع",      en: "Community"         },
  { ar: "تمكين المرأة", en: "Women empowerment" },
];

export default function VisionMission() {
  return (
    <section className="relative bg-white overflow-hidden">
      <div aria-hidden className="absolute inset-0 grain-emerald pointer-events-none" />

      <div className="relative max-w-wrap mx-auto px-4 sm:px-6 lg:px-10 py-26 sm:py-30">
        {/* No eyebrow — open straight with the question (sets a different cadence than other sections) */}
        <Reveal>
          <h2 className="font-disp text-[clamp(2.2rem,4.5vw,3.4rem)] text-ink leading-[1.08] tracking-tight max-w-3xl mb-3">
            <span className="ar">
              ما الذي يصنع نادياً مستمراً منذ 1991؟
            </span>
            <span className="en">
              What keeps a club running since 1991?
            </span>
          </h2>
          <p className="text-[0.95rem] text-ink3 italic max-w-md mb-16 sm:mb-20">
            <span className="ar">— من الميثاق المؤسسي للنادي</span>
            <span className="en">— from the club&rsquo;s charter</span>
          </p>
        </Reveal>

        {/* Vision + Mission — two columns, baseline-aligned, no roman numerals */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-24">
          <Reveal delay={0.05} className="lg:col-span-6">
            <article className="relative">
              <div className="text-[0.62rem] uppercase tracking-[0.32em] text-[#0B3D2E] font-bold mb-6">
                <span className="ar">الرؤية</span>
                <span className="en">Vision</span>
              </div>
              <h3 className="font-disp text-[clamp(1.8rem,3.2vw,2.4rem)] text-ink leading-[1.18] mb-6 tracking-tight">
                <span className="ar">أن يكون النادي من أبرز أندية الشطرنج النسائية في الإمارات.</span>
                <span className="en">To be among the leading women&rsquo;s chess clubs in the UAE.</span>
              </h3>
              <p className="text-[1rem] sm:text-[1.05rem] leading-[1.85] text-ink2 max-w-md">
                <span className="ar">
                  ترسيخ مكانة النادي كرمزٍ للتميّز الرياضي والثقافي للمرأة في المنطقة،
                  وإعداد أجيال متعاقبة من اللاعبات والقائدات.
                </span>
                <span className="en">
                  To anchor the club as a regional benchmark of sporting and
                  cultural excellence for women, and to prepare successive
                  generations of players and leaders.
                </span>
              </p>
            </article>
          </Reveal>

          <Reveal delay={0.15} className="lg:col-span-6 lg:border-l lg:border-stone lg:pl-12">
            <article className="relative">
              <div className="text-[0.62rem] uppercase tracking-[0.32em] text-[#C8102E] font-bold mb-6">
                <span className="ar">الرسالة</span>
                <span className="en">Mission</span>
              </div>
              <h3 className="font-disp text-[clamp(1.8rem,3.2vw,2.4rem)] text-ink leading-[1.18] mb-6 tracking-tight">
                <span className="ar">تنمية الفتيات ذهنياً وتنافسياً، عبر الشطرنج والثقافة معاً.</span>
                <span className="en">Developing girls intellectually and competitively, through chess and culture together.</span>
              </h3>
              <p className="text-[1rem] sm:text-[1.05rem] leading-[1.85] text-ink2 max-w-md">
                <span className="ar">
                  نُطوّر اللاعبات من خلال الشطرنج، الثقافة، التعليم، والمشاركة المجتمعية،
                  في بيئة احترافية تليق بمكانة المرأة الإماراتية.
                </span>
                <span className="en">
                  Through chess, culture, education and community engagement —
                  in a professional environment worthy of the Emirati woman.
                </span>
              </p>
            </article>
          </Reveal>
        </div>

        {/* Core values — editorial inline list, em-dash separated. No grid, no icons. */}
        <Reveal>
          <div className="border-t border-stone pt-10 sm:pt-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
              <div className="lg:col-span-3">
                <div className="text-[0.62rem] uppercase tracking-[0.32em] text-ink3 font-bold mb-3">
                  <span className="ar">القيم الجوهرية</span>
                  <span className="en">Values, in plain words</span>
                </div>
                <p className="text-[0.9rem] leading-[1.7] text-ink3 max-w-[28ch]">
                  <span className="ar">المرتكزات السبعة التي يُحاسب عليها العمل اليومي للنادي.</span>
                  <span className="en">The seven words the day-to-day work is held to.</span>
                </p>
              </div>
              <ul className="lg:col-span-9 font-disp text-[clamp(1.4rem,2.4vw,1.95rem)] text-ink leading-[1.42] tracking-tight">
                {VALUES.map((v, i) => (
                  <li key={i} className="inline">
                    <span className="ar">{v.ar}</span>
                    <span className="en">{v.en}</span>
                    {i < VALUES.length - 1 && (
                      <span aria-hidden className="text-[#0B3D2E]/55 mx-3 sm:mx-4">·</span>
                    )}
                  </li>
                ))}
                <span className="font-body text-[0.62rem] uppercase tracking-[0.22em] text-ink3 not-italic align-baseline ml-4 font-bold">
                  <span className="ar">— سبعة مرتكزات</span>
                  <span className="en">— seven principles</span>
                </span>
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
