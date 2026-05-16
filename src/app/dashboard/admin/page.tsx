"use client";

import { useState, useEffect } from "react";
import DashboardShell, { type NavItem } from "@/components/dashboard/DashboardShell";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";

import CrudShell        from "@/components/admin/CrudShell";
import CoachAssignments from "@/components/admin/CoachAssignments";
import UsersManager     from "@/components/admin/UsersManager";
import TasksManager     from "@/components/tasks/TasksManager";
import SubmissionsReviewer from "@/components/tasks/SubmissionsReviewer";
import {
  playerColumns, playerFields, type PlayerRow,
  coachColumns,  coachFields,  type CoachRow,
  tournamentColumns, tournamentFields, type TournamentRow,
  newsColumns,   newsFields,   type NewsRow,
  galleryColumns, galleryFields, type GalleryRow,
} from "@/components/admin/configs";

const NAV: NavItem[] = [
  { key: "overview",    icon: "⊞", ar: "نظرة عامة",      en: "Overview"      },
  { key: "users",       icon: "👥", ar: "المستخدمون",   en: "Users"         },
  { key: "tasks",       icon: "📝", ar: "المهام",        en: "Tasks"         },
  { key: "submissions", icon: "📥", ar: "المُسلَّمات",   en: "Submissions"   },
  { key: "players",     icon: "♟", ar: "اللاعبون",      en: "Players"       },
  { key: "coaches",     icon: "🎓", ar: "المدربون",      en: "Coaches"       },
  { key: "assignments", icon: "🔗", ar: "التعيينات",     en: "Assignments"   },
  { key: "tournaments", icon: "🏆", ar: "البطولات",      en: "Tournaments"   },
  { key: "news",        icon: "📰", ar: "الأخبار",        en: "News"          },
  { key: "gallery",     icon: "🖼", ar: "معرض الصور",    en: "Gallery"       },
  { key: "settings",    icon: "⚙", ar: "الإعدادات",      en: "Settings"      },
];

