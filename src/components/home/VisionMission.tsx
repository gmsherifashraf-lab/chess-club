"use client";

const VALUES = [
  { icon: "♛", ar: "الريادة",      en: "Leadership"        },
  { icon: "✦", ar: "التميّز",       en: "Excellence"        },
  { icon: "✧", ar: "الإبداع",       en: "Creativity"        },
  { icon: "◈", ar: "الابتكار",      en: "Innovation"        },
  { icon: "△", ar: "الانضباط",      en: "Discipline"        },
  { icon: "◯", ar: "المجتمع",       en: "Community"         },
  { icon: "♕", ar: "تمكين المرأة",  en: "Women Empowerment" },
];

export default function VisionMission() {
  return (
    <section className="bg-white">
      <div className="max-w-wrap mx-auto px-4 sm:px-6 lg:px-10 section-pad">
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <div className="sec-tag inline-flex items-center justify-center gap-3 mb-4 text-red">
            <span className="block w-9 h-[2px] bg-red" />
            <span>
              <span className="ar">الرؤية والرسالة</span>
              <span className="en">Vision &amp; Mission</span>
            </span>
            <span className="block w-9 h-[2px] bg-red" />
          </div>
          <h2 className="font-disp t-h2 text-ink mb-5">
            <span className="ar">بوصلة النادي ومرتكزاته</span>
            <span className="en">Our Compass &amp; Foundations</span>
          </h2>
          <div className="h-[3px] w-24 mx-auto bg-gradient-to-r from-red via-white to-green2" />
        </div>

        {/* Vision + Mission cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-16">
          <article className="relative bg-ivory2 border border-stone p-8 sm:p-10 overflow-hidden hover:-translate-y-1 transition-transform">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-red" />
            <div className="absolute -top-10 -right-6 text-[8rem] font-disp opacity-[0.06] text-red leading-none select-none">♛</div>
            <div className="relative">
              <div className="text-[0.62rem] uppercase tracking-[0.22em] text-red font-bold mb-4">
                <span className="ar">رؤيتنا</span>
                <span className="en">Our Vision</span>
              </div>
              <h3 className="font-disp text-3xl text-ink leading-tight mb-5">
                <span className="ar">أن نكون من أبرز أندية الشطرنج النسائية في الإمارات</span>
                <span className="en">To be among the leading women&rsquo;s chess clubs in the UAE.</span>
              </h3>
              <p className="text-base sm:text-lg leading-[1.85] text-ink3">
                <span className="ar">
                  نسعى إلى إلهام الأجيال القادمة من اللاعبات الإماراتيات وترسيخ مكانة
                  النادي كرمزٍ للتميّز الرياضي والثقافي للمرأة في المنطقة.
                </span>
                <span className="en">
                  We aspire to inspire future generations of Emirati players and
                  to anchor the club as a regional benchmark of sporting and
                  cultural excellence for women.
                </span>
              </p>
            </div>
          </article>

          <article className="relative bg-ivory2 border border-stone p-8 sm:p-10 overflow-hidden hover:-translate-y-1 transition-transform">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-green2" />
            <div className="absolute -top-10 -right-6 text-[8rem] font-disp opacity-[0.06] text-green2 leading-none select-none">✦</div>
            <div className="relative">
              <div className="text-[0.62rem] uppercase tracking-[0.22em] text-green2 font-bold mb-4">
                <span className="ar">رسالتنا</span>
                <span className="en">Our Mission</span>
              </div>
              <h3 className="font-disp text-3xl text-ink leading-tight mb-5">
                <span className="ar">تنمية الفتيات ذهنياً وتنافسياً</span>
                <span className="en">Developing girls intellectually &amp; competitively.</span>
              </h3>
              <p className="text-base sm:text-lg leading-[1.85] text-ink3">
                <span className="ar">
                  نُطوّر اللاعبات من خلال الشطرنج، الثقافة، التعليم، والمشاركة المجتمعية،
                  في بيئة احترافية ومُلهِمة تليق بمكانة المرأة الإماراتية.
                </span>
                <span className="en">
                  We develop players through chess, culture, education, and
                  community engagement — in a professional, empowering environment
                  worthy of Emirati women.
                </span>
              </p>
            </div>
          </article>
        </div>

        {/* Core values */}
        <div className="text-center mb-10">
          <div className="text-[0.62rem] uppercase tracking-[0.22em] text-red font-bold mb-3">
            <span className="ar">القيم الجوهرية</span>
            <span className="en">Core Values</span>
          </div>
          <h3 className="font-disp text-2xl sm:text-3xl text-ink">
            <span className="ar">سبعة مرتكزات تُوجِّه عملنا</span>
            <span className="en">Seven principles that guide our work</span>
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
          {VALUES.map((v, i) => (
            <div
              key={i}
              className="group bg-white border border-stone py-7 px-3 text-center transition-all hover:border-red hover:-translate-y-1 hover:shadow-[0_18px_44px_-22px_rgba(212,43,60,0.4)]"
            >
              <div className="font-disp text-3xl text-red mb-3 group-hover:scale-110 transition-transform">{v.icon}</div>
              <div className="text-[0.72rem] uppercase tracking-[0.16em] font-bold text-ink">
                <span className="ar">{v.ar}</span>
                <span className="en">{v.en}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
