"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface Coach  { id: string; name: string; title: string | null; user_id: string | null }
interface Player { id: string; name: string; rating: number | null }

export default function CoachAssignments() {
  const supabase = createClient();

  const [coaches,  setCoaches]  = useState<Coach[]>([]);
  const [players,  setPlayers]  = useState<Player[]>([]);
  const [coachId,  setCoachId]  = useState<string>("");
  const [assigned, setAssigned] = useState<Record<string, boolean>>({});

  const [loadingTop, setLoadingTop] = useState(true);
  const [loadingRows, setLoadingRows] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  // ── Load coaches + players once ───────────────────────────────────────────
  useEffect(() => {
    (async () => {
      setLoadingTop(true);
      const [{ data: cRows, error: cErr }, { data: pRows, error: pErr }] = await Promise.all([
        supabase.from("coaches").select("id, name, title, user_id").order("name"),
        supabase.from("players").select("id, name, rating").order("name"),
      ]);

      if (cErr || pErr) {
        setError(cErr?.message ?? pErr?.message ?? "Load failed");
        setLoadingTop(false);
        return;
      }

      const c = (cRows ?? []) as Coach[];
      setCoaches(c);
      setPlayers((pRows ?? []) as Player[]);
      if (c.length > 0) setCoachId(c[0].id);
      setLoadingTop(false);
    })();
  }, [supabase]);

  // ── When coach changes, load their current assignments ─────────────────────
  const loadAssignments = useCallback(async () => {
    if (!coachId) {
      setAssigned({});
      return;
    }
    setLoadingRows(true);
    setSavedAt(null);

    const { data, error } = await supabase
      .from("coach_assignments")
      .select("player_id")
      .eq("coach_id", coachId);

    if (error) {
      setError(error.message);
      setLoadingRows(false);
      return;
    }

    const next: Record<string, boolean> = {};
    for (const p of players) next[p.id] = false;
    for (const row of (data ?? []) as { player_id: string }[]) {
      next[row.player_id] = true;
    }
    setAssigned(next);
    setLoadingRows(false);
  }, [supabase, coachId, players]);

  useEffect(() => { loadAssignments(); }, [loadAssignments]);

  function toggle(pid: string) {
    setAssigned((s) => ({ ...s, [pid]: !s[pid] }));
    setSavedAt(null);
  }
  function setAll(value: boolean) {
    const next: Record<string, boolean> = {};
    for (const p of players) next[p.id] = value;
    setAssigned(next);
    setSavedAt(null);
  }

  async function handleSave() {
    if (!coachId) return;
    setSaving(true);
    setError(null);
    setSavedAt(null);

    const checkedIds   = players.filter((p) =>  assigned[p.id]).map((p) => p.id);
    const uncheckedIds = players.filter((p) => !assigned[p.id]).map((p) => p.id);

    // Delete unchecked assignments for this coach
    if (uncheckedIds.length > 0) {
      const { error: dErr } = await supabase
        .from("coach_assignments")
        .delete()
        .eq("coach_id", coachId)
        .in("player_id", uncheckedIds);
      if (dErr) { setError(dErr.message); setSaving(false); return; }
    }

    // Upsert checked ones
    if (checkedIds.length > 0) {
      const upserts = checkedIds.map((pid) => ({ coach_id: coachId, player_id: pid }));
      const { error: uErr } = await supabase
        .from("coach_assignments")
        .upsert(upserts, { onConflict: "coach_id,player_id" });
      if (uErr) { setError(uErr.message); setSaving(false); return; }
    }

    setSaving(false);
    setSavedAt(Date.now());
  }

  const coach          = coaches.find((c) => c.id === coachId) ?? null;
  const isLinked       = Boolean(coach?.user_id);
  const assignedCount  = Object.values(assigned).filter(Boolean).length;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem" }}>
        <div>
          <h3 className="font-disp" style={{ fontSize: "1.05rem", color: "#141414", marginBottom: ".35rem" }}>
            <span className="ar">تعيين اللاعبات للمدربات</span>
            <span className="en">Coach ↔ Player Assignments</span>
          </h3>
          <p style={{ fontSize: ".78rem", color: "#555" }}>
            <span className="ar">{assignedCount} لاعبة معيّنة</span>
            <span className="en">{assignedCount} players assigned</span>
          </p>
        </div>

        <div style={{ display: "flex", gap: ".75rem", alignItems: "flex-end", flexWrap: "wrap" }}>
          <div>
            <label className="form-lbl">
              <span className="ar">المدربة</span>
              <span className="en">Coach</span>
            </label>
            <select
              className="form-inp"
              value={coachId}
              onChange={(e) => setCoachId(e.target.value)}
              disabled={loadingTop || saving || coaches.length === 0}
              style={{ minWidth: 240 }}
            >
              {coaches.length === 0 && <option value="">— no coaches —</option>}
              {coaches.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}{c.title ? ` — ${c.title}` : ""}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setAll(false)}
            disabled={loadingRows || saving || players.length === 0}
            className="btn btn-secondary btn-sm"
          >
            <span className="ar">إلغاء التحديد</span>
            <span className="en">Clear all</span>
          </button>
          <button
            onClick={handleSave}
            disabled={loadingRows || saving || !coachId}
            className="btn btn-primary btn-sm"
            style={{ opacity: saving ? .7 : 1 }}
          >
            {saving ? <><span className="ar">جاري الحفظ…</span><span className="en">Saving…</span></>
                    : <><span className="ar">حفظ</span><span className="en">Save</span></>}
          </button>
        </div>
      </div>

      {/* Linked-user status banner */}
      {coach && !isLinked && (
        <div style={{ background: "rgba(160,120,32,.08)", border: "1px solid rgba(160,120,32,.25)", padding: ".7rem 1rem", marginBottom: "1rem", fontSize: ".82rem", color: "#A07820" }}>
          <span className="ar">⚠ لم يتم ربط هذه المدربة بحساب مستخدم — لن ترى لاعباتها في لوحة تحكم المدربة حتى يتم الربط.</span>
          <span className="en">⚠ This coach is not yet linked to a user account. Their assigned players won&apos;t appear in their coach dashboard until you link them. See migration 0004 for the SQL.</span>
        </div>
      )}

      {error && (
        <div style={{ background: "rgba(212,43,60,.08)", border: "1px solid rgba(212,43,60,.25)", padding: ".7rem 1rem", marginBottom: "1rem", fontSize: ".82rem", color: "#B02030" }}>
          {error}
        </div>
      )}
      {savedAt && !error && (
        <div style={{ background: "rgba(0,122,56,.08)", border: "1px solid rgba(0,122,56,.25)", padding: ".7rem 1rem", marginBottom: "1rem", fontSize: ".82rem", color: "#007A38" }}>
          <span className="ar">تم الحفظ ✓</span>
          <span className="en">Saved ✓</span>
        </div>
      )}

      <div style={{ background: "#fff", border: "1px solid #D6D0C4", overflow: "auto" }}>
        <table className="dtable">
          <thead>
            <tr>
              <th style={{ width: 80 }}><span className="ar">معيّنة</span><span className="en">Assigned</span></th>
              <th><span className="ar">اللاعبة</span><span className="en">Player</span></th>
              <th style={{ width: 110 }}><span className="ar">التصنيف</span><span className="en">Rating</span></th>
            </tr>
          </thead>
          <tbody>
            {(loadingTop || loadingRows) && (
              <tr><td colSpan={3} style={{ padding: "1.5rem", textAlign: "center", color: "#999" }}>…</td></tr>
            )}
            {!loadingTop && !loadingRows && coaches.length === 0 && (
              <tr>
                <td colSpan={3} style={{ padding: "1.5rem", textAlign: "center", color: "#999", fontSize: ".85rem" }}>
                  <span className="ar">لا توجد مدربات بعد</span>
                  <span className="en">No coaches yet — add one in the Coaches tab.</span>
                </td>
              </tr>
            )}
            {!loadingTop && !loadingRows && coaches.length > 0 && players.length === 0 && (
              <tr>
                <td colSpan={3} style={{ padding: "1.5rem", textAlign: "center", color: "#999", fontSize: ".85rem" }}>
                  <span className="ar">لا توجد لاعبات بعد</span>
                  <span className="en">No players yet — add some in the Players tab.</span>
                </td>
              </tr>
            )}
            {!loadingTop && !loadingRows && players.map((p) => {
              const isAssigned = !!assigned[p.id];
              return (
                <tr key={p.id} style={{ opacity: isAssigned ? 1 : .55 }}>
                  <td>
                    <input
                      type="checkbox"
                      checked={isAssigned}
                      onChange={() => toggle(p.id)}
                      disabled={saving}
                      style={{ width: 18, height: 18, accentColor: "#D42B3C", cursor: saving ? "default" : "pointer" }}
                    />
                  </td>
                  <td><b>{p.name}</b></td>
                  <td>
                    {p.rating
                      ? <b style={{ color: p.rating >= 1700 ? "#D42B3C" : "#141414" }}>{p.rating}</b>
                      : <span style={{ opacity: .3 }}>—</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
