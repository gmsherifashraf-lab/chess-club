"use client";

import { useState, useEffect } from "react";
import DashboardShell, { type NavItem } from "@/components/dashboard/DashboardShell";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { ROLE_COLOR } from "@/lib/auth";

import TasksManager        from "@/components/tasks/TasksManager";
import SubmissionsReviewer from "@/components/tasks/SubmissionsReviewer";
import PlayersList         from "@/components/coach/PlayersList";
import AttendanceTaker     from "@/components/coach/AttendanceTaker";
import ParticipationsEditor from "@/components/coach/ParticipationsEditor";

const NAV: NavItem[] = [
  { key: "overview",       icon: "⊞", ar: "نظرة عامة",        en: "Overview"        },
  { key: "tasks",          icon: "📝", ar: "المهام",          en: "Tasks"           },
  { key: "submissions",    icon: "📥", ar: "المُسلَّمات",      en: "Submissions"     },
  { key: "players",        icon: "♟", ar: "اللاعبون",         en: "My Players"      },
  { key: "attendance",     icon: "📅", ar: "الحضور",          en: "Attendance"      },
  { key: "participations", icon: "🏆", ar: "المشاركات",       en: "Tournaments"     },
];

export default function CoachDashboard() {
  const { loading } = useRequireAuth("coach");
  const { profile } = useAuth();
  const [tab, setTab] = useState("overview");
  const stats = useCoachStats();

  if (loading) return <Spinner />;

  const initial = (profile?.full_name ?? profile?.email ?? "C").trim().charAt(0).toUpperCase();

  return (
    <DashboardShell
      roleAr="المدرب" roleEn="Coach"
      roleColor={ROLE_COLOR.coach}
      userInitial={initial}
      navItems={NAV}
      activeTab={tab}
      onTab={setTab}
    >
      {tab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="banner" style={{ background: "linear-gradient(135deg,#0d2818 0%,#0a1d10 50%,#0d2818 100%)" }}>
            <div style={{ fontSize: ".68rem", letterSpacing: ".18em", textTransform: "uppercase", opacity: .65, marginBottom: ".4rem", color: "#A4D4B8" }}>
              <span className="ar">منطقة المدرب</span>
              <span className="en">Coach Workspace</span>
            </div>
            <h2 className="font-disp" style={{ fontSize: "1.7rem", marginBottom: ".4rem" }}>
              <span className="ar">أهلاً، {profile?.full_name ?? "المدرب"}</span>
              <span className="en">Hello, {profile?.full_name ?? "Coach"}</span>
            </h2>
            <p style={{ fontSize: ".88rem", opacity: .7, maxWidth: 540, lineHeight: 1.6 }}>
              <span className="ar">أنشئ المهام، راجع الإجابات، وتابع تقدم اللاعبين الذين تشرف عليهم.</span>
              <span className="en">Create tasks, review submissions, and track the players you mentor.</span>
            </p>
          </div>

          <div className="g4">
            <Kpi labelAr="مهامي"          labelEn="My Tasks"        value={stats.myTasks}        icon="📝" tone="t-grn" />
            <Kpi labelAr="مفتوحة"         labelEn="Open"            value={stats.openTasks}      icon="📂" tone="t-gold" />
            <Kpi labelAr="بحاجة لمراجعة"   labelEn="Needs Review"    value={stats.pendingReview}  icon="📥" tone="t-red" />
            <Kpi labelAr="مُراجَعة"        labelEn="Reviewed"        value={stats.reviewed}       icon="✓" tone="t-ink" />
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
                <QuickAction icon="📝" ar="مهمة جديدة"         en="New Task"          onClick={() => setTab("tasks")} />
                <QuickAction icon="📥" ar="مراجعة مُسلَّمات"   en="Review Submissions" onClick={() => setTab("submissions")} />
                <QuickAction icon="📅" ar="تسجيل الحضور"       en="Take Attendance"    onClick={() => setTab("attendance")} />
                <QuickAction icon="🏆" ar="نتائج البطولة"       en="Tournament Results" onClick={() => setTab("participations")} />
              </div>
            </div>

            <div className="panel">
              <div className="panel-hd">
                <div className="panel-ttl">
                  <span className="ar">صلاحياتك</span>
                  <span className="en">Your Permissions</span>
                </div>
              </div>
              <div className="panel-pad" style={{ display: "flex", flexDirection: "column", gap: ".75rem", fontSize: ".85rem" }}>
                <PermLine ok ar="إنشاء وتعديل المهام للاعبين"      en="Create / edit tasks for players" />
                <PermLine ok ar="مراجعة المُسلَّمات وإضافة الملاحظات" en="Review submissions and add feedback" />
                <PermLine ok ar="تسجيل الحضور للاعبين المعيّنين"   en="Record attendance for assigned players" />
                <PermLine ok ar="إدخال نتائج البطولات"               en="Enter tournament results" />
                <PermLine    ar="إدارة المستخدمين أو الأدوار"         en="Manage users or roles (admin only)" />
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "tasks"          && <TasksManager scopeToOwn />}
      {tab === "submissions"    && <SubmissionsReviewer scopeToOwn />}
      {tab === "players"        && <PlayersList />}
      {tab === "attendance"     && <AttendanceTaker />}
      {tab === "participations" && <ParticipationsEditor />}
    </DashboardShell>
  );
}

function useCoachStats() {
  const [stats, setStats] = useState({ myTasks: 0, openTasks: 0, pendingReview: 0, reviewed: 0 });

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [myTasks, open, sub, rev] = await Promise.all([
        supabase.from("tasks").select("*", { count: "exact", head: true }).eq("created_by", user.id),
        supabase.from("tasks").select("*", { count: "exact", head: true }).eq("created_by", user.id).in("status", ["open", "in_progress"]),
        supabase.from("submissions").select("id, task:tasks!inner(created_by)").eq("task.created_by", user.id).is("reviewed_at", null),
        supabase.from("submissions").select("id, task:tasks!inner(created_by)").eq("task.created_by", user.id).not("reviewed_at", "is", null),
      ]);

      if (cancelled) return;
      setStats({
        myTasks:       myTasks.count ?? 0,
        openTasks:     open.count ?? 0,
        pendingReview: (sub.data?.length ?? 0),
        reviewed:      (rev.data?.length ?? 0),
      });
    })();

    return () => { cancelled = true; };
  }, []);

  return stats;
}

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
      <span className="qa-ic" style={{ background: "rgba(0,122,56,.08)", color: "#007A38" }}>{icon}</span>
      <span><span className="ar">{ar}</span><span className="en">{en}</span></span>
    </button>
  );
}

function PermLine({ ok, ar, en }: { ok?: boolean; ar: string; en: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: ".55rem", color: ok ? "#141414" : "#999", opacity: ok ? 1 : .55 }}>
      <span style={{ width: 18, height: 18, display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: 4, background: ok ? "rgba(0,122,56,.12)" : "rgba(20,20,20,.06)", color: ok ? "#007A38" : "#888", fontSize: ".75rem" }}>{ok ? "✓" : "—"}</span>
      <span><span className="ar">{ar}</span><span className="en">{en}</span></span>
    </div>
  );
}

function Spinner() {
  return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#EDE9E2" }}><div style={{ fontSize: "2rem", opacity: .25 }}>♟</div></div>;
}
