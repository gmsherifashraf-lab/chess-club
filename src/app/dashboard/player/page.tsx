"use client";

import { useEffect, useState } from "react";
import DashboardShell, { type NavItem } from "@/components/dashboard/DashboardShell";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import PlayerTasks   from "@/components/player/PlayerTasks";
import PlayerProfile from "@/components/player/PlayerProfile";

const NAV: NavItem[] = [
  { key: "overview", icon: "⊞", ar: "نظرة عامة", en: "Overview" },
  { key: "tasks",    icon: "📝", ar: "مهامي",    en: "My Tasks" },
  { key: "history",  icon: "📚", ar: "السجل",    en: "History"  },
  { key: "profile",  icon: "👤", ar: "ملفي",     en: "Profile"  },
];

export default function PlayerDashboard() {
  const { loading } = useRequireAuth("player");
  const { profile } = useAuth();
  const [tab, setTab] = useState("overview");
  const stats = usePlayerStats();

  if (loading) return <Spinner />;

  const initial = (profile?.full_name ?? profile?.email ?? "P").trim().charAt(0).toUpperCase();
  const name    = profile?.full_name ?? profile?.email ?? "Player";

  return (
    <DashboardShell
      roleAr="اللاعب" roleEn="Player"
      roleColor="#A07820"
      userInitial={initial}
      navItems={NAV}
      activeTab={tab}
      onTab={setTab}
    >
      {tab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="banner" style={{ background: "linear-gradient(135deg,#2a2010 0%,#1a1408 50%,#2a2010 100%)" }}>
            <div style={{ fontSize: ".68rem", letterSpacing: ".18em", textTransform: "uppercase", opacity: .65, marginBottom: ".4rem", color: "#D9B65A" }}>
              <span className="ar">منطقة اللاعب</span>
              <span className="en">Player Workspace</span>
            </div>
            <h2 className="font-disp" style={{ fontSize: "1.7rem", marginBottom: ".4rem" }}>
              <span className="ar">أهلاً {name}</span>
              <span className="en">Welcome, {name}</span>
            </h2>
            <p style={{ fontSize: ".88rem", opacity: .7, maxWidth: 540, lineHeight: 1.6 }}>
              <span className="ar">تابع المهام، أرسل إجاباتك، واطّلع على ملاحظات المدرب.</span>
              <span className="en">Track your tasks, submit your answers, and review coach feedback.</span>
            </p>
          </div>

          <div className="g4">
            <Kpi labelAr="مهامي"      labelEn="My Tasks"   value={stats.totalTasks}  icon="📝" tone="t-gold" />
            <Kpi labelAr="مفتوحة"     labelEn="Open"       value={stats.openTasks}   icon="📂" tone="t-red" />
            <Kpi labelAr="مرسلة"      labelEn="Submitted"  value={stats.submitted}   icon="📤" tone="t-ink" />
            <Kpi labelAr="متوسط النتيجة" labelEn="Avg Score" value={stats.avgScore == null ? null : `${stats.avgScore}/100`} icon="⭐" tone="t-grn" />
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
                <QuickAction icon="📝" ar="مهامي"          en="View My Tasks" onClick={() => setTab("tasks")} />
                <QuickAction icon="📚" ar="سجل التسليمات" en="Submission History" onClick={() => setTab("history")} />
                <QuickAction icon="👤" ar="ملفي الشخصي"   en="Edit Profile" onClick={() => setTab("profile")} />
              </div>
            </div>

            <div className="panel">
              <div className="panel-hd">
                <div className="panel-ttl">
                  <span className="ar">تقدمك</span>
                  <span className="en">Your Progress</span>
                </div>
              </div>
              <div className="panel-pad" style={{ display: "flex", flexDirection: "column", gap: ".9rem" }}>
                <ProgressLine ar="معدل التسليم"   en="Completion Rate"  value={stats.totalTasks ? Math.round((stats.submitted / stats.totalTasks) * 100) : 0} suffix="%" color="#A07820" />
                <ProgressLine ar="المُراجَعة"      en="Reviewed"         value={stats.totalTasks ? Math.round((stats.reviewed / stats.totalTasks) * 100) : 0} suffix="%" color="#007A38" />
                <ProgressLine ar="متوسط النتيجة"  en="Avg Score"        value={stats.avgScore ?? 0} suffix={stats.avgScore == null ? "" : "/100"} color="#D42B3C" />
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "tasks"   && <PlayerTasks />}
      {tab === "history" && <SubmissionHistory />}
      {tab === "profile" && <PlayerProfile />}
    </DashboardShell>
  );
}

