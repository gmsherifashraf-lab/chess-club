"use client";

const STATS = [
  { value: "180+", ar: "لاعبة نشطة",       en: "Active Players",     accent: "bg-red" },
  { value: "12",   ar: "مدرّبة معتمدة",     en: "Certified Coaches",  accent: "bg-green2" },
  { value: "8",    ar: "بطولات 2026",      en: "Tournaments 2026",   accent: "bg-ink" },
  { value: "9",    ar: "سنوات من العطاء",   en: "Years Strong",       accent: "bg-red" },
];

export default function Stats() {
  return (
    <section className="bg-white border-y border-stone">
      <div className="max-w-wrap mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          {STATS.map((s, i) => (
            <div
              key={i}
              className="group relative text-center py-4 transition-transform hover:-translate-y-1"
            >
              <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-10 h-[2px] ${s.accent} opacity-70 group-hover:w-16 transition-all`} />
              <div className="font-disp text-4xl sm:text-5xl text-ink leading-none mb-2">
                {s.value}
              </div>
              <div className="text-[0.65rem] sm:text-xs uppercase tracking-[0.2em] text-ink3">
                <span className="ar">{s.ar}</span>
                <span className="en">{s.en}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
