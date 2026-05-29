import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/layout/PageHeader";
import TournamentsPreview from "@/components/home/TournamentsPreview";
import { getTournaments } from "@/lib/queries/home";

export const metadata = {
  title: "Tournaments — Chess & Culture Club for Women, Sharjah",
  description:
    "The official fixture calendar of the Chess & Culture Club for Women in Sharjah.",
};

export const revalidate = 60;

export default async function TournamentsPage() {
  const tournaments = await getTournaments(50);

  return (
    <>
      <Navbar />
      <main id="main">
        <PageHeader
          kickerAr="رزنامة الموسم"
          kickerEn="Season Calendar"
          titleAr="جدول البطولات والفعاليات"
          titleEn="Tournaments & Events"
          leadAr="البطولات الرسمية المعتمدة من مجلس إدارة النادي."
          leadEn="Official fixtures sanctioned by the club's board of directors."
          crumbs={[{ href: "/tournaments", ar: "البطولات", en: "Tournaments" }]}
        />
        <TournamentsPreview items={tournaments} />
      </main>
      <Footer />
    </>
  );
}
