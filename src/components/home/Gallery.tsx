"use client";

interface Item {
  ar:    string;
  en:    string;
  arSub: string;
  enSub: string;
  emoji: string;
  span?: "wide" | "tall";
  accent: "red" | "green" | "ink" | "gold";
}

const ITEMS: Item[] = [
  { ar: "البطولات",      en: "Tournaments",      arSub: "بطولات الشطرنج النسائية",        enSub: "Women's chess championships",     emoji: "🏆", accent: "red",    span: "wide" },
  { ar: "اللاعبات",       en: "Players",          arSub: "بطلات النادي",                    enSub: "Club champions",                  emoji: "♛", accent: "ink" },
  { ar: "الميداليات",    en: "Medals",           arSub: "إنجازات على المنصة",              enSub: "Podium achievements",             emoji: "🥇", accent: "gold" },
  { ar: "حصص التدريب",   en: "Training",         arSub: "جلسات أسبوعية احترافية",          enSub: "Weekly professional sessions",    emoji: "♟", accent: "green",  span: "tall" },
  { ar: "ورش العمل",     en: "Workshops",        arSub: "تطوير ذهني وثقافي",               enSub: "Intellectual & cultural growth",  emoji: "📚", accent: "red" },
  { ar: "الفعاليات الثقافية", en: "Cultural Events", arSub: "حضور إماراتي راقٍ",            enSub: "A refined Emirati presence",      emoji: "🎭", accent: "ink" },
  { ar: "حفلات التكريم",  en: "Award Ceremonies", arSub: "تتويج البطلات والمدربات",         enSub: "Honouring our champions",         emoji: "🎉", accent: "gold", span: "wide" },
  { ar: "المجتمع",       en: "Community",        arSub: "مبادرات مجتمعية متميّزة",          enSub: "Standout community initiatives",  emoji: "🤝", accent: "green" },
];

const accentBg  = { red: "bg-red", green: "bg-green2", ink: "bg-ink", gold: "bg-gold" } as const;
const accentGrad = {
  red:   "from-[#D42B3C] to-[#7A1820]",
  green: "from-[#007A38] to-[#003E1C]",
  ink:   "from-[#262626] to-[#0a0a0a]",
  gold:  "from-[#A07820] to-[#56400F]",
} as const;

export default function Gallery() {
  return (
    <section className="bg-ivory2">
      <div className="max-w-wrap mx-auto px-4 sm:px-6 lg:px-10 section-pad">
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <div className="sec-tag inline-flex items-center justify-center gap-3 mb-4 text-red">
            <span className="block w-9 h-[2px] bg-red" />
            <span>
              <span className="ar">معرض الصور</span>
              <span className="en">Gallery</span>
            </span>
            <span className="block w-9 h-[2px] bg-red" />
          </div>
          <h2 className="font-disp t-h2 text-ink mb-5">
            <span className="ar">لحظات من رحلة النادي</span>
            <span className="en">Moments from our journey</span>
          </h2>
          <div className="h-[3px] w-24 mx-auto bg-gradient-to-r from-red via-white to-green2" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 auto-rows-[180px] sm:auto-rows-[220px] gap-3 sm:gap-4">
          {ITEMS.map((item, i) => {
            const span = item.span === "wide"
              ? "sm:col-span-2"
              : item.span === "tall"
                ? "row-span-2"
                : "";
            return (
              <article
                key={i}
                className={`group relative overflow-hidden ${span}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${accentGrad[item.accent]}`} />
                <div className="absolute inset-0 chess-tex-lt opacity-30" />
                <div className={`absolute top-0 left-0 right-0 h-[3px] ${accentBg[item.accent]} opacity-90`} />

                <div className="relative h-full flex flex-col justify-end p-5 sm:p-6 text-ivory">
                  <div className="text-4xl sm:text-5xl mb-auto opacity-80 group-hover:scale-110 transition-transform origin-left">
                    {item.emoji}
                  </div>
                  <div className="font-disp text-lg sm:text-xl leading-tight mb-1.5">
                    <span className="ar">{item.ar}</span>
                    <span className="en">{item.en}</span>
                  </div>
                  <div className="text-[0.7rem] uppercase tracking-[0.16em] opacity-65">
                    <span className="ar">{item.arSub}</span>
                    <span className="en">{item.enSub}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <p className="text-center text-[0.85rem] text-ink3 mt-8 opacity-70 italic">
          <span className="ar">معرض رسمي بالصور قريباً.</span>
          <span className="en">An official photo gallery is coming soon.</span>
        </p>
      </div>
    </section>
  );
}
