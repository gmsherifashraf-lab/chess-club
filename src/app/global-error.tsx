"use client";

// Replaces the root layout entirely, so it must be fully self-contained
// (no global CSS, no providers, no .ar/.en toggling). Keep it minimal.
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          background: "#FCFCFB",
          color: "#111111",
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 480 }}>
          <div style={{ display: "flex", width: 88, height: 5, margin: "0 auto 2rem" }}>
            <div style={{ flex: 1, background: "#C8102E" }} />
            <div style={{ flex: 1, background: "#FFFFFF" }} />
            <div style={{ flex: 1, background: "#117A4F" }} />
          </div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: ".5rem" }}>
            Something went wrong
          </h1>
          <p dir="rtl" style={{ fontSize: "1rem", color: "#5E5E5E", marginBottom: "1.75rem" }}>
            حدث خطأ غير متوقع. يرجى إعادة المحاولة.
          </p>
          <button
            onClick={reset}
            style={{
              border: "none",
              background: "#0A5234",
              color: "#fff",
              padding: ".8rem 1.6rem",
              fontSize: ".9rem",
              cursor: "pointer",
              borderRadius: 2,
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
