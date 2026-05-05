import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import NewsPreview from "@/components/home/NewsPreview";
import { getNews } from "@/lib/queries/home";

export const metadata = {
  title: "News — Chess & Culture Club",
};

export const revalidate = 60;

export default async function NewsPage() {
  const news = await getNews(50);

  return (
    <>
      <Navbar />
      <main>
        <section style={{ background: "#EDE9E2", padding: "4rem 1.5rem 1rem" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div className="sec-tag">
              <span className="ar">الأخبار</span>
              <span className="en">News</span>
            </div>
            <h1 className="font-disp t-h1" style={{ color: "#141414" }}>
              <span className="ar">آخر أخبار النادي</span>
              <span className="en">Latest from the Club</span>
            </h1>
            <div className="flag-h" style={{ width: 72, marginTop: "1rem" }} />
          </div>
        </section>
        <NewsPreview items={news} />
      </main>
      <Footer />
    </>
  );
}
