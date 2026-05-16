import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import AboutPreview from "@/components/home/AboutPreview";
import NewsPreview from "@/components/home/NewsPreview";
import TournamentsPreview from "@/components/home/TournamentsPreview";
import BoardOfDirectors from "@/components/home/BoardOfDirectors";
import Gallery from "@/components/home/Gallery";

import ScrollProgress from "@/components/motion/ScrollProgress";

import { getNews, getTournaments, getGalleryImages } from "@/lib/queries/home";

export const revalidate = 60;

export default async function HomePage() {
  const [news, tournaments, gallery] = await Promise.all([
    getNews(3),
    getTournaments(3),
    getGalleryImages(12),
  ]);

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main id="main">
        {/* 1 — Cinematic federation hero */}
        <Hero />

        {/* 2 — The club in numbers */}
        <Stats />

        {/* 3 — Institutional narrative (dark band) */}
        <AboutPreview />

        {/* 4 — Latest news */}
        <NewsPreview items={news} />

        {/* 5 — Upcoming tournaments & events */}
        <TournamentsPreview items={tournaments} />

        {/* 6 — Board of directors & leadership */}
        <BoardOfDirectors />

        {/* 7 — Editorial gallery */}
        <Gallery items={gallery} />
      </main>
      {/* 8 — Federation footer: CTA, partners, contact, newsletter */}
      <Footer />
    </>
  );
}
