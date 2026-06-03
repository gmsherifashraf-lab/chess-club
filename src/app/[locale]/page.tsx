import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import Hero from "@/components/home/Hero";
import QuickLinks from "@/components/home/QuickLinks";
import FeaturedStrip from "@/components/home/FeaturedStrip";
import Stats from "@/components/home/Stats";
import AboutPreview from "@/components/home/AboutPreview";
import NewsPreview from "@/components/home/NewsPreview";
import TournamentsPreview from "@/components/home/TournamentsPreview";
import InTheMedia from "@/components/home/InTheMedia";
import Achievements from "@/components/home/Achievements";
import BoardOfDirectors from "@/components/home/BoardOfDirectors";
import Gallery from "@/components/home/Gallery";
import Sponsors from "@/components/home/Sponsors";

import ScrollProgress from "@/components/motion/ScrollProgress";

import {
  getNews, getTournaments, getGalleryImages,
  getBoardMembers, getPartners, getStats,
  type GalleryImage,
} from "@/lib/queries/home";
import { PHOTO_LIST } from "@/lib/homepageMedia";

/* Curated club photography, surfaced as real gallery tiles so the editorial
   gallery never falls back to placeholder panels. Prepended to any
   CMS-managed images. */
const LOCAL_GALLERY: GalleryImage[] = PHOTO_LIST.map((p, i) => {
  const [tAr, sAr] = p.tagAr.split("·").map((s) => s.trim());
  const [tEn, sEn] = p.tagEn.split("·").map((s) => s.trim());
  // Uniform tiles so the curated set tiles cleanly on its own; CMS images
  // appended after can still carry their own wide/tall spans for bento rhythm.
  const span = "normal" as GalleryImage["span"];
  const accent = (["green", "red", "ink", "green"] as const)[i];
  return {
    id: `local-${i}`,
    title_ar: tAr,
    title_en: tEn,
    subtitle_ar: sAr ?? p.altAr,
    subtitle_en: sEn ?? p.altEn,
    image_url: p.src,
    emoji: null,
    span,
    accent,
    sort_order: i,
  };
});

export const revalidate = 60;

export default async function HomePage() {
  const [news, tournaments, gallery, board, partners, stats] = await Promise.all([
    getNews(3),
    getTournaments(3),
    getGalleryImages(12),
    getBoardMembers(),
    getPartners(),
    getStats(),
  ]);

  // Real club photography first, then any CMS-managed gallery images.
  const galleryTiles = [...LOCAL_GALLERY, ...gallery];

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main id="main">
        {/* 1 — Cinematic federation hero */}
        <Hero />

        {/* 2 — Quick-links bento: wayfinding into the club's content */}
        <QuickLinks />

        {/* 3 — In focus: auto-scrolling cinematic highlight reel */}
        <FeaturedStrip />

        {/* 4 — The club in numbers */}
        <Stats items={stats} />

        {/* 5 — Institutional narrative (dark band) */}
        <AboutPreview />

        {/* 6 — Latest news */}
        <NewsPreview items={news} />

        {/* 7 — Upcoming tournaments & events */}
        <TournamentsPreview items={tournaments} />

        {/* 8 — In the media: UAE press & broadcast coverage */}
        <InTheMedia />

        {/* 9 — Honour roll: the club's standing competitive record */}
        <Achievements />

        {/* 10 — Board of directors & leadership */}
        <BoardOfDirectors members={board} />

        {/* 11 — Editorial gallery */}
        <Gallery items={galleryTiles} />

        {/* 12 — Partners & supporters */}
        <Sponsors partners={partners} />
      </main>
      {/* 9 — Federation footer: CTA, partners, contact, newsletter */}
      <Footer partners={partners} />
    </>
  );
}
