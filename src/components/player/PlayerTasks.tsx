"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import FileUpload from "@/components/ui/FileUpload";

interface Task {
  id:             string;
  title:          string;
  description:    string | null;
  due_date:       string | null;
  attachment_url: string | null;
  status:         "open" | "in_progress" | "submitted" | "reviewed" | "closed";
  created_at:     string;
}

interface Submission {
  id:           string;
  task_id:      string;
  content:      string | null;
  file_url:     string | null;
  feedback:     string | null;
  score:        number | null;
  reviewed_at:  string | null;
  submitted_at: string;
}

const STATUS_BADGE = {
  open:        { ar: "مفتوحة",  en: "Open",        cls: "st-open"      },
  in_progress: { ar: "قيد العمل",en: "In Progress", cls: "st-progress"  },
  submitted:   { ar: "مُرسلة",   en: "Submitted",   cls: "st-submitted" },
  reviewed:    { ar: "مُراجعة",  en: "Reviewed",    cls: "st-reviewed"  },
  closed:      { ar: "مغلقة",   en: "Closed",      cls: "st-closed"    },
} as const;

export default function PlayerTasks() {
  const supabase = createClient();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [subs, setSubs]   = useState<Record<string, Submission>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const [editing, setEditing] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  // Snapshot the current timestamp once at mount — used purely for an
  // "overdue?" comparison; recomputing per render isn't needed.
  const [now] = useState(() => Date.now());

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const [tRes, sRes] = await Promise.all([
      supabase.from("tasks").select("*").eq("assigned_to", user.id).order("due_date", { ascending: true, nullsFirst: false }),
      supabase.from("submissions").select("*").eq("player_id", user.id),
    ]);

    if (tRes.error) { setError(tRes.error.message); setLoading(false); return; }
    if (sRes.error) { setError(sRes.error.message); setLoading(false); return; }

    setTasks((tRes.data ?? []) as Task[]);
    const map: Record<string, Submission> = {};
    for (const s of (sRes.data ?? []) as Submission[]) map[s.task_id] = s;
    setSubs(map);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  function openSubmit(t: Task) {
    setEditing(t.id);
    const existing = subs[t.id];
    setContent(existing?.content ?? "");
    setFileUrl(existing?.file_url ?? "");
  }

  function close() { setEditing(null); setContent(""); setFileUrl(""); }

  async function submit(taskId: string) {
    setSavingId(taskId);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSavingId(null); return; }

    const existing = subs[taskId];
    const payload = {
      task_id:    taskId,
      player_id:  user.id,
      content:    content.trim() || null,
      file_url:   fileUrl.trim() || null,
      submitted_at: new Date().toISOString(),
    };

    const q = existing
      ? supabase.from("submissions").update(payload).eq("id", existing.id)
      : supabase.from("submissions").insert(payload);

    const { error } = await q;
    if (error) { alert(error.message); setSavingId(null); return; }

    // Bump task status to 'submitted' for visibility.
    await supabase.from("tasks").update({ status: "submitted" }).eq("id", taskId);

    setSavingId(null);
    close();
    load();
  }

  if (loading) {
    return <div className="empty"><div className="empty-ic">…</div></div>;
  }

  if (error) {
    return (
      <div style={{ background: "rgba(212,43,60,.08)", border: "1px solid rgba(212,43,60,.25)", padding: ".7rem 1rem", fontSize: ".82rem", color: "#B02030" }}>
        {error}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="empty">
        <div className="empty-ic">🎯</div>
        <div className="empty-t">
          <span className="ar">لا توجد مهام مسندة لك</span>
          <span className="en">No tasks assigned yet</span>
        </div>
        <div className="empty-d">
          <span className="ar">عندما يقوم مدربك بإنشاء مهام، ستظهر هنا.</span>
          <span className="en">When your coach assigns tasks, they will appear here.</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {tasks.map((t) => {
        const sub      = subs[t.id];
        const isOpen   = editing === t.id;
        const badge    = STATUS_BADGE[t.status];
        const due      = t.due_date ? new Date(t.due_date) : null;
        const dueStr   = due ? due.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : null;
        const overdue  = due ? due.getTime() < now && !sub : false;
        const reviewed = !!sub?.reviewed_at;

        return (
          <div key={t.id} className="panel" style={{ padding: "1.25rem 1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: ".75rem", marginBottom: ".75rem" }}>
              <div>
                <h4 className="task-title">{t.title}</h4>
                {dueStr && (
                  <div className="task-meta" style={{ marginTop: 4, color: overdue ? "#B02030" : undefined }}>
                    📅 <span className="ar">آخر موعد: </span><span className="en">Due: </span>{dueStr}{overdue && " (overdue)"}
                  </div>
                )}
              </div>
              <span className={`chip ${badge.cls}`}>
                <span className="ar">{badge.ar}</span>
                <span className="en">{badge.en}</span>
              </span>
            </div>

            {t.description && <p className="task-desc" style={{ marginBottom: ".75rem" }}>{t.description}</p>}

            {t.attachment_url && (
              <div style={{ marginBottom: ".75rem" }}>
                <a href={t.attachment_url} target="_blank" rel="noopener" style={{ color: "var(--ds-emerald-700)", fontSize: ".82rem" }}>
                  📎 <span className="ar">المرفق</span><span className="en">Attachment</span>
                </a>
              </div>
            )}

            {sub && (
              <div style={{ background: "#FAF7F2", border: "1px solid #E5DFD2", padding: ".85rem 1rem", marginBottom: ".75rem" }}>
                <div style={{ fontSize: ".7rem", letterSpacing: ".12em", textTransform: "uppercase", color: "#888", marginBottom: ".4rem" }}>
                  <span className="ar">إجابتك</span><span className="en">Your Submission</span>
                </div>
                {sub.content && <div style={{ fontSize: ".85rem", color: "#444", whiteSpace: "pre-wrap" }}>{sub.content}</div>}
                {sub.file_url && (
                  <div style={{ marginTop: ".4rem" }}>
                    <a href={sub.file_url} target="_blank" rel="noopener" style={{ color: "var(--ds-emerald-700)", fontSize: ".82rem" }}>📎 file</a>
                  </div>
                )}
                <div style={{ fontSize: ".72rem", opacity: .55, marginTop: ".4rem" }}>
                  Submitted {new Date(sub.submitted_at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                </div>
              </div>
            )}

            {reviewed && sub && (
              <div className="ribbon" style={{ marginBottom: ".75rem" }}>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: 3 }}>
                    <span className="ar">ملاحظات المدرب</span>
                    <span className="en">Coach feedback</span>
                    {sub.score != null && <span style={{ marginLeft: 8 }}>· {sub.score}/100</span>}
                  </div>
                  <div style={{ fontSize: ".85rem" }}>{sub.feedback ?? "—"}</div>
                </div>
              </div>
            )}

            {isOpen ? (
              <div style={{ display: "flex", flexDirection: "column", gap: ".75rem", paddingTop: ".5rem", borderTop: "1px solid #E5DFD2" }}>
                <div>
                  <label className="form-lbl"><span className="ar">إجابتك</span><span className="en">Your Answer</span></label>
                  <textarea className="form-inp compact" rows={4} value={content} onChange={(e) => setContent(e.target.value)} disabled={savingId === t.id} />
                </div>
                <div>
                  <label className="form-lbl"><span className="ar">ملف (اختياري)</span><span className="en">File (optional)</span></label>
                  <FileUpload bucket="submissions" value={fileUrl || null} onChange={(u) => setFileUrl(u ?? "")} disabled={savingId === t.id} />
                </div>
                <div style={{ display: "flex", gap: ".5rem", justifyContent: "flex-end" }}>
                  <button onClick={close} disabled={savingId === t.id} className="btn btn-secondary btn-sm">
                    <span className="ar">إلغاء</span><span className="en">Cancel</span>
                  </button>
                  <button onClick={() => submit(t.id)} disabled={savingId === t.id} className="btn btn-primary btn-sm">
                    <span className="ar">{savingId === t.id ? "جاري الإرسال…" : "إرسال"}</span>
                    <span className="en">{savingId === t.id ? "Submitting…"   : "Submit"}</span>
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => openSubmit(t)} className="btn btn-primary btn-sm" disabled={t.status === "closed"}>
                {sub ? (
                  <><span className="ar">تعديل الإجابة</span><span className="en">Update Answer</span></>
                ) : (
                  <><span className="ar">إرسال الإجابة</span><span className="en">Submit Answer</span></>
                )}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
