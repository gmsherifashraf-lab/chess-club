"use client";

import DashboardShell, { type NavItem } from "@/components/dashboard/DashboardShell";
import { useRequireAuth } from "@/hooks/useRequireAuth";

const NAV: NavItem[] = [
  { key: "overview",    icon: "⊞", ar: "نظرة عامة",  en: "Overview"    },
  { key: "tournaments", icon: "🏆", ar: "البطولات",   en: "Tournaments" },
  { key: "reports",     icon: "📋", ar: "التقارير",   en: "Reports"     },
];

export default function ParentDashboard() {
  const { loading } = useRequireAuth("parent");

  if (loading) return <Spinner />;

  return (
    <DashboardShell
      roleAr="ولي الأمر" roleEn="Parent"
      roleColor="#141414"
      userInitial="ح"
      navItems={NAV}
      activeTab="overview"
      onTab={() => {}}
    >
      {/* Child card */}
      <div style={{ marginBottom: "1.5rem", background: "#141414", padding: "2rem", position: "relative", overflow: "hidden" }}>
        <div className="flag-h" style={{ position: "absolute", top: 0, left: 0, right: 0 }} />
        <div style={{ display: "flex", alignItems: "center", gap: ".75rem", paddingTop: ".5rem", flexWrap: "wrap" }}>
          <div style={{ width: 68, height: 68, background: "#D42B3C", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Noto Serif Arabic',serif", fontSize: "1.6rem", fontWeight: 700, color: "#fff", flexShrink: 0 }}>ل</div>
          <div>
            <h2 className="font-disp" style={{ color: "#F8F5F0", fontSize: "1.3rem" }}>
              <span className="ar">ليلى الراشد</span><span className="en">Layla Al-Rashid</span>
            </h2>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(0,122,56,.2)", padding: ".22rem .65rem", marginTop: ".4rem" }}>
              <div className="sb-dot" style={{ background: "#007A38" }} />
              <span style={{ fontSize: ".6rem", letterSpacing: ".1em", color: "#007A38", fontFamily: "'Noto Sans Arabic',sans-serif" }}>
                <span className="ar">بطلة الإمارات للشباب 2026</span><span className="en">UAE Junior Champion 2026</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="g4" style={{ marginBottom: "1.5rem" }}>
        <div className="kpi kpi-r">
          <div className="kpi-lbl"><span className="ar">تصنيف FIDE</span><span className="en">FIDE Rating</span></div>
          <div className="kpi-num" style={{ color: "#D42B3C" }}>1842</div>
          <div className="kpi-delta delta-up">↑ 48 <span className="ar">هذا العام</span><span className="en">this year</span></div>
        </div>
        <div className="kpi kpi-g">
          <div className="kpi-lbl"><span className="ar">حضور أبريل</span><span className="en">April Attendance</span></div>
          <div className="kpi-num" style={{ color: "#007A38" }}>100%</div>
        </div>
        <div className="kpi kpi-k">
          <div className="kpi-lbl"><span className="ar">بطولات 2026</span><span className="en">Tournaments 2026</span></div>
          <div className="kpi-num">4</div>
        </div>
        <div className="kpi kpi-r">
          <div className="kpi-lbl"><span className="ar">انتصارات</span><span className="en">Victories</span></div>
          <div className="kpi-num">2🥇</div>
        </div>
      </div>

      <div className="g2">
        {/* Coach report */}
        <div style={{ background: "#fff", border: "1px solid #D6D0C4", padding: "1.75rem" }}>
          <h3 className="font-disp" style={{ fontSize: ".95rem", color: "#141414", marginBottom: "1.25rem" }}>
            <span className="ar">تقرير المدربة</span><span className="en">Coach&apos;s Report</span>
          </h3>
          <div style={{ padding: "1.25rem", background: "#EDE9E2", borderRight: "3px solid #007A38" }}>
            <p style={{ fontSize: ".82rem", lineHeight: 1.85, color: "#555", fontFamily: "'Noto Sans Arabic','DM Sans',sans-serif" }}>
              <span className="ar">"ليلى تُحقق تقدماً استثنائياً. أداؤها في البطولة الأخيرة كان رائعاً. أنصح بتكثيف التحضير لبطولة القاهرة."</span>
              <span className="en">"Layla is progressing exceptionally. Her last tournament performance was outstanding. I recommend intensifying preparation for the Cairo championship."</span>
            </p>
            <div className="label-xs mt2">
              <span className="ar">مريم زهراء · المدربة الرئيسية</span><span className="en">Mariam Zahra · Head Coach</span>
            </div>
          </div>
        </div>

        {/* Upcoming tournaments */}
        <div style={{ background: "#fff", border: "1px solid #D6D0C4", padding: "1.75rem" }}>
          <h3 className="font-disp" style={{ fontSize: ".95rem", color: "#141414", marginBottom: "1.25rem" }}>
            <span className="ar">البطولات القادمة</span><span className="en">Upcoming Tournaments</span>
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: ".85rem" }}>
            {[
              { month: "MAY", day: "18", bg: "#D42B3C", ar: "كأس الإمارات للشباب",  en: "Emirates Youth Cup"   },
              { month: "JUN", day: "7",  bg: "#007A38", ar: "البطولة العربية — القاهرة", en: "Arab Championship — Cairo" },
            ].map((t, i) => (
              <div key={i} style={{ display: "flex", gap: ".75rem", alignItems: "center" }}>
                <div style={{ width: 46, height: 46, background: t.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <div style={{ fontSize: ".45rem", color: "rgba(255,255,255,.7)", fontFamily: "'DM Sans',sans-serif" }}>{t.month}</div>
                  <div style={{ fontFamily: "var(--font-playfair),serif", fontSize: ".9rem", fontWeight: 700, color: "#fff", lineHeight: 1 }}>{t.day}</div>
                </div>
                <div>
                  <div style={{ fontSize: ".82rem", fontWeight: 500, color: "#141414", fontFamily: "'Noto Serif Arabic',var(--font-playfair),serif" }}>
                    <span className="ar">{t.ar}</span><span className="en">{t.en}</span>
                  </div>
                  <div className="label-xs"><span className="ar">مسجّلة ✓</span><span className="en">Registered ✓</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

function Spinner() {
  return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#EDE9E2" }}><div style={{ fontSize: "2rem", opacity: .25 }}>♟</div></div>;
}
