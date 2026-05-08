import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import NewsPreview from "@/components/home/NewsPreview";
import TournamentsPreview from "@/components/home/TournamentsPreview";
import AboutPreview from "@/components/home/AboutPreview";
import { getNews, getTournaments } from "@/lib/queries/home";

export const revalidate = 60;

export default async function HomePage() {
  const [news, tournaments] = await Promise.all([
    getNews(3),
    getTournaments(3),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <NewsPreview items={news} />
        <div className="sec-div" />
        <TournamentsPreview items={tournaments} />
        <AboutPreview />
      </main>
      <Footer />
    </>
  );
}
