"use client";

interface Activity {
  icon: string;
  ar:   string;
  en:   string;
  arDsc: string;
  enDsc: string;
}

const ACTIVITIES: Activity[] = [
  {
    icon:  "🏛",
    ar:    "ورش العمل الثقافية",
    en:    "Cultural Workshops",
    arDsc: "ورش متخصصة في القيادة، الفنون، والتنمية الذاتية للاعبات النادي.",
    enDsc: "Specialised workshops in leadership, the arts, and personal development for club members.",
  },
  {
    icon:  "🎓",
    ar:    "البرامج المدرسية",
    en:    "School Outreach",
    arDsc: "نشر الشطرنج في المدارس الإماراتية وتأهيل اللاعبات في سن مبكرة.",
    enDsc: "Bringing chess to UAE schools and discovering young talent in their formative years.",
  },
  {
    icon:  "🤝",
    ar:    "الشراكات المؤسسية",
    en:    "Institutional Partnerships",
    arDsc: "تعاون مع جهات حكومية ومدنية في الشارقة والإمارات لتعزيز دور المرأة.",
    enDsc: "Working with government and civic partners in Sharjah and across the UAE to advance the role of women.",
  },
  {
    icon:  "🌟",
    ar:    "تكريم البطلات",
    en:    "Honouring Champions",
    arDsc: "حفلات تكريم سنوية تحتفي بإنجازات اللاعبات والمدربات وتُلهم الأجيال القادمة.",
    enDsc: "Annual recognition ceremonies celebrating players and coaches and inspiring the next generation.",
  },
];

export default function Community() {
  return (
    <section className="relative bg-ink text-ivory overflow-hidden">
      <div className="chess-tex-lt absolute inset-0 opacity-50" />
      <div
        aria-hidden
        className="absolute -top-40 -right-32 w-[480px] h-[480px] rounded-full blur-3xl opacity-20"
        style={{ background: "radial-gradient(circle, #007A38 0%, transparent 70%)" }}
      />
      <div className="relative max-w-wrap mx-auto px-4 sm:px-6 lg:px-10 section-pad">
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <div className="sec-tag inline-flex items-center justify-center gap-3 mb-4 text-ivory">
            <span className="block w-9 h-[2px] bg-red" />
            <span>
              <span className="ar">المجتمع والثقافة</span>
              <span className="en">Community &amp; Culture</span>
            </span>
            <span className="block w-9 h-[2px] bg-red" />
          </div>
          <h2 className="font-disp t-h2 text-ivory mb-5">
            <span className="ar">أكثر من رياضة — أسلوب حياة</span>
            <span className="en">More than a sport — a way of life</span>
          </h2>
          <div className="h-[3px] w-24 mx-auto bg-gradient-to-r from-red via-white to-green2" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {ACTIVITIES.map((a, i) => (
            <article
              key={i}
              className="bg-ivory/[0.04] border border-ivory/10 backdrop-blur p-7 transition-all hover:bg-ivory/[0.07] hover:border-red"
            >
              <div className="text-4xl mb-5">{a.icon}</div>
              <h3 className="font-disp text-xl text-ivory mb-3 leading-tight">
                <span className="ar">{a.ar}</span>
                <span className="en">{a.en}</span>
              </h3>
              <p className="text-sm leading-[1.75] text-ivory/65">
                <span className="ar">{a.arDsc}</span>
                <span className="en">{a.enDsc}</span>
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
