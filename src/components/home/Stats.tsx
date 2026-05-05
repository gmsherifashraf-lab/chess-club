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
      <div className="max-w-wrap mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {STATS.map((s, i) => (
            <div
              key={i}
              className="group relative text-center py-5 transition-transform hover:-translate-y-1"
            >
              <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-12 h-[2px] ${s.accent} opacity-80 group-hover:w-20 transition-all`} />
              <div className="font-disp t-stat text-ink mb-3">
                {s.value}
              </div>
              <div className="text-[0.72rem] sm:text-[0.78rem] uppercase tracking-[0.2em] text-ink3 font-semibold">
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
