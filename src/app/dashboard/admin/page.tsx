"use client";

import { useState, useEffect } from "react";
import DashboardShell, { type NavItem } from "@/components/dashboard/DashboardShell";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { createClient } from "@/lib/supabase/client";
import CrudShell        from "@/components/admin/CrudShell";
import EnrollmentsList  from "@/components/admin/EnrollmentsList";
import CoachAssignments from "@/components/admin/CoachAssignments";
import {
  playerColumns, playerFields, type PlayerRow,
  coachColumns,  coachFields,  type CoachRow,
  tournamentColumns, tournamentFields, type TournamentRow,
  newsColumns,   newsFields,   type NewsRow,
  boardColumns,  boardFields,  type BoardRow,
} from "@/components/admin/configs";

const NAV: NavItem[] = [
  { key: "overview",    icon: "⊞", ar: "نظرة عامة",     en: "Overview"     },
  { key: "players",     icon: "♟", ar: "اللاعبات",      en: "Players"      },
  { key: "coaches",     icon: "🎓", ar: "المدربات",      en: "Coaches"      },
  { key: "assignments", icon: "🔗", ar: "التعيينات",     en: "Assignments"  },
  { key: "tournaments", icon: "🏆", ar: "البطولات",      en: "Tournaments"  },
  { key: "regs",        icon: "📋", ar: "الطلبات",       en: "Applications" },
  { key: "news",        icon: "📰", ar: "إدارة الأخبار", en: "News"         },
  { key: "board",       icon: "👥", ar: "مجلس الإدارة",  en: "Board"        },
];

const RECENT_REGS = [
  { nameAr: "نور السيد",    nameEn: "Noor Al-Sayed",  progAr: "النجوم الصاعدة", progEn: "Rising Stars", date: "Apr 30", status: "pending"  },
  { nameAr: "هناء خليفة",  nameEn: "Hana Khalifa",   progAr: "فريق النخبة",   progEn: "Elite Squad",  date: "Apr 29", status: "approved" },
  { nameAr: "ريم العلي",   nameEn: "Reem Al-Ali",    progAr: "الجيل التنافسي",progEn: "Competitive",  date: "Apr 27", status: "pending"  },
  { nameAr: "سارة منصور", nameEn: "Sara Mansour",   progAr: "الملكات الصغيرات",progEn: "Little Queens",date: "Apr 26", status: "approved" },
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
  const counts = useAdminCounts();

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
            <Kpi labelAr="إجمالي اللاعبات"   labelEn="Total Players"     value={counts.players}      cls="kpi-r" />
            <Kpi labelAr="المدربات"          labelEn="Coaches"           value={counts.coaches}      cls="kpi-g" />
            <Kpi labelAr={`بطولات ${counts.currentYear}`} labelEn={`Tournaments ${counts.currentYear}`} value={counts.tournamentsThisYear} cls="kpi-k" />
            <Kpi labelAr="مقالات منشورة"    labelEn="Published News"    value={counts.publishedNews} cls="kpi-r" />
          </div>

          <div className="g2">
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
                <thead>
                  <tr>
                    <Th ar="اللاعبة" en="Player" />
                    <Th ar="البرنامج" en="Program" />
                    <Th ar="التاريخ" en="Date" />
                    <Th ar="الحالة" en="Status" />
                  </tr>
                </thead>
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
        <CrudShell<PlayerRow>
          table="players"
          titleAr="إدارة اللاعبات" titleEn="Player Management"
          addLabelAr="+ إضافة لاعبة" addLabelEn="+ Add Player"
          columns={playerColumns}
          fields={playerFields}
          orderBy={{ column: "rating", ascending: false }}
        />
      )}

      {/* ── COACHES ── */}
      {tab === "coaches" && (
        <CrudShell<CoachRow>
          table="coaches"
          titleAr="إدارة المدربات" titleEn="Coach Management"
          addLabelAr="+ إضافة مدربة" addLabelEn="+ Add Coach"
          columns={coachColumns}
          fields={coachFields}
        />
      )}

      {/* ── ASSIGNMENTS ── */}
      {tab === "assignments" && <CoachAssignments />}

      {/* ── TOURNAMENTS ── */}
      {tab === "tournaments" && (
        <CrudShell<TournamentRow>
          table="tournaments"
          titleAr="إدارة البطولات" titleEn="Tournament Management"
          addLabelAr="+ بطولة جديدة" addLabelEn="+ Add Tournament"
          columns={tournamentColumns}
          fields={tournamentFields}
          orderBy={{ column: "date", ascending: false }}
        />
      )}

      {/* ── APPLICATIONS ── */}
      {tab === "regs" && <EnrollmentsList />}

      {/* ── NEWS ── */}
      {tab === "news" && (
        <CrudShell<NewsRow>
          table="news"
          titleAr="إدارة الأخبار" titleEn="News Management"
          addLabelAr="+ مقال جديد" addLabelEn="+ New Article"
          columns={newsColumns}
          fields={newsFields}
          orderBy={{ column: "published_at", ascending: false }}
        />
      )}

      {/* ── BOARD MEMBERS ── */}
      {tab === "board" && (
        <CrudShell<BoardRow>
          table="board_members"
          titleAr="مجلس الإدارة" titleEn="Board Members"
          addLabelAr="+ إضافة عضو" addLabelEn="+ Add Member"
          columns={boardColumns}
          fields={boardFields}
        />
      )}
    </DashboardShell>
  );
}

// ── Live counts for the Overview KPIs ────────────────────────────────────────
function useAdminCounts() {
  const currentYear = new Date().getFullYear();
  const [counts, setCounts] = useState<{
    players:             number | null;
    coaches:             number | null;
    tournamentsThisYear: number | null;
    publishedNews:       number | null;
  }>({ players: null, coaches: null, tournamentsThisYear: null, publishedNews: null });

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;
    (async () => {
      const yearStart = `${currentYear}-01-01`;
      const yearEnd   = `${currentYear + 1}-01-01`;

      const [p, c, t, n] = await Promise.all([
        supabase.from("players").select("*", { count: "exact", head: true }),
        supabase.from("coaches").select("*", { count: "exact", head: true }),
        supabase.from("tournaments").select("*", { count: "exact", head: true })
          .gte("date", yearStart).lt("date", yearEnd),
        supabase.from("news").select("*", { count: "exact", head: true })
          .not("published_at", "is", null),
      ]);

      if (cancelled) return;
      setCounts({
        players:             p.count ?? 0,
        coaches:             c.count ?? 0,
        tournamentsThisYear: t.count ?? 0,
        publishedNews:       n.count ?? 0,
      });
    })();
    return () => { cancelled = true; };
  }, [currentYear]);

  return { ...counts, currentYear };
}

// ── Micro-components ──────────────────────────────────────────────────────────
function Kpi({ labelAr, labelEn, value, cls }: { labelAr: string; labelEn: string; value: number | null; cls: string }) {
  return (
    <div className={`kpi ${cls}`}>
      <div className="kpi-lbl"><span className="ar">{labelAr}</span><span className="en">{labelEn}</span></div>
      <div className="kpi-num">{value == null ? "—" : value}</div>
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
