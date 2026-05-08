"use client";

import Link from "next/link";

interface Program {
  ageAr:  string;
  ageEn:  string;
  ar:     string;
  en:     string;
  arDsc:  string;
  enDsc:  string;
  bullets: { ar: string; en: string }[];
  accent: "red" | "green" | "ink" | "gold";
}

const PROGRAMS: Program[] = [
  {
    ageAr: "5–7 سنوات",
    ageEn: "Ages 5–7",
    ar:    "الملكات الصغيرات",
    en:    "Little Queens",
    arDsc: "البرنامج التأسيسي لتعريف الصغيرات بالشطرنج من خلال اللعب التفاعلي والقصص.",
    enDsc: "An introductory programme for our youngest girls — learning chess through play and storytelling.",
    bullets: [
      { ar: "تعلم القطع وحركاتها", en: "Pieces & basic moves"      },
      { ar: "ألعاب ومسابقات",      en: "Games & mini-tournaments"  },
      { ar: "تنمية مهارات التفكير",en: "Cognitive skill building"  },
    ],
    accent: "red",
  },
  {
    ageAr: "8–12 سنة",
    ageEn: "Ages 8–12",
    ar:    "النجوم الصاعدات",
    en:    "Rising Stars",
    arDsc: "تطوير الفهم التكتيكي والاستراتيجي للاعبات في مرحلة عمرية حاسمة.",
    enDsc: "Building tactical and strategic understanding during a formative age range.",
    bullets: [
      { ar: "التكتيكات والمواضيع", en: "Tactics & themes"     },
      { ar: "افتتاحيات مدروسة",     en: "Curated openings"    },
      { ar: "بطولات داخلية",        en: "Internal tournaments"},
    ],
    accent: "green",
  },
  {
    ageAr: "13–16 سنة",
    ageEn: "Ages 13–16",
    ar:    "الجيل التنافسي",
    en:    "Competitive Juniors",
    arDsc: "إعداد اللاعبات للمشاركة الفعّالة في البطولات المحلية والإقليمية.",
    enDsc: "Preparing players for active participation in local and regional tournaments.",
    bullets: [
      { ar: "تدريب البطولات",        en: "Tournament training" },
      { ar: "تحليل المباريات",       en: "Game analysis"       },
      { ar: "إعداد بدني وذهني",      en: "Mental conditioning" },
    ],
    accent: "ink",
  },
  {
    ageAr: "17 سنة فأكثر",
    ageEn: "Ages 17+",
    ar:    "فريق النخبة",
    en:    "Elite Squad",
    arDsc: "البرنامج الأرفع للاعبات المتقدمات الممثلات للنادي على المستوى الوطني والدولي.",
    enDsc: "The club&rsquo;s top tier — for advanced players representing the club nationally and internationally.",
    bullets: [
      { ar: "تدريب فردي مكثّف",       en: "Intensive 1-on-1 coaching" },
      { ar: "تمثيل دولي",              en: "International representation" },
      { ar: "إعداد لتصنيف FIDE",       en: "FIDE rating preparation" },
    ],
    accent: "gold",
  },
];

const accentBg  = { red: "bg-red", green: "bg-green2", ink: "bg-ink", gold: "bg-gold" } as const;
const accentTxt = { red: "text-red", green: "text-green2", ink: "text-ink", gold: "text-[#A07820]" } as const;

export default function TrainingPrograms() {
  return (
    <section className="bg-white">
      <div className="max-w-wrap mx-auto px-4 sm:px-6 lg:px-10 section-pad">
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <div className="sec-tag inline-flex items-center justify-center gap-3 mb-4 text-red">
            <span className="block w-9 h-[2px] bg-red" />
            <span>
              <span className="ar">برامج التدريب</span>
              <span className="en">Training Programs</span>
            </span>
            <span className="block w-9 h-[2px] bg-red" />
          </div>
          <h2 className="font-disp t-h2 text-ink mb-5">
            <span className="ar">رحلة تطوير اللاعبة من البداية إلى الاحتراف</span>
            <span className="en">Developing players from first move to international stage</span>
          </h2>
          <div className="h-[3px] w-24 mx-auto bg-gradient-to-r from-red via-white to-green2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6 mb-12">
          {PROGRAMS.map((p, i) => (
            <article
              key={i}
              className="group relative bg-ivory2 border border-stone p-7 sm:p-8 transition-all hover:-translate-y-1 hover:shadow-[0_22px_50px_-25px_rgba(20,20,20,0.3)]"
            >
              <div className={`absolute top-0 left-0 right-0 h-[3px] ${accentBg[p.accent]}`} />

              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className={`text-[0.65rem] uppercase tracking-[0.22em] font-bold mb-2 ${accentTxt[p.accent]}`}>
                    <span className="ar">{p.ageAr}</span>
                    <span className="en">{p.ageEn}</span>
                  </div>
                  <h3 className="font-disp text-2xl text-ink leading-tight">
                    <span className="ar">{p.ar}</span>
                    <span className="en">{p.en}</span>
                  </h3>
                </div>
              </div>

              <p className="text-[0.92rem] leading-[1.75] text-ink3 mb-5">
                <span className="ar">{p.arDsc}</span>
                <span className="en" dangerouslySetInnerHTML={{ __html: p.enDsc }} />
              </p>

              <ul className="space-y-2">
                {p.bullets.map((b, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-[0.88rem] text-ink2">
                    <span className={`mt-1.5 block w-1.5 h-1.5 rounded-full ${accentBg[p.accent]} flex-shrink-0`} />
                    <span>
                      <span className="ar">{b.ar}</span>
                      <span className="en">{b.en}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/register/academy"
            className="inline-flex items-center gap-2 h-14 px-9 bg-red text-white text-base font-semibold tracking-wide hover:bg-red-dk transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(212,43,60,0.4)]"
          >
            <span className="ar">سجّلي ابنتك في الأكاديمية ←</span>
            <span className="en">Enroll Your Daughter →</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
