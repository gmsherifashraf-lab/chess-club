import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TournamentsPreview from "@/components/home/TournamentsPreview";
import { getTournaments } from "@/lib/queries/home";

export const metadata = {
  title: "Tournaments — Chess & Culture Club",
};

export const revalidate = 60;

export default async function TournamentsPage() {
  const tournaments = await getTournaments(50);

  return (
    <>
      <Navbar />
      <main>
        <section className="pg-hdr text-ivory">
          <div className="max-w-wrap mx-auto px-4 sm:px-6 lg:px-10 pt-28 pb-16 sm:pt-32 sm:pb-20 relative">
            <div className="sec-tag inline-flex items-center gap-3 mb-4 text-ivory">
              <span className="block w-9 h-[2px] bg-[#1F6B4F]" />
              <span>
                <span className="ar">البطولات</span>
                <span className="en">Tournaments</span>
              </span>
            </div>
            <h1 className="font-disp t-h1 text-ivory mb-4">
              <span className="ar">جدول البطولات القادمة</span>
              <span className="en">Upcoming Tournaments</span>
            </h1>
            <div className="h-[2px] w-32 bg-gradient-to-r from-[#1F6B4F] via-white to-[#C8102E]" />
          </div>
        </section>
        <TournamentsPreview items={tournaments} />
      </main>
      <Footer />
    </>
  );
}
