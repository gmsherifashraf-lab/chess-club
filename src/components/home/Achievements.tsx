"use client";

interface Achievement {
  icon:  string;
  ar:    string;
  en:    string;
  arDsc: string;
  enDsc: string;
  accent: "red" | "green" | "ink" | "gold";
}

const ACHIEVEMENTS: Achievement[] = [
  {
    icon:  "🥇",
    ar:    "بطولات الإمارات النسائية",
    en:    "UAE Women's Championships",
    arDsc: "حضور مستمر على منصات التتويج في بطولات الشطرنج النسائية الرئيسية بالدولة.",
    enDsc: "A continuous presence on the podium in the UAE&rsquo;s leading women&rsquo;s chess championships.",
    accent: "red",
  },
  {
    icon:  "🏛",
    ar:    "التميّز المؤسسي",
    en:    "Institutional Excellence",
    arDsc: "تكريمات وتقديرات رسمية من جهات حكومية ورياضية في الإمارات على مدار السنوات.",
    enDsc: "Repeated official recognition from UAE government and sporting bodies for institutional excellence.",
    accent: "ink",
  },
  {
    icon:  "✓",
    ar:    "اعتماد الجودة ISO",
    en:    "ISO Quality Certification",
    arDsc: "اعتماد دولي يؤكد التزام النادي بأعلى معايير الإدارة والتشغيل.",
    enDsc: "International certification confirming the club&rsquo;s commitment to top-tier management and operations standards.",
    accent: "gold",
  },
  {
    icon:  "♕",
    ar:    "نشر الشطرنج بين الفتيات",
    en:    "Promoting Chess for Girls",
    arDsc: "مبادرات وطنية لنشر الشطرنج بين الفتيات في المدارس والمراكز المجتمعية.",
    enDsc: "National outreach initiatives bringing chess to girls in schools and community centres across the UAE.",
    accent: "green",
  },
  {
    icon:  "☀",
    ar:    "المخيم الصيفي",
    en:    "Summer Camp",
    arDsc: "برامج تطوير الشباب الصيفية بحضور ميداني واسع وإنجازات تدريبية ملموسة.",
    enDsc: "Annual summer development programmes drawing strong attendance and producing measurable training results.",
    accent: "red",
  },
  {
    icon:  "❀",
    ar:    "الأنشطة الثقافية والمجتمعية",
    en:    "Cultural & Community Activities",
    arDsc: "حضور فاعل في الفعاليات الثقافية والمجتمعية بالشارقة والإمارات.",
    enDsc: "Active participation in cultural and community events across Sharjah and the wider UAE.",
    accent: "green",
  },
];

const accentMap = { red: "#D42B3C", green: "#007A38", ink: "#141414", gold: "#A07820" } as const;
const accentBg  = { red: "bg-red", green: "bg-green2", ink: "bg-ink", gold: "bg-gold" } as const;

export default function Achievements() {
  return (
    <section className="bg-ivory2 relative overflow-hidden">
      <div
        aria-hidden
        className="absolute top-32 -right-32 w-[400px] h-[400px] rounded-full blur-3xl opacity-15"
        style={{ background: "radial-gradient(circle, #D42B3C 0%, transparent 70%)" }}
      />
      <div className="relative max-w-wrap mx-auto px-4 sm:px-6 lg:px-10 section-pad">
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <div className="sec-tag inline-flex items-center justify-center gap-3 mb-4 text-red">
            <span className="block w-9 h-[2px] bg-red" />
            <span>
              <span className="ar">الإنجازات</span>
              <span className="en">Achievements</span>
            </span>
            <span className="block w-9 h-[2px] bg-red" />
          </div>
          <h2 className="font-disp t-h2 text-ink mb-5">
            <span className="ar">إرث من التميّز والتتويج</span>
            <span className="en">A legacy of excellence and titles</span>
          </h2>
          <div className="h-[3px] w-24 mx-auto bg-gradient-to-r from-red via-white to-green2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {ACHIEVEMENTS.map((a, i) => (
            <article
              key={i}
              className="group relative bg-white border border-stone p-7 transition-all hover:-translate-y-1 hover:shadow-[0_22px_50px_-25px_rgba(20,20,20,0.3)]"
            >
              <div className={`absolute top-0 left-0 right-0 h-[3px] ${accentBg[a.accent]}`} />
              <div
                className="absolute -top-6 -right-2 text-[7rem] opacity-[0.05] leading-none select-none"
                style={{ color: accentMap[a.accent] }}
              >
                {a.icon}
              </div>
              <div className="relative">
                <div className="text-3xl mb-4">{a.icon}</div>
                <h3 className="font-disp text-xl text-ink mb-3 leading-tight">
                  <span className="ar">{a.ar}</span>
                  <span className="en">{a.en}</span>
                </h3>
                <p className="text-[0.92rem] leading-[1.75] text-ink3">
                  <span className="ar">{a.arDsc}</span>
                  <span className="en" dangerouslySetInnerHTML={{ __html: a.enDsc }} />
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