export default function AdminDashboard() {
  const { loading } = useRequireAuth("admin");
  const { profile } = useAuth();
  const [tab, setTab] = useState("overview");
  const counts = useAdminCounts();

  if (loading) return <LoadingScreen />;

  const initial = (profile?.full_name ?? profile?.email ?? "A").trim().charAt(0).toUpperCase();

  return (
    <DashboardShell
      roleAr="مدير النظام" roleEn="Administrator"
      roleColor="#D42B3C"
      userInitial={initial}
      navItems={NAV}
      activeTab={tab}
      onTab={setTab}
    >
      {tab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="banner">
            <div style={{ fontSize: ".68rem", letterSpacing: ".18em", textTransform: "uppercase", opacity: .6, marginBottom: ".4rem" }}>
              <span className="ar">لوحة التحكم</span>
              <span className="en">Control Panel</span>
            </div>
            <h2 className="font-disp" style={{ fontSize: "1.7rem", marginBottom: ".4rem" }}>
              <span className="ar">مرحباً بك في الإدارة</span>
              <span className="en">Welcome back, Admin</span>
            </h2>
            <p style={{ fontSize: ".88rem", opacity: .7, maxWidth: 540, lineHeight: 1.6 }}>
              <span className="ar">صلاحيات كاملة على المنصة. أدِر المستخدمين، المحتوى، والتقدم من مكان واحد.</span>
              <span className="en">Full platform access. Manage users, content, and progress from a single command center.</span>
            </p>
          </div>

          <div className="g4">
            <Kpi labelAr="إجمالي المستخدمين" labelEn="Total Users" value={counts.totalUsers} icon="👥" tone="t-red" />
            <Kpi labelAr="اللاعبون"          labelEn="Players"     value={counts.players}    icon="♟" tone="t-grn" />
            <Kpi labelAr="المدربون"          labelEn="Coaches"     value={counts.coaches}    icon="🎓" tone="t-ink" />
            <Kpi labelAr="المهام النشطة"     labelEn="Active Tasks" value={counts.openTasks} icon="📝" tone="t-gold" />
          </div>

          <div className="g2">
            <div className="panel">
              <div className="panel-hd">
                <div className="panel-ttl">
                  <span className="ar">إجراءات سريعة</span>
                  <span className="en">Quick Actions</span>
                </div>
              </div>
              <div className="panel-pad" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".6rem" }}>
                <QuickAction icon="👥" ar="إدارة المستخدمين" en="Manage Users"    onClick={() => setTab("users")} />
                <QuickAction icon="📝" ar="إنشاء مهمة"        en="Create Task"     onClick={() => setTab("tasks")} />
                <QuickAction icon="🎓" ar="إضافة مدرب"        en="Add Coach"       onClick={() => setTab("coaches")} />
                <QuickAction icon="♟" ar="إضافة لاعب"        en="Add Player"      onClick={() => setTab("players")} />
                <QuickAction icon="🏆" ar="بطولة جديدة"       en="New Tournament"  onClick={() => setTab("tournaments")} />
                <QuickAction icon="📰" ar="نشر خبر"          en="Publish News"    onClick={() => setTab("news")} />
              </div>
            </div>

            <div className="panel">
              <div className="panel-hd">
                <div className="panel-ttl">
                  <span className="ar">حالة المنصة</span>
                  <span className="en">Platform Status</span>
                </div>
              </div>
              <div className="panel-pad" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <Stat ar="بطولات السنة"       en={`Tournaments ${counts.currentYear}`}  value={counts.tournamentsThisYear} max={Math.max(counts.tournamentsThisYear, 1)} color="#007A38" />
                <Stat ar="الأخبار المنشورة"  en="Published News"       value={counts.publishedNews} max={Math.max(counts.publishedNews, 1)} color="#A07820" />
                <Stat ar="المسلَّمات"         en="Submissions"          value={counts.submissions}  max={Math.max(counts.submissions, 1)} color="#141414" />
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "users"       && <UsersManager />}

      {tab === "tasks"       && <TasksManager scopeToOwn={false} />}

      {tab === "submissions" && <SubmissionsReviewer scopeToOwn={false} />}

      {tab === "players" && (
        <CrudShell<PlayerRow>
          table="players"
          titleAr="إدارة اللاعبين" titleEn="Players Roster"
          addLabelAr="+ إضافة لاعب" addLabelEn="+ Add Player"
          columns={playerColumns}
          fields={playerFields}
          orderBy={{ column: "rating", ascending: false }}
        />
      )}

      {tab === "coaches" && (
        <CrudShell<CoachRow>
          table="coaches"
          titleAr="إدارة المدربين" titleEn="Coaches Roster"
          addLabelAr="+ إضافة مدرب" addLabelEn="+ Add Coach"
          columns={coachColumns}
          fields={coachFields}
        />
      )}

      {tab === "assignments" && <CoachAssignments />}

      {tab === "tournaments" && (
        <CrudShell<TournamentRow>
          table="tournaments"
          titleAr="إدارة البطولات" titleEn="Tournaments"
          addLabelAr="+ بطولة جديدة" addLabelEn="+ Add Tournament"
          columns={tournamentColumns}
          fields={tournamentFields}
          orderBy={{ column: "date", ascending: false }}
        />
      )}

      {tab === "news" && (
        <CrudShell<NewsRow>
          table="news"
          titleAr="إدارة الأخبار" titleEn="News &amp; Announcements"
          addLabelAr="+ مقال جديد" addLabelEn="+ New Article"
          columns={newsColumns}
          fields={newsFields}
          orderBy={{ column: "published_at", ascending: false }}
        />
      )}

      {tab === "gallery" && (
        <CrudShell<GalleryRow>
          table="gallery_images"
          titleAr="إدارة معرض الصور" titleEn="Gallery"
          addLabelAr="+ صورة جديدة" addLabelEn="+ Add Image"
          columns={galleryColumns}
          fields={galleryFields}
          orderBy={{ column: "sort_order", ascending: true }}
        />
      )}

      {tab === "settings" && (
        <div className="panel panel-pad">
          <h3 className="dash-h">
            <span className="ar">الإعدادات</span>
            <span className="en">Settings</span>
          </h3>
          <p className="dash-sub">
            <span className="ar">صلاحيات النظام والإعدادات العامة.</span>
            <span className="en">Platform permissions and global settings.</span>
          </p>
          <div className="ribbon" style={{ marginTop: "1rem" }}>
            <span className="ar">صلاحيات الأدوار تُدار عبر سياسات Supabase RLS — انظر ملف 0005_role_system_refactor.sql.</span>
            <span className="en">Role permissions are governed by Supabase RLS policies — see migration 0005_role_system_refactor.sql.</span>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

// ── Live counts for the Overview KPIs ────────────────────────────────────────
function useAdminCounts() {
  const currentYear = new Date().getFullYear();
  const [counts, setCounts] = useState({
    totalUsers: 0,
    players: 0,
    coaches: 0,
    admins: 0,
    openTasks: 0,
    submissions: 0,
    tournamentsThisYear: 0,
    publishedNews: 0,
  });

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;
    (async () => {
      const yearStart = `${currentYear}-01-01`;
      const yearEnd   = `${currentYear + 1}-01-01`;

      const [u, p, c, a, t, s, ty, n] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "player"),
        supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "coach"),
        supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "admin"),
        supabase.from("tasks").select("*",    { count: "exact", head: true }).in("status", ["open", "in_progress", "submitted"]),
        supabase.from("submissions").select("*", { count: "exact", head: true }),
        supabase.from("tournaments").select("*",  { count: "exact", head: true }).gte("date", yearStart).lt("date", yearEnd),
        supabase.from("news").select("*", { count: "exact", head: true }).not("published_at", "is", null),
      ]);

      if (cancelled) return;
      setCounts({
        totalUsers:          u.count ?? 0,
        players:             p.count ?? 0,
        coaches:             c.count ?? 0,
        admins:              a.count ?? 0,
        openTasks:           t.count ?? 0,
        submissions:         s.count ?? 0,
        tournamentsThisYear: ty.count ?? 0,
        publishedNews:       n.count ?? 0,
      });
    })();
    return () => { cancelled = true; };
  }, [currentYear]);

  return { ...counts, currentYear };
}

