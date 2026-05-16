import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Chess & Culture Club for Women, Sharjah";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "76px 88px",
          background:
            "linear-gradient(165deg, #0C1310 0%, #0A1F16 55%, #070B09 100%)",
          color: "#F4F6F4",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ display: "flex", width: 132, height: 6 }}>
            <div style={{ flex: 1, background: "#C8102E" }} />
            <div style={{ flex: 1, background: "#FFFFFF" }} />
            <div style={{ flex: 1, background: "#117A4F" }} />
          </div>
          <div
            style={{
              fontSize: 22,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "rgba(244,246,244,0.66)",
            }}
          >
            Sharjah, UAE · Since 1991
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 74, fontWeight: 700, lineHeight: 1.05 }}>
            Chess &amp; Culture Club
          </div>
          <div style={{ fontSize: 74, fontWeight: 700, lineHeight: 1.05, color: "#2C9A6A" }}>
            for Women
          </div>
          <div style={{ fontSize: 40, color: "rgba(244,246,244,0.78)", marginTop: 8 }}>
            نادي الشطرنج والثقافة للفتيات بالشارقة
          </div>
        </div>

        <div style={{ fontSize: 24, color: "rgba(244,246,244,0.55)" }}>
          project-oimbc.vercel.app
        </div>
      </div>
    ),
    size,
  );
}
