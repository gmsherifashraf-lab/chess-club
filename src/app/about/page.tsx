import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AboutPreview from "@/components/home/AboutPreview";
import Stats from "@/components/home/Stats";

export const metadata = {
  title: "About — Chess & Culture Club",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <section style={{ background: "#EDE9E2", padding: "4rem 1.5rem 1rem" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div className="sec-tag">
              <span className="ar">من نحن</span>
              <span className="en">About</span>
            </div>
            <h1 className="font-disp t-h1" style={{ color: "#141414" }}>
              <span className="ar">قصة نادي الشطرنج والثقافة</span>
              <span className="en">Our Story</span>
            </h1>
            <div className="flag-h" style={{ width: 72, marginTop: "1rem" }} />
          </div>
        </section>
        <Stats />
        <AboutPreview />
      </main>
      <Footer />
    </>
  );
}
