import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/layout/PageHeader";
import Gallery from "@/components/home/Gallery";
import { getGalleryImages } from "@/lib/queries/home";

export const metadata = {
  title: "Gallery — Chess & Culture Club for Women, Sharjah",
  description:
    "Photographs from training sessions, tournaments, and cultural events of the Chess & Culture Club for Women in Sharjah.",
};

export const revalidate = 60;

export default async function GalleryPage() {
  const gallery = await getGalleryImages(60);

  return (
    <>
      <Navbar />
      <main id="main">
        <PageHeader
          kickerAr="المعرض"
          kickerEn="Gallery"
          titleAr="من التدريب والبطولات والفعاليات"
          titleEn="From Training, Tournaments & Events"
          leadAr="أرشيف مصوّر لمسيرة النادي ولاعباته عبر المواسم."
          leadEn="A photographic record of the club and its players across the seasons."
          crumbs={[{ href: "/gallery", ar: "المعرض", en: "Gallery" }]}
        />
        <Gallery items={gallery} hideHeader />
      </main>
      <Footer />
    </>
  );
}
