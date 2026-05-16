"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import TaskFormModal, { type TaskRow } from "./TaskFormModal";

interface PlayerLite {
  id:        string;
  full_name: string | null;
  email:     string | null;
}

interface TaskFull extends Required<Pick<TaskRow, "title" | "description" | "due_date" | "attachment_url" | "assigned_to" | "status">> {
  id:           string;
  created_at:   string;
  created_by:   string;
}

const STATUSES = ["all", "open", "in_progress", "submitted", "reviewed", "closed"] as const;

const STATUS_BADGE: Record<TaskFull["status"], { ar: string; en: string; cls: string }> = {
  open:        { ar: "مفتوحة",  en: "Open",        cls: "st-open"      },
  in_progress: { ar: "قيد العمل",en: "In Progress", cls: "st-progress"  },
  submitted:   { ar: "مُرسلة",   en: "Submitted",   cls: "st-submitted" },
  reviewed:    { ar: "مُراجعة",  en: "Reviewed",    cls: "st-reviewed"  },
  closed:      { ar: "مغلقة",   en: "Closed",      cls: "st-closed"    },
};

interface Props {
  /** When true, scope the list to tasks the current user created (coach view).
   *  When false, show all tasks (admin view). */
  scopeToOwn: boolean;
}

export default function TasksManager({ scopeToOwn }: Props) {
  const supabase = createClient();

  const [tasks,    setTasks]    = useState<TaskFull[]>([]);
  const [players,  setPlayers]  = useState<Record<string, PlayerLite>>({});
  const [filter,   setFilter]   = useState<typeof STATUSES[number]>("all");
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);
  const [editing,  setEditing]  = useState<TaskRow | null>(null);
  const [showForm, setShowForm] = useState(false);
  // Frozen timestamp for the "overdue" comparison.
  const [now] = useState(() => Date.now());

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    let q = supabase.from("tasks").select("*").order("created_at", { ascending: false });
    if (scopeToOwn) q = q.eq("created_by", user.id);

    const { data: tRows, error: tErr } = await q;
    if (tErr) { setError(tErr.message); setLoading(false); return; }
    const ts = (tRows ?? []) as TaskFull[];
    setTasks(ts);

    const playerIds = Array.from(new Set(ts.map((t) => t.assigned_to).filter(Boolean))) as string[];
    if (playerIds.length > 0) {
      const { data: pRows } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", playerIds);
      const map: Record<string, PlayerLite> = {};
      for (const p of (pRows ?? []) as PlayerLite[]) map[p.id] = p;
      setPlayers(map);
    } else {
      setPlayers({});
    }
    setLoading(false);
  }, [supabase, scopeToOwn]);

  useEffect(() => { load(); }, [load]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this task? Submissions will be removed too.")) return;
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) { alert(error.message); return; }
    load();
  }

  function openAdd() { setEditing(null); setShowForm(true); }
  function openEdit(t: TaskFull) {
    setEditing({
      id:             t.id,
      title:          t.title,
      description:    t.description,
      due_date:       t.due_date,
      attachment_url: t.attachment_url,
      assigned_to:    t.assigned_to,
      status:         t.status,
    });
    setShowForm(true);
  }

  const filtered = filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  return (
    <div>
      <div className="panel" style={{ marginBottom: "1.25rem" }}>
        <div className="panel-hd">
          <div>
            <div className="panel-ttl">
              <span className="ar">{scopeToOwn ? "مهامي" : "جميع المهام"}</span>
              <span className="en">{scopeToOwn ? "My Tasks" : "All Tasks"}</span>
            </div>
            <div className="dash-sub" style={{ marginBottom: 0 }}>
              <span className="ar">{tasks.length} مهمة · {filtered.length} معروضة</span>
              <span className="en">{tasks.length} total · {filtered.length} shown</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: ".5rem", alignItems: "center", flexWrap: "wrap" }}>
            <select className="form-inp compact" value={filter} onChange={(e) => setFilter(e.target.value as typeof STATUSES[number])} style={{ minWidth: 150 }}>
              {STATUSES.map((s) => <option key={s} value={s}>{s === "all" ? "All statuses" : s}</option>)}
            </select>
            <button className="btn btn-primary btn-sm" onClick={openAdd}>
              <span className="ar">+ مهمة جديدة</span>
              <span className="en">+ New Task</span>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div style={{ background: "rgba(212,43,60,.08)", border: "1px solid rgba(212,43,60,.25)", padding: ".7rem 1rem", marginBottom: "1rem", fontSize: ".82rem", color: "#B02030" }}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="empty"><div className="empty-ic">…</div></div>
      ) : filtered.length === 0 ? (
        <div className="empty">
          <div className="empty-ic">📝</div>
          <div className="empty-t">
            <span className="ar">لا توجد مهام بعد</span>
            <span className="en">No tasks yet</span>
          </div>
          <div className="empty-d">
            <span className="ar">أنشئ مهمة جديدة وعيّنها لأحد اللاعبين.</span>
            <span className="en">Create your first task and assign it to a player.</span>
          </div>
        </div>
      ) : (
        <div className="g2" style={{ gap: "1rem" }}>
          {filtered.map((t) => {
            const player  = t.assigned_to ? players[t.assigned_to] : null;
            const badge   = STATUS_BADGE[t.status];
            const due     = t.due_date ? new Date(t.due_date) : null;
            const dueStr  = due ? due.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : null;
            const overdue = due ? due.getTime() < now && t.status !== "closed" && t.status !== "reviewed" : false;

            return (
              <div key={t.id} className="task-card">
                <div style={{ display: "flex", justifyContent: "space-between", gap: ".75rem", alignItems: "flex-start" }}>
                  <h4 className="task-title">{t.title}</h4>
                  <span className={`chip ${badge.cls}`}>
                    <span className="ar">{badge.ar}</span>
                    <span className="en">{badge.en}</span>
                  </span>
                </div>

                {t.description && <p className="task-desc">{t.description.slice(0, 240)}{t.description.length > 240 ? "…" : ""}</p>}

                <div style={{ display: "flex", flexWrap: "wrap", gap: ".75rem", fontSize: ".75rem", color: "#666" }}>
                  <span>
                    <span className="ar">👤 </span>
                    <span className="en">👤 </span>
                    {player ? (player.full_name ?? player.email ?? "—") : "—"}
                  </span>
                  {dueStr && (
                    <span style={{ color: overdue ? "#B02030" : "#666" }}>
                      <span className="ar">📅 </span>
                      <span className="en">📅 </span>
                      {dueStr}{overdue && " (overdue)"}
                    </span>
                  )}
                  {t.attachment_url && <a href={t.attachment_url} target="_blank" rel="noopener" style={{ color: "var(--ds-emerald-700)" }}>🔗 file</a>}
                </div>

                <div style={{ display: "flex", gap: ".5rem", marginTop: "auto", paddingTop: ".5rem", borderTop: "1px solid #F1ECE2" }}>
                  <button onClick={() => openEdit(t)} className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: "center" }}>
                    <span className="ar">تعديل</span>
                    <span className="en">Edit</span>
                  </button>
                  <button onClick={() => handleDelete(t.id)} className="btn btn-sm" style={{ background: "rgba(212,43,60,.1)", color: "#B02030", border: "none", flex: 1, justifyContent: "center" }}>
                    <span className="ar">حذف</span>
                    <span className="en">Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <TaskFormModal initial={editing} onClose={() => setShowForm(false)} onSaved={load} />
      )}
    </div>
  );
}
