/**
 * Homepage media manifest — the curated set of real club photography and
 * external press/video coverage used to densify the marketing homepage.
 *
 * Plain data only (no "use client") so server components may import it.
 * Photos live in /public/images/homepage (web-optimized copies produced by
 * scripts/optimize-homepage-media.mjs). External links are the club's
 * verified press appearances supplied by the club.
 */

export interface HomePhoto {
  /** Public path under /public. */
  src: string;
  /** Intrinsic aspect ratio, used to reserve space and avoid CLS. */
  ratio: number;
  altAr: string;
  altEn: string;
  /** Short editorial caption shown on tiles / frames. */
  tagAr: string;
  tagEn: string;
}

/** Curated club photography. Order is the visual narrative. */
export const PHOTOS = {
  clubWall: {
    src: "/images/homepage/club-wall-group.jpg",
    ratio: 1088 / 636,
    altAr: "مدرّبات النادي مع نشأة من اللاعبات أمام شعار النادي",
    altEn: "Club coaches with young players in front of the club emblem",
    tagAr: "النشء · جيل البطلات القادم",
    tagEn: "Youth · the next generation",
  },
  award: {
    src: "/images/homepage/award-ceremony.jpg",
    ratio: 1343 / 871,
    altAr: "تكريم في النادي بحضور القيادات النسائية",
    altEn: "A recognition ceremony at the club",
    tagAr: "التكريم · تقدير الإنجاز",
    tagEn: "Recognition · honouring achievement",
  },
  clock: {
    src: "/images/homepage/tournament-clock.jpg",
    ratio: 1000 / 750,
    altAr: "لاعبتان عند رقعة الشطرنج وساعة البطولة",
    altEn: "Players at the board with the tournament clock",
    tagAr: "المنافسة · أجواء البطولة",
    tagEn: "Competition · tournament floor",
  },
  venue: {
    src: "/images/homepage/venue-sharjah.jpg",
    ratio: 2000 / 1333,
    altAr: "واجهة الشارقة المائية حيث يقع النادي",
    altEn: "The Sharjah waterfront, home of the club",
    tagAr: "الشارقة · مقرّ النادي",
    tagEn: "Sharjah · home of the club",
  },
} as const satisfies Record<string, HomePhoto>;

/** Ordered list for galleries / strips. */
export const PHOTO_LIST: HomePhoto[] = [
  PHOTOS.clubWall,
  PHOTOS.clock,
  PHOTOS.award,
  PHOTOS.venue,
];

export type MediaKind = "video" | "article";

export interface MediaItem {
  kind: MediaKind;
  url: string;
  /** Source / outlet name. */
  sourceAr: string;
  sourceEn: string;
  titleAr: string;
  titleEn: string;
  /** Display date, already formatted. */
  date: string;
  /** Cover image: a YouTube thumbnail for videos, a club photo for articles. */
  cover: string;
  altEn: string;
}

const yt = (id: string) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

/**
 * "In the media" — the club's coverage in UAE press and broadcast.
 * Titles are taken verbatim from the sources (YouTube/Al Bayan); the
 * Sharjah24 print piece carries an honest source + date label.
 */
export const MEDIA: MediaItem[] = [
  {
    kind: "video",
    url: "https://www.youtube.com/watch?v=4yfUuRPOCts",
    sourceAr: "تلفزيون الشارقة",
    sourceEn: "Sharjah TV",
    titleAr: "نادي الشطرنج والثقافة للفتيات ينتقل لمقره الجديد في منطقة الرمقية",
    titleEn: "The Chess & Culture Club for Women moves to its new home in Al Ramaqiya",
    date: "2024",
    cover: yt("4yfUuRPOCts"),
    altEn: "Sharjah TV report on the club's new headquarters",
  },
  {
    kind: "video",
    url: "https://www.youtube.com/watch?v=XJQI_PuxDxw",
    sourceAr: "الشارقة 24",
    sourceEn: "Sharjah 24",
    titleAr: "نادي الشطرنج يعزّز الفكر الإبداعي لمنتسبات صيف الشارقة",
    titleEn: "Chess club fosters creative thinking among Sharjah Summer members",
    date: "2023",
    cover: yt("XJQI_PuxDxw"),
    altEn: "Sharjah 24 feature on the club's summer programme",
  },
  {
    kind: "article",
    url: "https://www.albayan.ae/sports/all-games/2024-08-29-1.4926095",
    sourceAr: "صحيفة البيان",
    sourceEn: "Al Bayan",
    titleAr: "«ملهمة نجاح» في احتفالية «فتيات الشارقة» بيوم المرأة الإماراتية",
    titleEn: "“Inspiration of success”: Sharjah girls celebrate Emirati Women's Day",
    date: "29 Aug 2024",
    cover: "/images/homepage/award-ceremony.jpg",
    altEn: "Al Bayan coverage of the club's Emirati Women's Day celebration",
  },
  {
    kind: "article",
    url: "https://sharjah24.ae/ar/Articles/2023/07/10/al022",
    sourceAr: "الشارقة 24",
    sourceEn: "Sharjah 24",
    titleAr: "نادي الشطرنج والثقافة للفتيات بالشارقة في تغطية صحفية",
    titleEn: "The Chess & Culture Club for Women in the regional press",
    date: "10 Jul 2023",
    cover: "/images/homepage/tournament-clock.jpg",
    altEn: "Sharjah 24 press coverage of the club",
  },
];