// ── Pieces ───────────────────────────────────────────────────────────────────
function Kpi({ labelAr, labelEn, value, icon, tone }: { labelAr: string; labelEn: string; value: number | null; icon: string; tone: string }) {
  return (
    <div className={`kpi-tile ${tone}`}>
      <div className="kpi-icon">{icon}</div>
      <div className="kpi-lbl"><span className="ar">{labelAr}</span><span className="en">{labelEn}</span></div>
      <div className="kpi-num">{value == null ? "—" : value}</div>
    </div>
  );
}

function QuickAction({ icon, ar, en, onClick }: { icon: string; ar: string; en: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="qa-btn">
      <span className="qa-ic">{icon}</span>
      <span><span className="ar">{ar}</span><span className="en">{en}</span></span>
    </button>
  );
}

function Stat({ ar, en, value, max, color }: { ar: string; en: string; value: number; max: number; color: string }) {
  const pct = Math.min(100, Math.round((value / Math.max(max, 1)) * 100));
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".82rem", marginBottom: ".4rem" }}>
        <span style={{ color: "#444" }}><span className="ar">{ar}</span><span className="en">{en}</span></span>
        <span style={{ color, fontWeight: 700 }}>{value}</span>
      </div>
      <div className="bar"><span style={{ width: `${pct}%`, background: color }} /></div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#EDE9E2" }}>
      <div style={{ fontSize: "2rem", opacity: .25 }}>♟</div>
    </div>
  );
}
