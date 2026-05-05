import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import NewsPreview from "@/components/home/NewsPreview";
import TournamentsPreview from "@/components/home/TournamentsPreview";
import BoardPreview from "@/components/home/BoardPreview";
import AboutPreview from "@/components/home/AboutPreview";
import { getNews, getTournaments, getBoardMembers } from "@/lib/queries/home";

export const revalidate = 60;

export default async function HomePage() {
  const [news, tournaments, board] = await Promise.all([
    getNews(3),
    getTournaments(3),
    getBoardMembers(),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <NewsPreview items={news} />
        <TournamentsPreview items={tournaments} />
        <BoardPreview members={board} />
        <AboutPreview />
      </main>
      <Footer />
    </>
  );
}
