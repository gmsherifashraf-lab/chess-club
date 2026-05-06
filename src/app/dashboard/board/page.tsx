"use client";

import DashboardShell, { type NavItem } from "@/components/dashboard/DashboardShell";
import { useRequireAuth } from "@/hooks/useRequireAuth";

const NAV: NavItem[] = [
  { key: "overview",  icon: "⊞", ar: "نظرة عامة",    en: "Overview"  },
  { key: "finance",   icon: "💰", ar: "الإيرادات",    en: "Finances"  },
  { key: "decisions", icon: "⚖", ar: "القرارات",      en: "Decisions" },
  { key: "metrics",   icon: "📈", ar: "المؤشرات",     en: "Metrics"   },
];

const REVENUE = [
  { ar: "رسوم العضوية",      en: "Membership Fees",      pct: 62, cls: "pbar-red",   pctColor: "#D42B3C" },
  { ar: "الرعاية المؤسسية",  en: "Corporate Sponsorship",pct: 21, cls: "pbar-green", pctColor: "#007A38" },
  { ar: "رسوم البطولات",     en: "Tournament Fees",       pct: 10, cls: "pbar-ink",   pctColor: "#141414" },
  { ar: "المنح والتبرعات",   en: "Grants & Donations",   pct:  7, cls: "pbar-gold",  pctColor: "#A07820" },
];

const DECISIONS = [
  { ar: "تجديد عقد المدربة الرئيسية", en: "Head Coach Contract Renewal",  subAr: "ينتهي يونيو 2026", subEn: "Expires June 2026", border: "#D42B3C", badge: "badge-red",   badgeAr: "عاجل",      badgeEn: "Urgent" },
  { ar: "ميزانية مخيم الصيف 2026",    en: "Summer Camp 2026 Budget",      subAr: "للاعتماد",          subEn: "For Approval",      border: "#A07820", badge: "badge-gold",  badgeAr: "للمراجعة",  badgeEn: "Review" },
  { ar: "شراكة مؤسسية جديدة",         en: "New Corporate Partnership",    subAr: "3/4 أعضاء صوّتوا", subEn: "3/4 members voted", border: "#007A38", badge: "badge-green", badgeAr: "3/4",       badgeEn: "3/4"    },
];

export default function BoardDashboard() {
  const { loading } = useRequireAuth("board");

  if (loading) return <Spinner />;

  return (
    <DashboardShell
      roleAr="مجلس الإدارة" roleEn="Board of Directors"
      roleColor="#A07820"
      userInitial="ف"
      navItems={NAV}
      activeTab="overview"
      onTab={() => {}}
    >
      {/* KPIs */}
      <div className="g4" style={{ marginBottom: "1.5rem" }}>
        <div className="kpi kpi-r">
          <div className="kpi-lbl"><span className="ar">إجمالي الأعضاء</span><span className="en">Total Members</span></div>
          <div className="kpi-num">180+</div>
          <div className="kpi-delta delta-up">↑ 12%</div>
        </div>
        <div className="kpi kpi-g">
          <div className="kpi-lbl"><span className="ar">الميداليات الذهبية</span><span className="en">Gold Medals</span></div>
          <div className="kpi-num">11</div>
          <div className="kpi-delta delta-up">↑ 2026</div>
        </div>
        <div className="kpi kpi-k">
          <div className="kpi-lbl"><span className="ar">معدل الحضور</span><span className="en">Attendance Rate</span></div>
          <div className="kpi-num">89%</div>
        </div>
        <div className="kpi kpi-o">
          <div className="kpi-lbl"><span className="ar">المنح الدراسية</span><span className="en">Scholarships</span></div>
          <div className="kpi-num" style={{ color: "#A07820" }}>15</div>
        </div>
      </div>

      <div className="g2" style={{ marginBottom: "1.5rem" }}>
        {/* Revenue breakdown */}
        <div style={{ background: "#fff", border: "1px solid #D6D0C4", padding: "1.75rem" }}>
          <h3 className="font-disp" style={{ fontSize: ".95rem", color: "#141414", marginBottom: "1.35rem" }}>
            <span className="ar">مصادر الإيرادات 2026</span><span className="en">Revenue Breakdown 2026</span>
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: ".9rem" }}>
            {REVENUE.map((r, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".82rem", marginBottom: ".35rem" }}>
                  <span style={{ color: "#555" }}><span className="ar">{r.ar}</span><span className="en">{r.en}</span></span>
                  <span style={{ color: r.pctColor, fontWeight: 700 }}>{r.pct}%</span>
                </div>
                <div className="ptrack"><div className={`pbar ${r.cls}`} style={{ width: `${r.pct}%` }} /></div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending decisions */}
        <div style={{ background: "#fff", border: "1px solid #D6D0C4", padding: "1.75rem" }}>
          <h3 className="font-disp" style={{ fontSize: ".95rem", color: "#141414", marginBottom: "1.35rem" }}>
            <span className="ar">قرارات معلّقة</span><span className="en">Pending Board Decisions</span>
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
            {DECISIONS.map((d, i) => (
              <div key={i} style={{ padding: ".9rem", background: "#EDE9E2", borderRight: `3px solid ${d.border}`, display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: ".82rem", fontWeight: 500, color: "#141414", fontFamily: "'Noto Serif Arabic',var(--font-playfair),serif" }}>
                    <span className="ar">{d.ar}</span><span className="en">{d.en}</span>
                  </div>
                  <div className="label-xs mt1"><span className="ar">{d.subAr}</span><span className="en">{d.subEn}</span></div>
                </div>
                <span className={`badge ${d.badge}`}><span className="ar">{d.badgeAr}</span><span className="en">{d.badgeEn}</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key metrics */}
      <div style={{ background: "#fff", border: "1px solid #D6D0C4", padding: "1.75rem" }}>
        <h3 className="font-disp" style={{ fontSize: ".95rem", color: "#141414", marginBottom: "1.35rem" }}>
          <span className="ar">المؤشرات الرئيسية 2026</span><span className="en">Key Performance Metrics 2026</span>
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "#D6D0C4" }}>
          {[
            { val: "+23%",    label: { ar: "نمو العضوية",       en: "Membership Growth"  }, color: "#D42B3C" },
            { val: "AED 380K",label: { ar: "الإيرادات السنوية", en: "Annual Revenue"     }, color: "#007A38" },
            { val: "94%",     label: { ar: "رضا أولياء الأمور",en: "Parent Satisfaction" }, color: "#141414" },
          ].map((m, i) => (
            <div key={i} style={{ background: "#fff", padding: "1.5rem", textAlign: "center" }}>
              <div className="font-disp" style={{ fontSize: "2.2rem", color: m.color, lineHeight: 1 }}>{m.val}</div>
              <div className="label-xs mt1"><span className="ar">{m.label.ar}</span><span className="en">{m.label.en}</span></div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}

function Spinner() {
  return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#EDE9E2" }}><div style={{ fontSize: "2rem", opacity: .25 }}>♟</div></div>;
}