interface SubmissionRow {
  id:          string;
  task_id:     string;
  content:     string | null;
  feedback:    string | null;
  score:       number | null;
  reviewed_at: string | null;
  submitted_at: string;
  task: { id: string; title: string } | null;
}

function SubmissionHistory() {
  const [rows, setRows] = useState<SubmissionRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data } = await supabase
        .from("submissions")
        .select("id, task_id, content, feedback, score, reviewed_at, submitted_at, task:tasks(id, title)")
        .eq("player_id", user.id)
        .order("submitted_at", { ascending: false });
      if (cancelled) return;
      setRows((data ?? []) as unknown as SubmissionRow[]);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <div className="empty"><div className="empty-ic">…</div></div>;
  if (rows.length === 0) {
    return (
      <div className="empty">
        <div className="empty-ic">📚</div>
        <div className="empty-t"><span className="ar">لا توجد تسليمات بعد</span><span className="en">No submissions yet</span></div>
        <div className="empty-d"><span className="ar">سيظهر سجل التسليمات هنا.</span><span className="en">Your submission history will appear here.</span></div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
      {rows.map((s) => (
        <div key={s.id} className="panel" style={{ padding: "1.1rem 1.4rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: ".5rem", marginBottom: ".5rem" }}>
            <div style={{ fontWeight: 600, color: "#141414" }}>{s.task?.title ?? "Task"}</div>
            <span className={`chip ${s.reviewed_at ? "chip-grn" : "chip-gold"}`}>
              {s.reviewed_at ? (
                <><span className="ar">مُراجَعة</span><span className="en">Reviewed</span>{s.score != null && ` · ${s.score}/100`}</>
              ) : (
                <><span className="ar">قيد المراجعة</span><span className="en">Pending review</span></>
              )}
            </span>
          </div>
          <div style={{ fontSize: ".75rem", color: "#888" }}>
            {new Date(s.submitted_at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
          </div>
          {s.feedback && (
            <div className="ribbon" style={{ marginTop: ".75rem" }}>
              <strong>
                <span className="ar">المدرب: </span><span className="en">Coach: </span>
              </strong>
              {s.feedback}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function usePlayerStats() {
  const [stats, setStats] = useState<{ totalTasks: number; openTasks: number; submitted: number; reviewed: number; avgScore: number | null }>(
    { totalTasks: 0, openTasks: 0, submitted: 0, reviewed: 0, avgScore: null }
  );

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [tRes, sRes] = await Promise.all([
        supabase.from("tasks").select("id, status").eq("assigned_to", user.id),
        supabase.from("submissions").select("id, score, reviewed_at").eq("player_id", user.id),
      ]);

      if (cancelled) return;

      const tasks = (tRes.data ?? []) as { status: string }[];
      const subs  = (sRes.data ?? []) as { score: number | null; reviewed_at: string | null }[];

      const open      = tasks.filter((t) => t.status === "open" || t.status === "in_progress").length;
      const submitted = subs.length;
      const reviewed  = subs.filter((s) => s.reviewed_at).length;
      const scores    = subs.map((s) => s.score).filter((s): s is number => typeof s === "number");
      const avgScore  = scores.length === 0 ? null : Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

      setStats({
        totalTasks: tasks.length,
        openTasks: open,
        submitted,
        reviewed,
        avgScore,
      });
    })();
    return () => { cancelled = true; };
  }, []);

  return stats;
}

function Kpi({ labelAr, labelEn, value, icon, tone }: { labelAr: string; labelEn: string; value: number | string | null; icon: string; tone: string }) {
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
      <span className="qa-ic" style={{ background: "rgba(160,120,32,.08)", color: "#A07820" }}>{icon}</span>
      <span><span className="ar">{ar}</span><span className="en">{en}</span></span>
    </button>
  );
}

function ProgressLine({ ar, en, value, suffix, color }: { ar: string; en: string; value: number; suffix: string; color: string }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".82rem", marginBottom: ".4rem" }}>
        <span style={{ color: "#444" }}><span className="ar">{ar}</span><span className="en">{en}</span></span>
        <span style={{ color, fontWeight: 700 }}>{value}{suffix}</span>
      </div>
      <div className="bar"><span style={{ width: `${Math.min(100, value)}%`, background: color }} /></div>
    </div>
  );
}

function Spinner() {
  return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#EDE9E2" }}><div style={{ fontSize: "2rem", opacity: .25 }}>♟</div></div>;
}
