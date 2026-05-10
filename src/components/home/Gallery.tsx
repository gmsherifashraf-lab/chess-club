import type { GalleryImage } from "@/lib/queries/home";

// Built-in fallback set used when no rows are published in
// gallery_images. Chess-piece glyphs are used in place of emoji so the
// fallback reads as a press-kit placeholder, not decoration.
const FALLBACK: GalleryImage[] = [
  { id: "f1", title_ar: "البطولات",          title_en: "Tournaments",      subtitle_ar: "بطولات الشطرنج النسائية",   subtitle_en: "Women's chess championships",  image_url: null, emoji: "♛", span: "wide",   accent: "red",   sort_order: 0 },
  { id: "f2", title_ar: "اللاعبات",           title_en: "Players",          subtitle_ar: "بطلات النادي",               subtitle_en: "Club champions",               image_url: null, emoji: "♟", span: "normal", accent: "ink",   sort_order: 1 },
  { id: "f3", title_ar: "الميداليات",        title_en: "Medals",           subtitle_ar: "إنجازات على المنصة",          subtitle_en: "Podium achievements",          image_url: null, emoji: "♞", span: "normal", accent: "gold",  sort_order: 2 },
  { id: "f4", title_ar: "حصص التدريب",       title_en: "Training",         subtitle_ar: "جلسات أسبوعية احترافية",      subtitle_en: "Weekly training sessions",     image_url: null, emoji: "♜", span: "tall",   accent: "green", sort_order: 3 },
  { id: "f5", title_ar: "ورش العمل",          title_en: "Workshops",        subtitle_ar: "تطوير ذهني وثقافي",            subtitle_en: "Cultural workshops",          image_url: null, emoji: "♝", span: "normal", accent: "red",   sort_order: 4 },
  { id: "f6", title_ar: "الفعاليات الثقافية", title_en: "Cultural events",  subtitle_ar: "حضور إماراتي راقٍ",            subtitle_en: "Cultural representation",      image_url: null, emoji: "♚", span: "normal", accent: "ink",   sort_order: 5 },
  { id: "f7", title_ar: "حفلات التكريم",      title_en: "Recognition",      subtitle_ar: "تتويج البطلات والمدربات",      subtitle_en: "Honouring players and coaches", image_url: null, emoji: "♛", span: "wide",   accent: "gold",  sort_order: 6 },
  { id: "f8", title_ar: "المجتمع",            title_en: "Community",        subtitle_ar: "مبادرات مجتمعية",              subtitle_en: "Community initiatives",        image_url: null, emoji: "♟", span: "normal", accent: "green", sort_order: 7 },
];

const accentBg = { red: "bg-red", green: "bg-green2", ink: "bg-ink", gold: "bg-gold" } as const;
const accentGrad = {
  red:   "from-[#9D0C24] to-[#5C081A]",
  green: "from-[#0E5236] to-[#073023]",
  ink:   "from-[#1f1f1f] to-[#080808]",
  gold:  "from-[#8E661A] to-[#56400F]",
} as const;

export default function Gallery({ items }: { items?: GalleryImage[] }) {
  const tiles = items && items.length > 0 ? items : FALLBACK;
  const hasRealImages = tiles.some((t) => !!t.image_url);

  return (
    <section className="relative bg-ivory2">
      <div className="relative max-w-wrap mx-auto px-4 sm:px-6 lg:px-10 py-24 sm:py-28">
        {/* No eyebrow — opens with headline + status aside, like a print catalogue */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-5 items-end mb-12 sm:mb-14 pb-6 border-b border-stone">
          <h2 className="lg:col-span-7 font-disp text-[clamp(2rem,3.6vw,2.8rem)] text-ink leading-[1.08] tracking-tight max-w-2xl">
            <span className="ar">من جلسات التدريب والبطولات والفعاليات.</span>
            <span className="en">From training, tournaments, and events.</span>
          </h2>
          <div className="lg:col-span-5 lg:pb-2 flex items-baseline gap-4 text-[0.7rem] uppercase tracking-[0.22em] text-ink3 font-bold">
            <span className="ds-dot bg-[#0B3D2E]" />
            <span className="ar">المعرض الرسمي · يُحدَّث مع كل موسم</span>
            <span className="en">Official set · updated each season</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 auto-rows-[180px] sm:auto-rows-[220px] gap-2 sm:gap-3">
          {tiles.map((item) => {
            const span =
              item.span === "wide" ? "sm:col-span-2"
              : item.span === "tall" ? "row-span-2"
              : "";

            return (
              <article
                key={item.id}
                className={`group relative overflow-hidden ${span} transition-transform duration-480 ease-emphasis hover:-translate-y-0.5`}
              >
                {/* Real image — when present */}
                {item.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image_url}
                    alt={item.title_en || item.title_ar}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-720 ease-out group-hover:scale-[1.03]"
                  />
                ) : (
                  /* Gradient fallback tile — chess-piece glyph instead of emoji */
                  <>
                    <div className={`absolute inset-0 bg-gradient-to-br ${accentGrad[item.accent]}`} />
                    <div className="absolute inset-0 chess-tex-lt opacity-40" />
                    <span
                      aria-hidden
                      className="absolute -bottom-6 -right-2 leading-none select-none transition-transform duration-720 ease-emphasis group-hover:translate-x-1 group-hover:-translate-y-1"
                      style={{
                        fontFamily: "'Noto Sans Symbols', serif",
                        fontSize: item.span === "tall" ? "20rem" : "13rem",
                        color: "rgba(255,255,255,0.07)",
                      }}
                    >
                      {item.emoji ?? "♛"}
                    </span>
                  </>
                )}

                {/* Caption gradient overlay — softer */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

                {/* Hairline accent — top */}
                <div className={`absolute top-0 left-0 right-0 h-px ${accentBg[item.accent]} opacity-70`} />

                {/* Caption */}
                <div className="relative h-full flex flex-col justify-end p-5 sm:p-6 text-ivory">
                  <div className="font-disp text-base sm:text-lg leading-tight mb-1.5 drop-shadow-sm">
                    <span className="ar">{item.title_ar}</span>
                    <span className="en">{item.title_en}</span>
                  </div>
                  {(item.subtitle_ar || item.subtitle_en) && (
                    <div className="text-[0.66rem] uppercase tracking-[0.16em] opacity-70">
                      <span className="ar">{item.subtitle_ar}</span>
                      <span className="en">{item.subtitle_en}</span>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* Footnote — credit line / placeholder context */}
        {!hasRealImages && (
          <p className="mt-8 text-[0.75rem] text-ink3/85 italic max-w-2xl">
            <span className="ar">— الصور المعروضة أعلاه تمثيلية. الإصدار الكامل يُحدَّث ضمن الإعداد لتقرير الموسم.</span>
            <span className="en">— The tiles above are placeholders. The full set will be published with the season report.</span>
          </p>
        )}
      </div>
    </section>
  );
}
