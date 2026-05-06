"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useCurrentCoach } from "@/hooks/useCurrentCoach";
import UnlinkedCoachBanner from "@/components/coach/UnlinkedCoachBanner";

interface Tournament { id: string; name: string; date: string }
interface Player     { id: string; name: string }

interface ParticipationState {
  participated: boolean;
  result:       string;
  score:        string;
}

export default function ParticipationsEditor() {
  const supabase = createClient();
  const { coachId, loading: coachLoading, unlinked } = useCurrentCoach();

  const [tournaments,    setTournaments]    = useState<Tournament[]>([]);
  const [players,        setPlayers]        = useState<Player[]>([]);
  const [tournamentId,   setTournamentId]   = useState<string>("");
  const [byPlayer,       setByPlayer]       = useState<Record<string, ParticipationState>>({});

  const [loadingTour, setLoadingTour] = useState(true);
  const [loadingRows, setLoadingRows] = useState(false);
  const [saving,      setSaving]      = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [savedAt,     setSavedAt]     = useState<number | null>(null);

  // ── Load tournaments + assigned players once ──────────────────────────────
  useEffect(() => {
    if (coachLoading) return;
    if (!coachId) { setLoadingTour(false); return; }

    (async () => {
      setLoadingTour(true);
      const [{ data: tRows, error: tErr }, { data: pRows, error: pErr }] = await Promise.all([
        supabase.from("tournaments").select("id, name, date").order("date", { ascending: false }),
        supabase.from("players")
          .select("id, name, coach_assignments!inner(coach_id)")
          .eq("coach_assignments.coach_id", coachId)
          .order("name"),
      ]);

      if (tErr || pErr) {
        setError(tErr?.message ?? pErr?.message ?? "Load failed");
        setLoadingTour(false);
        return;
      }

      const t = (tRows ?? []) as Tournament[];
      setTournaments(t);
      setPlayers((pRows ?? []) as Player[]);
      if (t.length > 0) setTournamentId(t[0].id);
      setLoadingTour(false);
    })();
  }, [supabase, coachId, coachLoading]);

  // ── When tournament changes, fetch its participations ──────────────────────
  const loadParticipations = useCallback(async () => {
    if (!tournamentId) {
      setByPlayer({});
      return;
    }
    setLoadingRows(true);
    setSavedAt(null);

    const { data, error } = await supabase
      .from("participations")
      .select("player_id, result, score")
      .eq("tournament_id", tournamentId);

    if (error) {
      setError(error.message);
      setLoadingRows(false);
      return;
    }

    const next: Record<string, ParticipationState> = {};
    for (const p of players) {
      next[p.id] = { participated: false, result: "", score: "" };
    }
    for (const row of (data ?? []) as { player_id: string; result: string | null; score: number | null }[]) {
      next[row.player_id] = {
        participated: true,
        result:       row.result ?? "",
        score:        row.score == null ? "" : String(row.score),
      };
    }
    setByPlayer(next);
    setLoadingRows(false);
  }, [supabase, tournamentId, players]);

  useEffect(() => { loadParticipations(); }, [loadParticipations]);

  if (unlinked) return <UnlinkedCoachBanner />;

  // ── Field updaters ─────────────────────────────────────────────────────────
  function update(pid: string, patch: Partial<ParticipationState>) {
    setByPlayer((s) => ({ ...s, [pid]: { ...s[pid], ...patch } }));
    setSavedAt(null);
  }

  // ── Save: delete unchecked + upsert checked ────────────────────────────────
  async function handleSave() {
    if (!tournamentId) return;
    setSaving(true);
    setError(null);
    setSavedAt(null);

    const checked   = players.filter((p) => byPlayer[p.id]?.participated);
    const uncheckedIds = players
      .filter((p) => !byPlayer[p.id]?.participated)
      .map((p) => p.id);

    // 1) Delete rows for players who were unchecked
    if (uncheckedIds.length > 0) {
      const { error: dErr } = await supabase
        .from("participations")
        .delete()
        .eq("tournament_id", tournamentId)
        .in("player_id", uncheckedIds);
      if (dErr) { setError(dErr.message); setSaving(false); return; }
    }

    // 2) Upsert rows for checked players
    if (checked.length > 0) {
      const upserts = checked.map((p) => {
        const s     = byPlayer[p.id];
        const score = s.score.trim() === "" ? null : Number(s.score);
        return {
          tournament_id: tournamentId,
          player_id:     p.id,
          result:        s.result.trim() || null,
          score:         Number.isFinite(score as number) ? score : null,
        };
      });

      const { error: uErr } = await supabase
        .from("participations")
        .upsert(upserts, { onConflict: "player_id,tournament_id" });
      if (uErr) { setError(uErr.message); setSaving(false); return; }
    }

    setSaving(false);
    setSavedAt(Date.now());
  }

  // ── Render ────────────────────────────────────────────────────────────────
  const checkedCount = players.filter((p) => byPlayer[p.id]?.participated).length;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem" }}>
        <div>
          <h3 className="font-disp" style={{ fontSize: "1.05rem", color: "#141414", marginBottom: ".35rem" }}>
            <span className="ar">المشاركات في البطولات</span>
            <span className="en">Tournament Participations</span>
          </h3>
          <p style={{ fontSize: ".78rem", color: "#555" }}>
            <span className="ar">{checkedCount} مشاركة</span>
            <span className="en">{checkedCount} participating</span>
          </p>
        </div>

        <div style={{ display: "flex", gap: ".75rem", alignItems: "flex-end", flexWrap: "wrap" }}>
          <div>
            <label className="form-lbl">
              <span className="ar">البطولة</span>
              <span className="en">Tournament</span>
            </label>
            <select
              className="form-inp"
              value={tournamentId}
              onChange={(e) => setTournamentId(e.target.value)}
              disabled={loadingTour || saving || tournaments.length === 0}
              style={{ minWidth: 240 }}
            >
              {tournaments.length === 0 && <option value="">— no tournaments —</option>}
              {tournaments.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.date})
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleSave}
            disabled={loadingRows || saving || !tournamentId}
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
              <th style={{ width: 80 }}>
                <span className="ar">شاركت</span>
                <span className="en">In</span>
              </th>
              <th>
                <span className="ar">اللاعبة</span>
                <span className="en">Player</span>
              </th>
              <th style={{ width: "30%" }}>
                <span className="ar">النتيجة</span>
                <span className="en">Result</span>
              </th>
              <th style={{ width: 120 }}>
                <span className="ar">النقاط</span>
                <span className="en">Score</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {(loadingTour || loadingRows) && (
              <tr><td colSpan={4} style={{ padding: "1.5rem", textAlign: "center", color: "#999" }}>…</td></tr>
            )}
            {!loadingTour && !loadingRows && tournaments.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: "1.5rem", textAlign: "center", color: "#999", fontSize: ".85rem" }}>
                  <span className="ar">لا توجد بطولات بعد — أضف واحدة من لوحة الإدارة</span>
                  <span className="en">No tournaments yet — add one from the admin page.</span>
                </td>
              </tr>
            )}
            {!loadingTour && !loadingRows && tournaments.length > 0 && players.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: "1.5rem", textAlign: "center", color: "#999", fontSize: ".85rem" }}>
                  <span className="ar">لا توجد لاعبات معيّنة لكِ</span>
                  <span className="en">No players assigned to you yet — ask an admin to assign players.</span>
                </td>
              </tr>
            )}
            {!loadingTour && !loadingRows && players.map((p) => {
              const s = byPlayer[p.id] ?? { participated: false, result: "", score: "" };
              return (
                <tr key={p.id} style={{ opacity: s.participated ? 1 : .55 }}>
                  <td>
                    <input
                      type="checkbox"
                      checked={s.participated}
                      onChange={(e) => update(p.id, { participated: e.target.checked })}
                      disabled={saving}
                      style={{ width: 18, height: 18, accentColor: "#D42B3C", cursor: saving ? "default" : "pointer" }}
                    />
                  </td>
                  <td><b>{p.name}</b></td>
                  <td>
                    <input
                      className="form-inp"
                      type="text"
                      placeholder="e.g. 1st, 5/7, withdrew"
                      value={s.result}
                      onChange={(e) => update(p.id, { result: e.target.value })}
                      disabled={saving || !s.participated}
                      style={{ padding: ".4rem .7rem" }}
                    />
                  </td>
                  <td>
                    <input
                      className="form-inp"
                      type="number"
                      step="0.5"
                      placeholder="—"
                      value={s.score}
                      onChange={(e) => update(p.id, { score: e.target.value })}
                      disabled={saving || !s.participated}
                      style={{ padding: ".4rem .7rem" }}
                    />
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
