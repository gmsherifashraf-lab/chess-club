import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import AboutPreview from "@/components/home/AboutPreview";
import History from "@/components/home/History";
import VisionMission from "@/components/home/VisionMission";
import Achievements from "@/components/home/Achievements";
import TournamentsPreview from "@/components/home/TournamentsPreview";
import TrainingPrograms from "@/components/home/TrainingPrograms";
import BoardOfDirectors from "@/components/home/BoardOfDirectors";
import Community from "@/components/home/Community";
import NewsPreview from "@/components/home/NewsPreview";
import Partners from "@/components/home/Partners";
import Gallery from "@/components/home/Gallery";
import Testimonials from "@/components/home/Testimonials";
import SocialSection from "@/components/home/SocialSection";
import Contact from "@/components/home/Contact";

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
      <Navbar />
      <main>
        {/* Hero — cinematic intro */}
        <Hero />

        {/* Headline metrics */}
        <Stats />

        {/* Institutional narrative */}
        <AboutPreview />

        {/* Three-decade history */}
        <History />

        {/* Vision, Mission, Core Values */}
        <VisionMission />

        {/* Awards and recognition */}
        <Achievements />

        {/* Live tournaments preview */}
        <TournamentsPreview items={tournaments} />

        {/* Training programmes */}
        <TrainingPrograms />

        {/* Board + Executive Leadership */}
        <BoardOfDirectors />

        {/* Cultural & community work */}
        <Community />

        {/* Live news preview */}
        <NewsPreview items={news} />

        {/* Institutional partners */}
        <Partners />

        {/* Visual gallery */}
        <Gallery items={gallery} />

        {/* Testimonials */}
        <Testimonials />

        {/* Real social media integration */}
        <SocialSection />

        {/* Contact / CTA */}
        <Contact />
      </main>
      <Footer />
    </>
  );
}
