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
        <section style={{ background: "#EDE9E2", padding: "4rem 1.5rem 1rem" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div className="sec-tag">
              <span className="ar">البطولات</span>
              <span className="en">Tournaments</span>
            </div>
            <h1 className="font-disp t-h1" style={{ color: "#141414" }}>
              <span className="ar">جدول البطولات القادمة</span>
              <span className="en">Upcoming Tournaments</span>
            </h1>
            <div className="flag-h" style={{ width: 72, marginTop: "1rem" }} />
          </div>
        </section>
        <TournamentsPreview items={tournaments} />
      </main>
      <Footer />
    </>
  );
}
