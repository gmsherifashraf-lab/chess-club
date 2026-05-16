"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app error]", error);
  }, [error]);

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
        <div aria-hidden style={{ display: "flex", width: 96, height: 5, margin: "0 auto 2.25rem" }}>
          <div style={{ flex: 1, background: "#C8102E" }} />
          <div style={{ flex: 1, background: "#FFFFFF" }} />
          <div style={{ flex: 1, background: "#117A4F" }} />
        </div>

        <h1 className="font-disp" style={{ fontSize: "1.6rem", marginBottom: ".75rem" }}>
          <span className="ar">حدث خطأ غير متوقع</span>
          <span className="en">Something went wrong</span>
        </h1>

        <p style={{ fontSize: ".95rem", lineHeight: 1.8, color: "var(--ds-text-3,#5E5E5E)", marginBottom: "2rem" }}>
          <span className="ar">نعتذر عن الخلل. يمكنك إعادة المحاولة أو العودة إلى الصفحة الرئيسية.</span>
          <span className="en">We are sorry for the disruption. Try again, or return to the homepage.</span>
        </p>

        <div style={{ display: "flex", gap: ".75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={reset} className="btn btn-primary" style={{ justifyContent: "center" }}>
            <span className="ar">إعادة المحاولة</span>
            <span className="en">Try again</span>
          </button>
          <Link href="/" className="btn btn-secondary" style={{ justifyContent: "center" }}>
            <span className="ar">الرئيسية</span>
            <span className="en">Home</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
