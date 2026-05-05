"use client";

import { useState } from "react";
import DashboardShell, { type NavItem } from "@/components/dashboard/DashboardShell";
import { useRequireAuth } from "@/hooks/useRequireAuth";

const NAV: NavItem[] = [
  { key: "overview",    icon: "⊞", ar: "نظرة عامة",    en: "Overview"     },
  { key: "players",     icon: "♟", ar: "اللاعبات",     en: "Players"      },
  { key: "tournaments", icon: "🏆", ar: "البطولات",     en: "Tournaments"  },
  { key: "regs",        icon: "📋", ar: "الطلبات",      en: "Applications" },
  { key: "news",        icon: "📰", ar: "إدارة الأخبار",en: "News"         },
];

const RECENT_REGS = [
  { nameAr: "نور السيد",    nameEn: "Noor Al-Sayed",  progAr: "النجوم الصاعدة", progEn: "Rising Stars", date: "Apr 30", status: "pending"  },
  { nameAr: "هناء خليفة",  nameEn: "Hana Khalifa",   progAr: "فريق النخبة",   progEn: "Elite Squad",  date: "Apr 29", status: "approved" },
  { nameAr: "ريم العلي",   nameEn: "Reem Al-Ali",    progAr: "الجيل التنافسي",progEn: "Competitive",  date: "Apr 27", status: "pending"  },
  { nameAr: "سارة منصور", nameEn: "Sara Mansour",   progAr: "الملكات الصغيرات",progEn: "Little Queens",date: "Apr 26", status: "approved" },
];

const PLAYERS = [
  { nameAr: "ليلى الراشد", nameEn: "Layla Al-Rashid", age: 14, progAr: "النخبة", progEn: "Elite",       rating: 1842, rColor: "#D42B3C", att: "96%", status: "active"  },
  { nameAr: "هناء خليفة", nameEn: "Hana Khalifa",    age: 12, progAr: "تنافسي",  progEn: "Competitive", rating: 1456, rColor: "#141414", att: "88%", status: "active"  },
  { nameAr: "نور سعيد",   nameEn: "Noor Saeed",      age: 9,  progAr: "صاعدة",   progEn: "Rising",      rating: 0,    rColor: "#141414", att: "72%", status: "risk"    },
  { nameAr: "ريم العلي",  nameEn: "Reem Al-Ali",     age: 15, progAr: "النخبة",  progEn: "Elite",       rating: 1780, rColor: "#D42B3C", att: "94%", status: "active"  },
];

const DISTRIB = [
  { ar: "الملكات الصغيرات", en: "Little Queens",      pct: 28, color: "#D42B3C" },
  { ar: "النجوم الصاعدات",  en: "Rising Stars",       pct: 45, color: "#007A38" },
  { ar: "الجيل التنافسي",   en: "Competitive Juniors",pct: 57, color: "#D42B3C" },
  { ar: "فريق النخبة",      en: "Elite Squad",         pct: 18, color: "#141414" },
];

