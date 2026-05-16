import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/layout/PageHeader";
import NewsPreview from "@/components/home/NewsPreview";
import { getNews } from "@/lib/queries/home";

export const metadata = {
  title: "News — Chess & Culture Club for Women, Sharjah",
  description:
    "Latest reporting, results, and announcements from the Chess & Culture Club for Women in Sharjah.",
};

export const revalidate = 60;

export default async function NewsPage() {
  const news = await getNews(50);

  return (
    <>
      <Navbar />
      <main id="main">
        <PageHeader
          kickerAr="غرفة الأخبار"
          kickerEn="Newsroom"
          titleAr="آخر أخبار النادي"
          titleEn="Latest from the Club"
          leadAr="تغطية رسمية للنتائج والبطولات والإعلانات المؤسسية."
          leadEn="Official coverage of results, tournaments, and institutional announcements."
          crumbs={[{ href: "/news", ar: "الأخبار", en: "News" }]}
        />
        <NewsPreview items={news} />
      </main>
      <Footer />
    </>
  );
}
