import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import Hero from "@/components/home/Hero";
import QuickLinks from "@/components/home/QuickLinks";
import Stats from "@/components/home/Stats";
import AboutPreview from "@/components/home/AboutPreview";
import NewsPreview from "@/components/home/NewsPreview";
import TournamentsPreview from "@/components/home/TournamentsPreview";
import Achievements from "@/components/home/Achievements";
import BoardOfDirectors from "@/components/home/BoardOfDirectors";
import Gallery from "@/components/home/Gallery";
import Sponsors from "@/components/home/Sponsors";

import ScrollProgress from "@/components/motion/ScrollProgress";

import {
  getNews, getTournaments, getGalleryImages,
  getBoardMembers, getPartners, getStats,
} from "@/lib/queries/home";

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

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main id="main">
        {/* 1 — Cinematic federation hero */}
        <Hero />

        {/* 2 — Quick-links bento: wayfinding into the club's content */}
        <QuickLinks />

        {/* 3 — The club in numbers */}
        <Stats items={stats} />

        {/* 4 — Institutional narrative (dark band) */}
        <AboutPreview />

        {/* 5 — Latest news */}
        <NewsPreview items={news} />

        {/* 6 — Upcoming tournaments & events */}
        <TournamentsPreview items={tournaments} />

        {/* 7 — Honour roll: the club's standing competitive record */}
        <Achievements />

        {/* 8 — Board of directors & leadership */}
        <BoardOfDirectors members={board} />

        {/* 9 — Editorial gallery */}
        <Gallery items={gallery} />

        {/* 10 — Partners & supporters */}
        <Sponsors partners={partners} />
      </main>
      {/* 9 — Federation footer: CTA, partners, contact, newsletter */}
      <Footer partners={partners} />
    </>
  );
}
