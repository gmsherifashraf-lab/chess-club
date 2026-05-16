"use client";

import { useCallback, useEffect, useState } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { ROLE_NAV } from "@/lib/rbac";
import { ROLE_COLOR, ROLE_LABEL } from "@/lib/auth";

interface Child {
  id: string;
  full_name: string | null;
  email: string | null;
}
interface TaskRow {
  id: string;
  title: string;
  due_date: string | null;
  status: string;
}
interface SubRow {
  id: string;
  task_id: string;
  score: number | null;
  feedback: string | null;
  reviewed_at: string | null;
  submitted_at: string;
}
interface AttRow {
  player_id: string;
  date: string | null;
  status: string | null; // present | absent | late | excused
  note: string | null;
}

const fmt = (d: string | null) =>
  d ? new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "—";

export default function ParentDashboard() {
  const { loading } = useRequireAuth("parent");
  const { profile } = useAuth();
  const [tab, setTab] = useState("overview");

  const [children, setChildren] = useState<Child[]>([]);
  const [activeChild, setActiveChild] = useState<string | null>(null);
  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [subs, setSubs] = useState<SubRow[]>([]);
  const [att, setAtt] = useState<AttRow[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Resolve linked children (RLS: parent reads own relationships)
  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;
    (async () => {
      const { data: rel } = await supabase
        .from("parent_player_relationships")
        .select("player_id");
      const ids = (rel ?? []).map((r) => r.player_id);
      if (ids.length === 0) {
        if (!cancelled) {
          setChildren([]);
          setDataLoading(false);
        }
        return;
      }
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", ids);
      if (cancelled) return;
      const list = (profs ?? []) as Child[];
      setChildren(list);
      setActiveChild((c) => c ?? list[0]?.id ?? null);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const loadChild = useCallback(async (childId: string) => {
    const supabase = createClient();
    setDataLoading(true);

    // tasks/submissions are auth-keyed (assigned_to / player_id = the
    // child's auth id). attendance is ROSTER-keyed, so resolve the
    // child's roster player rows via the players.profile_id bridge.
    const { data: roster } = await supabase
      .from("players")
      .select("id")
      .eq("profile_id", childId);
    const rosterIds = (roster ?? []).map((r) => r.id as string);

    const [t, s, a] = await Promise.all([
      supabase
        .from("tasks")
        .select("id, title, due_date, status")
        .eq("assigned_to", childId)
        .order("due_date", { ascending: true }),
      supabase
        .from("submissions")
        .select("id, task_id, score, feedback, reviewed_at, submitted_at")
        .eq("player_id", childId)
        .order("submitted_at", { ascending: false }),
      rosterIds.length
        ? supabase
            .from("attendance")
            .select("*")
            .in("player_id", rosterIds)
            .order("date", { ascending: false })
        : Promise.resolve({ data: [] as AttRow[] }),
    ]);
    setTasks((t.data ?? []) as TaskRow[]);
    setSubs((s.data ?? []) as SubRow[]);
    setAtt((a.data ?? []) as AttRow[]);
    setDataLoading(false);
  }, []);

  useEffect(() => {
    if (activeChild) loadChild(activeChild);
  }, [activeChild, loadChild]);

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream-100 text-3xl text-text-4">
        ♟
      </div>
    );

  const name = profile?.full_name ?? profile?.email ?? "Parent";
  const initial = name.trim().charAt(0).toUpperCase();
  const scored = subs.filter((s) => s.score != null);
  const avg =
    scored.length === 0
      ? null
      : Math.round(
          scored.reduce((a, b) => a + (b.score ?? 0), 0) / scored.length,
        );
  const notes = subs.filter((s) => s.feedback);
  const presentCount = att.filter(
    (a) => a.status === "present" || a.status === "late",
  ).length;

  const empty = children.length === 0;

  return (
    <DashboardShell
      roleAr={ROLE_LABEL.parent.ar}
      roleEn={ROLE_LABEL.parent.en}
      roleColor={ROLE_COLOR.parent}
      userInitial={initial}
      navItems={ROLE_NAV.parent}
      activeTab={tab}
      onTab={setTab}
    >
      {empty ? (
        <div className="rounded-[4px] border border-line bg-white p-10 text-center text-text-3 shadow-card">
          <h2 className="font-disp text-xl font-bold text-text-1">
            <span className="ar">لا توجد لاعبة مرتبطة بحسابك بعد</span>
            <span className="en">No player linked to your account yet</span>
          </h2>
          <p className="mt-2 text-sm">
            <span className="ar">يرجى التواصل مع إدارة النادي لربط حساب ابنتك.</span>
            <span className="en">Contact the club administration to link your daughter&rsquo;s account.</span>
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {children.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {children.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveChild(c.id)}
                  className={`rounded-[3px] border px-4 py-2 text-sm font-semibold transition-colors ${
                    activeChild === c.id
                      ? "border-forest-700 bg-forest-700 text-white"
                      : "border-line bg-white text-text-2 hover:border-line-strong"
                  }`}
                >
                  {c.full_name ?? c.email}
                </button>
              ))}
            </div>
          )}

          {dataLoading ? (
            <div className="rounded-[4px] border border-line bg-white p-10 text-center text-text-4 shadow-card">
              …
            </div>
          ) : (
            <>
              {tab === "overview" && (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <Stat label="Assignments" labelAr="المهام" value={tasks.length} />
                  <Stat label="Submitted" labelAr="المُسلَّم" value={subs.length} />
                  <Stat
                    label="Avg score"
                    labelAr="المعدل"
                    value={avg == null ? "—" : `${avg}/100`}
                    accent
                  />
                  <Stat
                    label="Sessions present"
                    labelAr="حضور"
                    value={presentCount}
                  />
                </div>
              )}

              {tab === "assignments" && (
                <Panel titleAr="مهام الابنة" titleEn="Assignments">
                  {tasks.length === 0 ? (
                    <Empty />
                  ) : (
                    tasks.map((t) => (
                      <Row key={t.id}>
                        <span className="font-semibold text-text-1">
                          {t.title}
                        </span>
                        <span className="text-[0.8rem] text-text-4">
                          {t.status} · due {fmt(t.due_date)}
                        </span>
                      </Row>
                    ))
                  )}
                </Panel>
              )}

              {tab === "attendance" && (
                <Panel titleAr="سجل الحضور" titleEn="Attendance">
                  {att.length === 0 ? (
                    <Empty />
                  ) : (
                    att.map((a) => (
                      <Row key={`${a.player_id}-${a.date}`}>
                        <span className="text-text-1">{fmt(a.date)}</span>
                        <span
                          className={`text-[0.8rem] font-semibold ${
                            a.status === "present" || a.status === "late"
                              ? "text-forest-700"
                              : "text-scarlet-500"
                          }`}
                        >
                          {a.status ?? "—"}
                        </span>
                      </Row>
                    ))
                  )}
                </Panel>
              )}

              {tab === "progress" && (
                <Panel titleAr="التقدّم" titleEn="Progress">
                  {scored.length === 0 ? (
                    <Empty />
                  ) : (
                    scored.map((s) => (
                      <Row key={s.id}>
                        <span className="text-text-2">
                          {fmt(s.submitted_at)}
                        </span>
                        <span className="font-disp text-lg font-bold text-forest-700">
                          {s.score}/100
                        </span>
                      </Row>
                    ))
                  )}
                </Panel>
              )}

              {tab === "notes" && (
                <Panel titleAr="ملاحظات المدرّبة" titleEn="Coach Notes">
                  {notes.length === 0 ? (
                    <Empty />
                  ) : (
                    notes.map((s) => (
                      <div
                        key={s.id}
                        className="border-b border-line py-4 last:border-0"
                      >
                        <div className="mb-1 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-text-4">
                          {fmt(s.reviewed_at ?? s.submitted_at)}
                          {s.score != null && ` · ${s.score}/100`}
                        </div>
                        <p className="text-[0.92rem] leading-relaxed text-text-2">
                          {s.feedback}
                        </p>
                      </div>
                    ))
                  )}
                </Panel>
              )}
            </>
          )}
        </div>
      )}
    </DashboardShell>
  );
}

function Stat({
  label,
  labelAr,
  value,
  accent,
}: {
  label: string;
  labelAr: string;
  value: number | string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-[3px] border border-line bg-white p-5 shadow-card">
      <div
        className={`font-disp text-3xl font-bold ${
          accent ? "text-forest-700" : "text-text-1"
        }`}
      >
        {value}
      </div>
      <div className="mt-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-text-4">
        <span className="ar">{labelAr}</span>
        <span className="en">{label}</span>
      </div>
    </div>
  );
}

function Panel({
  titleAr,
  titleEn,
  children,
}: {
  titleAr: string;
  titleEn: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[4px] border border-line bg-white shadow-card">
      <div className="border-b border-line px-6 py-4 font-disp text-[1.05rem] font-bold text-text-1">
        <span className="ar">{titleAr}</span>
        <span className="en">{titleEn}</span>
      </div>
      <div className="px-6 py-2">{children}</div>
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line py-3.5 last:border-0">
      {children}
    </div>
  );
}

function Empty() {
  return (
    <p className="py-8 text-center text-sm text-text-4">
      <span className="ar">لا توجد بيانات بعد.</span>
      <span className="en">No data yet.</span>
    </p>
  );
}
