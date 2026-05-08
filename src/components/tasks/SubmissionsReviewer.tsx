"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface Submission {
  id:           string;
  task_id:      string;
  player_id:    string;
  content:      string | null;
  file_url:     string | null;
  feedback:     string | null;
  score:        number | null;
  reviewed_by:  string | null;
  reviewed_at:  string | null;
  submitted_at: string;
  task:  { id: string; title: string; created_by: string } | null;
  player: { id: string; full_name: string | null; email: string | null } | null;
}

interface Props {
  /** When true, scope to submissions on tasks created by current user (coach view).
   *  When false, show all submissions (admin view). */
  scopeToOwn: boolean;
}

export default function SubmissionsReviewer({ scopeToOwn }: Props) {
  const supabase = createClient();
  const [rows, setRows] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    // Pull submissions joined with tasks (explicit FK works because
    // submissions.task_id → tasks.id is a single direct FK).
    const { data: subData, error: subErr } = await supabase
      .from("submissions")
      .select(`
        id, task_id, player_id, content, file_url, feedback, score,
        reviewed_by, reviewed_at, submitted_at,
        task:tasks!inner(id, title, created_by)
      `)
      .order("submitted_at", { ascending: false });

    if (subErr) { setError(subErr.message); setLoading(false); return; }

    let base = (subData ?? []) as unknown as Submission[];
    if (scopeToOwn) base = base.filter((s) => s.task?.created_by === user.id);

    // Hydrate player names from profiles in a second query to avoid
    // ambiguous FK issues (player_id → auth.users, not profiles).
    const playerIds = Array.from(new Set(base.map((s) => s.player_id)));
    const playerMap = new Map<string, { id: string; full_name: string | null; email: string | null }>();
    if (playerIds.length > 0) {
      const { data: pRows } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", playerIds);
      for (const p of (pRows ?? []) as { id: string; full_name: string | null; email: string | null }[]) {
        playerMap.set(p.id, p);
      }
    }
    const enriched = base.map((s) => ({ ...s, player: playerMap.get(s.player_id) ?? null }));
    setRows(enriched);
    setLoading(false);
  }, [supabase, scopeToOwn]);

  useEffect(() => { load(); }, [load]);

  function openReview(s: Submission) {
    setEditing(s.id);
    setFeedback(s.feedback ?? "");
    setScore(s.score == null ? "" : String(s.score));
  }
  function close() { setEditing(null); setFeedback(""); setScore(""); }

  async function saveReview(id: string) {
    setSavingId(id);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSavingId(null); return; }

    const numericScore = score.trim() === "" ? null : Number(score);
    const payload: Record<string, unknown> = {
      feedback: feedback.trim() || null,
      score: numericScore != null && Number.isFinite(numericScore) ? numericScore : null,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("submissions").update(payload).eq("id", id);
    if (error) { alert(error.message); setSavingId(null); return; }

    // Mark the parent task as reviewed.
    const sub = rows.find((r) => r.id === id);
    if (sub) {
      await supabase.from("tasks").update({ status: "reviewed" }).eq("id", sub.task_id);
    }

    setSavingId(null);
    close();
    load();
  }

  return (
    <div>
      <div className="panel" style={{ marginBottom: "1.25rem" }}>
        <div className="panel-hd">
          <div>
            <div className="panel-ttl">
              <span className="ar">المُسلَّمات</span>
              <span className="en">Submissions</span>
            </div>
            <div className="dash-sub" style={{ marginBottom: 0 }}>
              <span className="ar">{rows.length} تسليم</span>
              <span className="en">{rows.length} submission{rows.length === 1 ? "" : "s"}</span>
            </div>
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
      ) : rows.length === 0 ? (
        <div className="empty">
          <div className="empty-ic">📥</div>
          <div className="empty-t">
            <span className="ar">لا توجد مُسلَّمات بعد</span>
            <span className="en">No submissions yet</span>
          </div>
          <div className="empty-d">
            <span className="ar">عندما يقوم اللاعبون بإرسال إجاباتهم على المهام، ستظهر هنا.</span>
            <span className="en">Submissions appear here once players turn in their tasks.</span>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
          {rows.map((s) => {
            const isOpen = editing === s.id;
            return (
              <div key={s.id} className="panel" style={{ padding: "1.25rem 1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: ".75rem", marginBottom: ".75rem" }}>
                  <div>
                    <div style={{ fontSize: ".95rem", fontWeight: 600, color: "#141414" }}>{s.task?.title ?? "—"}</div>
                    <div style={{ fontSize: ".78rem", color: "#666", marginTop: 3 }}>
                      <span className="ar">من: </span>
                      <span className="en">From: </span>
                      <b>{s.player?.full_name ?? s.player?.email ?? "—"}</b>
                      {" · "}
                      {new Date(s.submitted_at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                    </div>
                  </div>
                  {s.score != null && (
                    <span className="chip chip-grn">
                      <span className="ar">النتيجة: </span>
                      <span className="en">Score: </span>
                      {s.score}
                    </span>
                  )}
                </div>

                {s.content && (
                  <div style={{ background: "#FAF7F2", border: "1px solid #E5DFD2", padding: ".85rem 1rem", fontSize: ".85rem", color: "#444", whiteSpace: "pre-wrap", lineHeight: 1.6, marginBottom: ".75rem" }}>
                    {s.content}
                  </div>
                )}
                {s.file_url && (
                  <div style={{ marginBottom: ".75rem" }}>
                    <a href={s.file_url} target="_blank" rel="noopener" style={{ color: "#1E5BAA", fontSize: ".82rem" }}>📎 attached file</a>
                  </div>
                )}

                {s.feedback && !isOpen && (
                  <div className="ribbon" style={{ marginBottom: ".75rem" }}>
                    <strong>
                      <span className="ar">ملاحظات المدرب: </span>
                      <span className="en">Coach feedback: </span>
                    </strong>
                    {s.feedback}
                  </div>
                )}

                {isOpen ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: ".75rem", paddingTop: ".5rem", borderTop: "1px solid #E5DFD2" }}>
                    <div>
                      <label className="form-lbl">
                        <span className="ar">الملاحظات</span>
                        <span className="en">Feedback</span>
                      </label>
                      <textarea className="form-inp compact" rows={3} value={feedback} onChange={(e) => setFeedback(e.target.value)} disabled={savingId === s.id} />
                    </div>
                    <div style={{ display: "flex", gap: ".75rem", alignItems: "flex-end" }}>
                      <div style={{ flex: 1 }}>
                        <label className="form-lbl">
                          <span className="ar">النتيجة (0–100)</span>
                          <span className="en">Score (0–100)</span>
                        </label>
                        <input className="form-inp compact" type="number" min={0} max={100} value={score} onChange={(e) => setScore(e.target.value)} disabled={savingId === s.id} />
                      </div>
                      <button onClick={() => saveReview(s.id)} disabled={savingId === s.id} className="btn btn-primary btn-sm">
                        <span className="ar">حفظ المراجعة</span>
                        <span className="en">Save Review</span>
                      </button>
                      <button onClick={close} disabled={savingId === s.id} className="btn btn-secondary btn-sm">
                        <span className="ar">إلغاء</span>
                        <span className="en">Cancel</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => openReview(s)} className="btn btn-secondary btn-sm">
                    {s.feedback ? (
                      <><span className="ar">تعديل المراجعة</span><span className="en">Edit Review</span></>
                    ) : (
                      <><span className="ar">إضافة ملاحظات</span><span className="en">Review &amp; Score</span></>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
