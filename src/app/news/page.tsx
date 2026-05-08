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
        <section className="bg-ivory2 border-b border-stone">
          <div className="max-w-wrap mx-auto px-4 sm:px-6 lg:px-10 pt-32 pb-16 sm:pt-36 sm:pb-20 relative">
            <span className="eyebrow-light mb-4">
              <span className="dot-emerald" />
              <span className="ar">الأخبار</span>
              <span className="en">News &amp; Media</span>
            </span>
            <h1 className="font-disp t-mega text-ink mt-5 mb-4">
              <span className="ar">آخر أخبار النادي</span>
              <span className="en">Latest from the Club</span>
            </h1>
            <div className="h-[2px] w-32 bg-gradient-to-r from-[#1F6B4F] via-ink to-[#C8102E]" />
          </div>
        </section>
        <NewsPreview items={news} />
      </main>
      <Footer />
    </>
  );
}
