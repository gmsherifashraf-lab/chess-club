"use client";

import { useState } from "react";
import DashboardShell, { type NavItem } from "@/components/dashboard/DashboardShell";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import PlayersList         from "@/components/coach/PlayersList";
import AttendanceTaker     from "@/components/coach/AttendanceTaker";
import ParticipationsEditor from "@/components/coach/ParticipationsEditor";

const NAV: NavItem[] = [
  { key: "overview",       icon: "⊞", ar: "نظرة عامة",  en: "Overview"       },
  { key: "players",        icon: "♟", ar: "لاعباتي",    en: "Players"        },
  { key: "attendance",     icon: "📅", ar: "الحضور",     en: "Attendance"     },
  { key: "participations", icon: "🏆", ar: "المشاركات",  en: "Participations" },
];

const OVERVIEW_PLAYERS = [
  { ar: "ليلى الراشد", en: "Layla Al-Rashid", rating: 1842, att: 96, color: "#D42B3C" },
  { ar: "ريم العلي",   en: "Reem Al-Ali",     rating: 1780, att: 89, color: "#D42B3C" },
  { ar: "هناء خليفة", en: "Hana Khalifa",    rating: 1456, att: 73, color: "#007A38" },
  { ar: "نور سعيد",   en: "Noor Saeed",      rating: 0,    att: 72, color: "#A07820" },
];

const SCHEDULE = [
  { dayEn: "SUN", num: "4", ar: "جلسة فريق النخبة",     en: "Elite Squad Session",     time: "5:00–7:30 PM", bg: "#D42B3C" },
  { dayEn: "TUE", num: "6", ar: "تدريب الجيل التنافسي", en: "Competitive Juniors",     time: "4:00–6:00 PM", bg: "#007A38" },
  { dayEn: "THU", num: "8", ar: "مراجعة البطولة",        en: "Tournament Preparation", time: "5:00–8:00 PM", bg: "#141414" },
];

export default function CoachDashboard() {
  const { loading } = useRequireAuth("coach");
  const [tab, setTab] = useState("overview");

  if (loading) return <Spinner />;

  return (
    <DashboardShell
      roleAr="المدربة" roleEn="Coach"
      roleColor="#007A38"
      userInitial="م"
      navItems={NAV}
      activeTab={tab}
      onTab={setTab}
    >
      {tab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div className="g4">
            <Kpi ar="لاعباتي"            en="My Players"      value="28"   cls="kpi-r" />
            <Kpi ar="معدل الحضور"         en="Attendance Rate" value="91%"  delta="↑ 3%" up cls="kpi-g" />
            <Kpi ar="جلسات هذا الشهر"    en="Sessions"        value="16"   cls="kpi-k" />
            <Kpi ar="تقييمات معلّقة"      en="Pending Evals"  value="5"    cls="kpi-r" />
          </div>

          <div className="g2">
            <div style={{ background: "#fff", border: "1px solid #D6D0C4", padding: "1.5rem" }}>
              <h3 className="font-disp" style={{ fontSize: ".92rem", color: "#141414", marginBottom: "1.25rem" }}>
                <span className="ar">أداء اللاعبات</span><span className="en">Player Performance</span>
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: ".9rem" }}>
                {OVERVIEW_PLAYERS.map((p, i) => (
                  <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".82rem", marginBottom: ".35rem" }}>
                      <span style={{ color: "#555" }}><span className="ar">{p.ar}</span><span className="en">{p.en}</span></span>
                      <span style={{ color: p.color, fontWeight: 700 }}>{p.rating || "⚠ 72%"}</span>
                    </div>
                    <div className="ptrack">
                      <div className="pbar" style={{ width: `${p.att}%`, background: p.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "#fff", border: "1px solid #D6D0C4", padding: "1.5rem" }}>
              <h3 className="font-disp" style={{ fontSize: ".92rem", color: "#141414", marginBottom: "1.25rem" }}>
                <span className="ar">الجدول الأسبوعي</span><span className="en">This Week</span>
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
                {SCHEDULE.map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: ".75rem", alignItems: "center", background: "#EDE9E2", padding: ".75rem" }}>
                    <div style={{ width: 46, height: 46, flexShrink: 0, background: s.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ fontSize: ".45rem", color: "rgba(255,255,255,.7)", fontFamily: "'DM Sans',sans-serif" }}>{s.dayEn}</div>
                      <div style={{ fontFamily: "var(--font-playfair),serif", fontSize: ".9rem", fontWeight: 700, color: "#fff", lineHeight: 1 }}>{s.num}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: ".82rem", fontWeight: 500, color: "#141414", fontFamily: "'Noto Serif Arabic',var(--font-playfair),serif" }}>
                        <span className="ar">{s.ar}</span><span className="en">{s.en}</span>
                      </div>
                      <div className="label-xs">{s.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "players"        && <PlayersList />}
      {tab === "attendance"     && <AttendanceTaker />}
      {tab === "participations" && <ParticipationsEditor />}
    </DashboardShell>
  );
}

function Kpi({ ar, en, value, delta, up, cls }: { ar:string; en:string; value:string; delta?:string; up?:boolean; cls:string }) {
  return (
    <div className={`kpi ${cls}`}>
      <div className="kpi-lbl"><span className="ar">{ar}</span><span className="en">{en}</span></div>
      <div className="kpi-num">{value}</div>
      {delta && <div className={`kpi-delta ${up ? "delta-up" : ""}`}>{delta}</div>}
    </div>
  );
}
function Spinner() {
  return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#EDE9E2" }}><div style={{ fontSize: "2rem", opacity: .25 }}>♟</div></div>;
}
