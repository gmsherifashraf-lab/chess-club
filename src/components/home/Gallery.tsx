import type { GalleryImage } from "@/lib/queries/home";

// Built-in fallback set used when no rows are published in
// gallery_images. Same shape as a DB row (id is faked client-side).
const FALLBACK: GalleryImage[] = [
  { id: "f1", title_ar: "البطولات",          title_en: "Tournaments",      subtitle_ar: "بطولات الشطرنج النسائية",   subtitle_en: "Women's chess championships", image_url: null, emoji: "🏆", span: "wide",   accent: "red",   sort_order: 0 },
  { id: "f2", title_ar: "اللاعبات",           title_en: "Players",          subtitle_ar: "بطلات النادي",               subtitle_en: "Club champions",              image_url: null, emoji: "♛", span: "normal", accent: "ink",   sort_order: 1 },
  { id: "f3", title_ar: "الميداليات",        title_en: "Medals",           subtitle_ar: "إنجازات على المنصة",          subtitle_en: "Podium achievements",         image_url: null, emoji: "🥇", span: "normal", accent: "gold",  sort_order: 2 },
  { id: "f4", title_ar: "حصص التدريب",       title_en: "Training",         subtitle_ar: "جلسات أسبوعية احترافية",      subtitle_en: "Weekly professional sessions",image_url: null, emoji: "♟", span: "tall",   accent: "green", sort_order: 3 },
  { id: "f5", title_ar: "ورش العمل",          title_en: "Workshops",        subtitle_ar: "تطوير ذهني وثقافي",            subtitle_en: "Intellectual & cultural growth", image_url: null, emoji: "📚", span: "normal", accent: "red",   sort_order: 4 },
  { id: "f6", title_ar: "الفعاليات الثقافية", title_en: "Cultural Events",  subtitle_ar: "حضور إماراتي راقٍ",            subtitle_en: "A refined Emirati presence",  image_url: null, emoji: "🎭", span: "normal", accent: "ink",   sort_order: 5 },
  { id: "f7", title_ar: "حفلات التكريم",      title_en: "Award Ceremonies", subtitle_ar: "تتويج البطلات والمدربات",      subtitle_en: "Honouring our champions",     image_url: null, emoji: "🎉", span: "wide",   accent: "gold",  sort_order: 6 },
  { id: "f8", title_ar: "المجتمع",            title_en: "Community",        subtitle_ar: "مبادرات مجتمعية متميّزة",      subtitle_en: "Standout community initiatives", image_url: null, emoji: "🤝", span: "normal", accent: "green", sort_order: 7 },
];

const accentBg = { red: "bg-red", green: "bg-green2", ink: "bg-ink", gold: "bg-gold" } as const;
const accentGrad = {
  red:   "from-[#D42B3C] to-[#7A1820]",
  green: "from-[#007A38] to-[#003E1C]",
  ink:   "from-[#262626] to-[#0a0a0a]",
  gold:  "from-[#A07820] to-[#56400F]",
} as const;

export default function Gallery({ items }: { items?: GalleryImage[] }) {
  const tiles = items && items.length > 0 ? items : FALLBACK;
  const hasRealImages = tiles.some((t) => !!t.image_url);

  return (
    <section className="relative lux-dark lux-tex lux-section">
      <div
        aria-hidden
        className="absolute -top-20 left-0 w-[420px] h-[420px] rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, #1F6B4F 0%, transparent 65%)" }}
      />
      <div className="relative max-w-wrap mx-auto px-4 sm:px-6 lg:px-10 section-pad">
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <span className="eyebrow-lux mb-5">
            <span className="dot" />
            <span className="ar">معرض الصور</span>
            <span className="en">Gallery</span>
          </span>
          <h2 className="font-disp t-mega text-white mb-6 mt-6">
            <span className="ar">لحظات من رحلة النادي.</span>
            <span className="en">Moments from our journey.</span>
          </h2>
          <div className="h-[2px] w-32 mx-auto bg-gradient-to-r from-[#1F6B4F] via-white to-[#C8102E]" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 auto-rows-[180px] sm:auto-rows-[220px] gap-3 sm:gap-4">
          {tiles.map((item) => {
            const span =
              item.span === "wide" ? "sm:col-span-2"
              : item.span === "tall" ? "row-span-2"
              : "";

            return (
              <article
                key={item.id}
                className={`group relative overflow-hidden ${span} transition-transform hover:-translate-y-0.5`}
              >
                {/* Real image — when present */}
                {item.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image_url}
                    alt={item.title_en || item.title_ar}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                ) : (
                  /* Gradient fallback tile */
                  <>
                    <div className={`absolute inset-0 bg-gradient-to-br ${accentGrad[item.accent]}`} />
                    <div className="absolute inset-0 chess-tex-lt opacity-30" />
                  </>
                )}

                {/* Caption gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

                {/* Top accent strip */}
                <div className={`absolute top-0 left-0 right-0 h-[3px] ${accentBg[item.accent]} opacity-90`} />

                {/* Caption */}
                <div className="relative h-full flex flex-col justify-end p-5 sm:p-6 text-ivory">
                  {!item.image_url && (
                    <div className="text-4xl sm:text-5xl mb-auto opacity-80 group-hover:scale-110 transition-transform origin-left">
                      {item.emoji ?? "✦"}
                    </div>
                  )}
                  <div className="font-disp text-lg sm:text-xl leading-tight mb-1.5 drop-shadow">
                    <span className="ar">{item.title_ar}</span>
                    <span className="en">{item.title_en}</span>
                  </div>
                  {(item.subtitle_ar || item.subtitle_en) && (
                    <div className="text-[0.7rem] uppercase tracking-[0.16em] opacity-80">
                      <span className="ar">{item.subtitle_ar}</span>
                      <span className="en">{item.subtitle_en}</span>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {!hasRealImages && (
          <p className="text-center text-[0.85rem] text-white/50 mt-10 italic">
            <span className="ar">معرض رسمي بالصور قريباً.</span>
            <span className="en">An official photo gallery is coming soon.</span>
          </p>
        )}
      </div>
    </section>
  );
}
