import Link from "next/link";

export const metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        background: "var(--ds-surface-1, #FCFCFB)",
        color: "var(--ds-text-1, #111111)",
      }}
    >
      <div style={{ maxWidth: 520, textAlign: "center" }}>
        <div
          aria-hidden
          style={{
            display: "flex",
            width: 96,
            height: 5,
            margin: "0 auto 2.25rem",
          }}
        >
          <div style={{ flex: 1, background: "#C8102E" }} />
          <div style={{ flex: 1, background: "#FFFFFF" }} />
          <div style={{ flex: 1, background: "#117A4F" }} />
        </div>

        <div
          className="font-disp"
          style={{ fontSize: "clamp(3.5rem,9vw,5.5rem)", fontWeight: 700, lineHeight: 1, color: "#0A5234" }}
        >
          404
        </div>

        <h1 className="font-disp" style={{ fontSize: "1.5rem", margin: "1.25rem 0 .75rem" }}>
          <span className="ar">الصفحة غير موجودة</span>
          <span className="en">This page could not be found</span>
        </h1>

        <p style={{ fontSize: ".95rem", lineHeight: 1.8, color: "var(--ds-text-3,#5E5E5E)", marginBottom: "2rem" }}>
          <span className="ar">قد يكون الرابط قديماً أو غير صحيح. عودي إلى الصفحة الرئيسية للمتابعة.</span>
          <span className="en">The link may be outdated or incorrect. Return to the homepage to continue.</span>
        </p>

        <Link href="/" className="btn btn-primary" style={{ justifyContent: "center" }}>
          <span className="ar">العودة إلى الرئيسية</span>
          <span className="en">Back to home</span>
        </Link>
      </div>
    </main>
  );
}
