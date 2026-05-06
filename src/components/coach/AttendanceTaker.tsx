"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useCurrentCoach } from "@/hooks/useCurrentCoach";
import UnlinkedCoachBanner from "@/components/coach/UnlinkedCoachBanner";

type Status = "present" | "absent" | "late" | "excused";

interface Player {
  id:   string;
  name: string;
}

interface AttendanceRow {
  player_id: string;
  date:      string;
  status:    Status;
  note:      string | null;
}

const STATUSES: { key: Status; ar: string; en: string; bg: string; color: string }[] = [
  { key: "present", ar: "حاضرة",  en: "Present",  bg: "rgba(0,122,56,.12)",   color: "#007A38" },
  { key: "late",    ar: "متأخرة", en: "Late",     bg: "rgba(160,120,32,.12)", color: "#A07820" },
  { key: "excused", ar: "مُستأذنة", en: "Excused", bg: "rgba(20,20,20,.08)",   color: "#555555" },
  { key: "absent",  ar: "غائبة",  en: "Absent",   bg: "rgba(212,43,60,.12)",  color: "#B02030" },
];

function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function AttendanceTaker() {
  const supabase = createClient();
  const { coachId, loading: coachLoading, unlinked } = useCurrentCoach();

  const [date,    setDate]    = useState(todayISO);
  const [players, setPlayers] = useState<Player[]>([]);
  const [statusByPlayer, setStatusByPlayer] = useState<Record<string, Status>>({});
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  // ── Load assigned players + existing attendance for the chosen date ───────
  const load = useCallback(async () => {
    if (coachLoading) return;
    if (!coachId) { setLoading(false); return; }

    setLoading(true);
    setError(null);

    const [{ data: playerRows, error: pErr }, { data: attRows, error: aErr }] = await Promise.all([
      supabase.from("players")
        .select("id, name, coach_assignments!inner(coach_id)")
        .eq("coach_assignments.coach_id", coachId)
        .order("name"),
      supabase.from("attendance").select("player_id, status").eq("date", date),
    ]);

    if (pErr) { setError(pErr.message); setLoading(false); return; }
    if (aErr) { setError(aErr.message); setLoading(false); return; }

    const fetchedPlayers = (playerRows ?? []) as Player[];
    setPlayers(fetchedPlayers);

    // Default everyone to 'present', then overwrite from existing rows
    const next: Record<string, Status> = {};
    for (const p of fetchedPlayers) next[p.id] = "present";
    for (const r of (attRows ?? []) as Pick<AttendanceRow, "player_id" | "status">[]) {
      next[r.player_id] = r.status;
    }
    setStatusByPlayer(next);
    setLoading(false);
  }, [supabase, date, coachId, coachLoading]);

  useEffect(() => { load(); }, [load]);

  if (unlinked) return <UnlinkedCoachBanner />;

  // ── Save all (bulk upsert) ────────────────────────────────────────────────
  async function handleSave() {
    setSaving(true);
    setError(null);
    setSavedAt(null);

    const rows = players.map((p) => ({
      player_id: p.id,
      date,
      status:    statusByPlayer[p.id] ?? "present",
    }));

    const { error } = await supabase
      .from("attendance")
      .upsert(rows, { onConflict: "player_id,date" });

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }

    setSaving(false);
    setSavedAt(Date.now());
  }

  function setOne(playerId: string, status: Status) {
    setStatusByPlayer((s) => ({ ...s, [playerId]: status }));
    setSavedAt(null);
  }

  function setAll(status: Status) {
    const next: Record<string, Status> = {};
    for (const p of players) next[p.id] = status;
    setStatusByPlayer(next);
    setSavedAt(null);
  }

  // ── Tally ─────────────────────────────────────────────────────────────────
  const tally: Record<Status, number> = { present: 0, absent: 0, late: 0, excused: 0 };
  for (const p of players) tally[statusByPlayer[p.id] ?? "present"]++;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem" }}>
        <div>
          <h3 className="font-disp" style={{ fontSize: "1.05rem", color: "#141414", marginBottom: ".35rem" }}>
            <span className="ar">تسجيل الحضور</span>
            <span className="en">Take Attendance</span>
          </h3>
          <p style={{ fontSize: ".78rem", color: "#555" }}>
            <span className="ar">{players.length} لاعبة</span>
            <span className="en">{players.length} players</span>
          </p>
        </div>

        <div style={{ display: "flex", gap: ".75rem", alignItems: "flex-end", flexWrap: "wrap" }}>
          <div>
            <label className="form-lbl">
              <span className="ar">التاريخ</span>
              <span className="en">Date</span>
            </label>
            <input
              className="form-inp"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={loading || saving}
              style={{ minWidth: 180 }}
            />
          </div>
          <button
            onClick={() => setAll("present")}
            disabled={loading || saving}
            className="btn btn-secondary btn-sm"
          >
            <span className="ar">تحديد الكل حاضرة</span>
            <span className="en">All present</span>
          </button>
          <button
            onClick={handleSave}
            disabled={loading || saving || players.length === 0}
            className="btn btn-primary btn-sm"
            style={{ opacity: saving ? .7 : 1 }}
          >
            {saving ? (
              <>
                <span className="ar">جاري الحفظ…</span>
                <span className="en">Saving…</span>
              </>
            ) : (
              <>
                <span className="ar">حفظ</span>
                <span className="en">Save</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Status summary chips */}
      <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
        {STATUSES.map((s) => (
          <span
            key={s.key}
            style={{ background: s.bg, color: s.color, padding: ".3rem .7rem", fontSize: ".75rem", fontWeight: 500 }}
          >
            <span className="ar">{s.ar}</span>
            <span className="en">{s.en}</span>: {tally[s.key]}
          </span>
        ))}
      </div>

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
              <th>
                <span className="ar">اللاعبة</span>
                <span className="en">Player</span>
              </th>
              <th style={{ width: "60%" }}>
                <span className="ar">الحالة</span>
                <span className="en">Status</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={2} style={{ padding: "1.5rem", textAlign: "center", color: "#999" }}>…</td></tr>
            )}
            {!loading && players.length === 0 && (
              <tr>
                <td colSpan={2} style={{ padding: "1.5rem", textAlign: "center", color: "#999", fontSize: ".85rem" }}>
                  <span className="ar">لا توجد لاعبات معيّنة لكِ</span>
                  <span className="en">No players assigned to you yet — ask an admin to assign players.</span>
                </td>
              </tr>
            )}
            {!loading && players.map((p) => {
              const current = statusByPlayer[p.id] ?? "present";
              return (
                <tr key={p.id}>
                  <td><b>{p.name}</b></td>
                  <td>
                    <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap" }}>
                      {STATUSES.map((s) => {
                        const active = current === s.key;
                        return (
                          <button
                            key={s.key}
                            type="button"
                            onClick={() => setOne(p.id, s.key)}
                            disabled={saving}
                            style={{
                              padding: ".35rem .8rem",
                              fontSize: ".75rem",
                              fontWeight: active ? 600 : 400,
                              border: active ? `2px solid ${s.color}` : "1px solid #D6D0C4",
                              background: active ? s.bg : "transparent",
                              color: active ? s.color : "#555",
                              cursor: saving ? "default" : "pointer",
                              fontFamily: "'Noto Sans Arabic','DM Sans',sans-serif",
                            }}
                          >
                            <span className="ar">{s.ar}</span>
                            <span className="en">{s.en}</span>
                          </button>
                        );
                      })}
                    </div>
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