export default function AdminDashboard() {
  const { loading } = useRequireAuth("admin");
  const [tab, setTab] = useState("overview");

  if (loading) return <LoadingScreen />;

  return (
    <DashboardShell
      roleAr="مدير النظام" roleEn="Administrator"
      roleColor="#D42B3C"
      userInitial="م"
      navItems={NAV}
      activeTab={tab}
      onTab={setTab}
    >
      {/* ── OVERVIEW ── */}
      {tab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div className="g4">
            <Kpi labelAr="إجمالي اللاعبات" labelEn="Total Players"    value="180+" delta="↑ 12 هذا الشهر / this month" up cls="kpi-r" />
            <Kpi labelAr="المدربات النشطات" labelEn="Active Coaches"   value="12"   delta="↑ 2 جديدة / new"              up cls="kpi-g" />
            <Kpi labelAr="بطولات 2026"      labelEn="Tournaments 2026" value="8"                                             cls="kpi-k" />
            <Kpi labelAr="طلبات معلّقة"     labelEn="Pending Apps."    value="17"   delta="تحتاج مراجعة / needs review" cls="kpi-r" />
          </div>

          <div className="g2">
            {/* Recent regs */}
            <div style={{ background: "#fff", border: "1px solid #D6D0C4", padding: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 className="font-disp" style={{ fontSize: ".92rem", color: "#141414" }}>
                  <span className="ar">آخر الطلبات</span><span className="en">Recent Registrations</span>
                </h3>
                <button onClick={() => setTab("regs")} style={{ fontSize: ".72rem", color: "#D42B3C", background: "none", border: "none", cursor: "pointer" }}>
                  <span className="ar">الكل →</span><span className="en">All →</span>
                </button>
              </div>
              <table className="dtable">
                <thead><tr>
                  <Th ar="اللاعبة"  en="Player"  />
                  <Th ar="البرنامج" en="Program" />
                  <Th ar="التاريخ" en="Date"    />
                  <Th ar="الحالة"  en="Status"  />
                </tr></thead>
                <tbody>{RECENT_REGS.map((r, i) => (
                  <tr key={i}>
                    <Td><b><span className="ar">{r.nameAr}</span><span className="en">{r.nameEn}</span></b></Td>
                    <Td><span className="ar">{r.progAr}</span><span className="en">{r.progEn}</span></Td>
                    <Td><span style={{ opacity: .4 }}>{r.date}</span></Td>
                    <Td><span className={`badge ${r.status === "approved" ? "badge-green" : "badge-gold"}`}><span className="ar">{r.status === "approved" ? "مقبولة" : "معلّق"}</span><span className="en">{r.status === "approved" ? "Approved" : "Pending"}</span></span></Td>
                  </tr>
                ))}</tbody>
              </table>
            </div>

            {/* Distribution */}
            <div style={{ background: "#fff", border: "1px solid #D6D0C4", padding: "1.5rem" }}>
              <h3 className="font-disp" style={{ fontSize: ".92rem", color: "#141414", marginBottom: "1.25rem" }}>
                <span className="ar">اللاعبات حسب البرنامج</span><span className="en">Players by Program</span>
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: ".85rem" }}>
                {DISTRIB.map((d, i) => (
                  <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".82rem", marginBottom: ".35rem" }}>
                      <span style={{ color: "#555" }}><span className="ar">{d.ar}</span><span className="en">{d.en}</span></span>
                      <span style={{ color: d.color, fontWeight: 700 }}>{d.pct}%</span>
                    </div>
                    <div className="ptrack"><div className="pbar" style={{ width: `${d.pct}%`, background: d.color }} /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── PLAYERS ── */}
      {tab === "players" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: ".75rem" }}>
            <div>
              <h3 className="font-disp" style={{ fontSize: "1.05rem", color: "#141414" }}><span className="ar">إدارة اللاعبات</span><span className="en">Player Management</span></h3>
              <p style={{ fontSize: ".78rem", color: "#555" }}>180+ <span className="ar">لاعبة مسجّلة</span><span className="en">registered players</span></p>
            </div>
            <button className="btn btn-primary btn-sm"><span className="ar">+ إضافة لاعبة</span><span className="en">+ Add Player</span></button>
          </div>
          <div style={{ background: "#fff", border: "1px solid #D6D0C4", overflow: "auto" }}>
            <table className="dtable">
              <thead><tr>
                <Th ar="اللاعبة"  en="Player"  /> <Th ar="العمر" en="Age" /> <Th ar="البرنامج" en="Program" />
                <Th ar="التصنيف" en="Rating" /> <Th ar="الحضور" en="Att." /> <Th ar="الحالة" en="Status" />
              </tr></thead>
              <tbody>{PLAYERS.map((p, i) => (
                <tr key={i}>
                  <Td><b><span className="ar">{p.nameAr}</span><span className="en">{p.nameEn}</span></b></Td>
                  <Td>{p.age}</Td>
                  <Td><span className="ar">{p.progAr}</span><span className="en">{p.progEn}</span></Td>
                  <Td><b style={{ color: p.rColor }}>{p.rating || "—"}</b></Td>
                  <Td><span style={{ color: p.status === "risk" ? "#A07820" : "#007A38" }}>{p.att}</span></Td>
                  <Td><span className={`badge ${p.status === "active" ? "badge-green" : "badge-gold"}`}><span className="ar">{p.status === "active" ? "نشطة" : "في خطر"}</span><span className="en">{p.status === "active" ? "Active" : "At Risk"}</span></span></Td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TOURNAMENTS ── */}
      {tab === "tournaments" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <h3 className="font-disp" style={{ fontSize: "1.05rem", color: "#141414" }}><span className="ar">إدارة البطولات</span><span className="en">Tournament Management</span></h3>
            <button className="btn btn-primary btn-sm"><span className="ar">+ بطولة جديدة</span><span className="en">+ Add Tournament</span></button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
            {[{ month: "MAY", day: "18", ar: "كأس الإمارات للشباب 2026", en: "Emirates Youth Cup 2026", sub: "42 registered", bg: "#D42B3C" },
              { month: "JUN", day: "7",  ar: "بطولة الفتيات العربية",    en: "Arab Girls Championship", sub: "8 registered",  bg: "#007A38" }
            ].map((t, i) => (
              <div key={i} className="tour-row">
                <div className="tour-date" style={{ background: t.bg }}>
                  <div className="tour-month">{t.month}</div>
                  <div className="tour-day">{t.day}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="font-disp" style={{ fontSize: ".95rem", color: "#141414" }}><span className="ar">{t.ar}</span><span className="en">{t.en}</span></div>
                  <div className="label-xs">{t.sub}</div>
                </div>
                <button className="btn btn-secondary btn-sm"><span className="ar">تعديل</span><span className="en">Edit</span></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── APPLICATIONS ── */}
      {tab === "regs" && (
        <div>
          <h3 className="font-disp" style={{ fontSize: "1.05rem", color: "#141414", marginBottom: "1.25rem" }}><span className="ar">الطلبات المعلّقة (17)</span><span className="en">Pending Applications (17)</span></h3>
          <div style={{ background: "#fff", border: "1px solid #D6D0C4", overflow: "auto" }}>
            <table className="dtable">
              <thead><tr>
                <Th ar="المتقدمة"  en="Applicant" /> <Th ar="البرنامج" en="Program" /> <Th ar="التاريخ" en="Date" /> <Th ar="الإجراء" en="Action" />
              </tr></thead>
              <tbody>{RECENT_REGS.map((r, i) => (
                <tr key={i}>
                  <Td><b><span className="ar">{r.nameAr}</span><span className="en">{r.nameEn}</span></b></Td>
                  <Td><span className="ar">{r.progAr}</span><span className="en">{r.progEn}</span></Td>
                  <Td><span style={{ opacity: .4 }}>{r.date}</span></Td>
                  <Td>
                    <div style={{ display: "flex", gap: ".5rem" }}>
                      <button className="btn btn-green btn-sm"><span className="ar">قبول</span><span className="en">Approve</span></button>
                      <button className="btn btn-sm" style={{ background: "rgba(212,43,60,.1)", color: "#B02030", border: "none" }}><span className="ar">رفض</span><span className="en">Reject</span></button>
                    </div>
                  </Td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── NEWS ── */}
      {tab === "news" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <h3 className="font-disp" style={{ fontSize: "1.05rem", color: "#141414" }}><span className="ar">إدارة الأخبار</span><span className="en">News Management</span></h3>
            <button className="btn btn-primary btn-sm"><span className="ar">+ مقال جديد</span><span className="en">+ New Article</span></button>
          </div>
          <div style={{ background: "#fff", border: "1px solid #D6D0C4", overflow: "auto" }}>
            <table className="dtable">
              <thead><tr>
                <Th ar="العنوان" en="Title" /> <Th ar="التصنيف" en="Category" /> <Th ar="التاريخ" en="Date" /> <Th ar="الحالة" en="Status" />
              </tr></thead>
              <tbody>
                {[{ title: "Layla Al-Rashid Wins UAE Championship", cat: "Achievement", date: "Apr 28", pub: true },
                  { title: "Summer Intensive Camp",                  cat: "Program",     date: "Apr 15", pub: true },
                  { title: "June Newsletter",                        cat: "Newsletter",  date: "—",      pub: false },
                ].map((n, i) => (
                  <tr key={i}>
                    <Td>{n.title}</Td>
                    <Td><span className="badge badge-red">{n.cat}</span></Td>
                    <Td><span style={{ opacity: .4 }}>{n.date}</span></Td>
                    <Td><span className={`badge ${n.pub ? "badge-green" : "badge-gold"}`}>{n.pub ? "Published" : "Draft"}</span></Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

// ── Micro-components ──────────────────────────────────────────────────────────
function Kpi({ labelAr, labelEn, value, delta, up, cls }: { labelAr:string; labelEn:string; value:string; delta?:string; up?:boolean; cls:string }) {
  return (
    <div className={`kpi ${cls}`}>
      <div className="kpi-lbl"><span className="ar">{labelAr}</span><span className="en">{labelEn}</span></div>
      <div className="kpi-num">{value}</div>
      {delta && <div className={`kpi-delta ${up ? "delta-up" : ""}`}>{delta}</div>}
    </div>
  );
}
function Th({ ar, en }: { ar: string; en: string }) {
  return <th><span className="ar">{ar}</span><span className="en">{en}</span></th>;
}
function Td({ children }: { children: React.ReactNode }) {
  return <td>{children}</td>;
}
function LoadingScreen() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#EDE9E2" }}>
      <div style={{ fontSize: "2rem", opacity: .25 }}>♟</div>
    </div>
  );
}
