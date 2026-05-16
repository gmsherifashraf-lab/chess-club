"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface P {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string;
}

interface RosterPlayer {
  id: string;
  name: string;
  rating: number | null;
  profile_id: string | null;
}

export default function LinksManager() {
  const supabase = createClient();
  const [people, setPeople] = useState<P[]>([]);
  const [parentOf, setParentOf] = useState<Record<string, string>>({}); // player → parent
  const [coachesOf, setCoachesOf] = useState<Record<string, string[]>>({}); // player → coachIds
  const [roster, setRoster] = useState<RosterPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    const [{ data: prof, error: e1 }, { data: pp }, { data: cp }, { data: rp }] =
      await Promise.all([
        supabase
          .from("profiles")
          .select("id, full_name, email, role")
          .order("full_name", { ascending: true }),
        supabase
          .from("parent_player_relationships")
          .select("parent_id, player_id"),
        supabase
          .from("coach_player_relationships")
          .select("coach_id, player_id"),
        supabase
          .from("players")
          .select("id, name, rating, profile_id")
          .order("name", { ascending: true }),
      ]);
    if (e1) {
      setErr(e1.message);
      setLoading(false);
      return;
    }
    setPeople((prof ?? []) as P[]);
    const pMap: Record<string, string> = {};
    for (const r of pp ?? []) pMap[r.player_id] = r.parent_id;
    const cMap: Record<string, string[]> = {};
    for (const r of cp ?? []) {
      (cMap[r.player_id] ??= []).push(r.coach_id);
    }
    setParentOf(pMap);
    setCoachesOf(cMap);
    setRoster((rp ?? []) as RosterPlayer[]);
    setLoading(false);
  }, [supabase]);

  async function bridge(rosterId: string, profileId: string) {
    setBusy(rosterId);
    setErr(null);
    const { error } = await supabase
      .from("players")
      .update({ profile_id: profileId || null })
      .eq("id", rosterId);
    setBusy(null);
    if (error) setErr(error.message);
    else load();
  }

  useEffect(() => {
    load();
  }, [load]);

  const players = people.filter((p) => p.role === "player");
  const parents = people.filter((p) => p.role === "parent");
  const coaches = people.filter((p) => p.role === "coach");
  const label = (p?: P) =>
    p ? p.full_name || p.email || p.id.slice(0, 8) : "—";
  const byId = (id: string) => people.find((p) => p.id === id);
  const unlinked = players.filter((p) => !parentOf[p.id]);

  async function setParent(playerId: string, parentId: string) {
    setBusy(playerId);
    setErr(null);
    if (!parentId) {
      const { error } = await supabase
        .from("parent_player_relationships")
        .delete()
        .eq("player_id", playerId);
      setBusy(null);
      if (error) setErr(error.message);
      else load();
      return;
    }
    const { error } = await supabase
      .from("parent_player_relationships")
      .upsert(
        { player_id: playerId, parent_id: parentId },
        { onConflict: "player_id" },
      );
    setBusy(null);
    if (error) setErr(error.message);
    else load();
  }

  async function addCoach(playerId: string, coachId: string) {
    if (!coachId) return;
    setBusy(playerId);
    setErr(null);
    const { error } = await supabase
      .from("coach_player_relationships")
      .insert({ player_id: playerId, coach_id: coachId });
    setBusy(null);
    if (error && !error.message.includes("duplicate")) setErr(error.message);
    load();
  }

  async function removeCoach(playerId: string, coachId: string) {
    setBusy(playerId);
    const { error } = await supabase
      .from("coach_player_relationships")
      .delete()
      .eq("player_id", playerId)
      .eq("coach_id", coachId);
    setBusy(null);
    if (error) setErr(error.message);
    else load();
  }

  return (
    <div>
      <div className="panel" style={{ marginBottom: "1.25rem" }}>
        <div className="panel-hd">
          <div>
            <div className="panel-ttl">
              <span className="ar">الربط: أولياء الأمور والمدربات</span>
              <span className="en">Parent &amp; Coach Linking</span>
            </div>
            <div className="dash-sub" style={{ marginBottom: 0 }}>
              {players.length} players · {parents.length} parents ·{" "}
              {coaches.length} coaches
            </div>
          </div>
        </div>
      </div>

      {unlinked.length > 0 && (
        <div
          className="ribbon"
          style={{ marginBottom: "1rem", color: "#A50D26" }}
        >
          <strong>
            <span className="ar">{unlinked.length} لاعبة بلا وليّ أمر: </span>
            <span className="en">{unlinked.length} player(s) without a parent: </span>
          </strong>
          {unlinked.map(label).join(", ")}
        </div>
      )}

      {err && (
        <div
          style={{
            background: "rgba(200,16,46,.08)",
            border: "1px solid rgba(200,16,46,.25)",
            padding: ".7rem 1rem",
            marginBottom: "1rem",
            fontSize: ".82rem",
            color: "#A50D26",
          }}
        >
          {err}
        </div>
      )}

      <div className="panel" style={{ overflow: "auto" }}>
        <table className="dtable">
          <thead>
            <tr>
              <th>
                <span className="ar">اللاعبة</span>
                <span className="en">Player</span>
              </th>
              <th style={{ width: 240 }}>
                <span className="ar">وليّة الأمر</span>
                <span className="en">Parent</span>
              </th>
              <th>
                <span className="ar">المدربات</span>
                <span className="en">Coaches</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={3} style={{ padding: "1.5rem", textAlign: "center", color: "#999" }}>
                  …
                </td>
              </tr>
            )}
            {!loading && players.length === 0 && (
              <tr>
                <td colSpan={3} style={{ padding: "1.5rem", textAlign: "center", color: "#999", fontSize: ".85rem" }}>
                  <span className="ar">لا يوجد لاعبات بعد</span>
                  <span className="en">No players yet</span>
                </td>
              </tr>
            )}
            {!loading &&
              players.map((pl) => {
                const linkedCoachIds = coachesOf[pl.id] ?? [];
                return (
                  <tr key={pl.id}>
                    <td style={{ fontWeight: 600, color: "#1F1F1F" }}>
                      {label(pl)}
                      <div style={{ fontSize: ".72rem", color: "#888" }}>
                        {pl.email}
                      </div>
                    </td>
                    <td>
                      <select
                        className="form-inp compact"
                        value={parentOf[pl.id] ?? ""}
                        onChange={(e) => setParent(pl.id, e.target.value)}
                        disabled={busy === pl.id}
                        style={{
                          borderColor: parentOf[pl.id]
                            ? undefined
                            : "#C8102E",
                        }}
                      >
                        <option value="">— no parent —</option>
                        {parents.map((p) => (
                          <option key={p.id} value={p.id}>
                            {label(p)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: ".4rem",
                          alignItems: "center",
                        }}
                      >
                        {linkedCoachIds.map((cid) => (
                          <span
                            key={cid}
                            className="chip chip-grn"
                            style={{ display: "inline-flex", gap: ".4rem" }}
                          >
                            {label(byId(cid))}
                            <button
                              onClick={() => removeCoach(pl.id, cid)}
                              disabled={busy === pl.id}
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "#A50D26",
                                fontWeight: 700,
                              }}
                              aria-label="Remove coach"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                        <select
                          className="form-inp compact"
                          value=""
                          onChange={(e) => addCoach(pl.id, e.target.value)}
                          disabled={busy === pl.id}
                          style={{ minWidth: 150 }}
                        >
                          <option value="">+ add coach</option>
                          {coaches
                            .filter((c) => !linkedCoachIds.includes(c.id))
                            .map((c) => (
                              <option key={c.id} value={c.id}>
                                {label(c)}
                              </option>
                            ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* ── Roster ↔ Login bridge ─────────────────────────────────── */}
      <div className="panel" style={{ margin: "1.5rem 0 1rem" }}>
        <div className="panel-hd">
          <div>
            <div className="panel-ttl">
              <span className="ar">الربط: السجل ↔ حساب الدخول</span>
              <span className="en">Roster ↔ Login Bridge</span>
            </div>
            <div className="dash-sub" style={{ marginBottom: 0 }}>
              <span className="ar">
                اربطي كل لاعبة في السجل بحساب دخولها حتى يصل الحضور والتقدّم
                إلى وليّة الأمر.
              </span>
              <span className="en">
                Link each roster player to their login so attendance and
                progress reach the parent.
              </span>
            </div>
          </div>
        </div>
      </div>

      {(() => {
        const unbridged = roster.filter((r) => !r.profile_id).length;
        return unbridged > 0 ? (
          <div
            className="ribbon"
            style={{ marginBottom: "1rem", color: "#A50D26" }}
          >
            <strong>
              <span className="ar">{unbridged} لاعبة بالسجل بلا حساب دخول</span>
              <span className="en">
                {unbridged} roster player(s) not linked to a login
              </span>
            </strong>
          </div>
        ) : null;
      })()}

      <div className="panel" style={{ overflow: "auto" }}>
        <table className="dtable">
          <thead>
            <tr>
              <th>
                <span className="ar">لاعبة السجل</span>
                <span className="en">Roster Player</span>
              </th>
              <th style={{ width: 90 }}>
                <span className="ar">التصنيف</span>
                <span className="en">Rating</span>
              </th>
              <th style={{ width: 280 }}>
                <span className="ar">حساب الدخول</span>
                <span className="en">Linked Login</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={3} style={{ padding: "1.5rem", textAlign: "center", color: "#999" }}>
                  …
                </td>
              </tr>
            )}
            {!loading && roster.length === 0 && (
              <tr>
                <td colSpan={3} style={{ padding: "1.5rem", textAlign: "center", color: "#999", fontSize: ".85rem" }}>
                  <span className="ar">لا يوجد لاعبات في السجل</span>
                  <span className="en">No roster players</span>
                </td>
              </tr>
            )}
            {!loading &&
              roster.map((r) => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 600, color: "#1F1F1F" }}>
                    {r.name}
                  </td>
                  <td>
                    {r.rating ?? (
                      <span style={{ opacity: 0.3 }}>—</span>
                    )}
                  </td>
                  <td>
                    <select
                      className="form-inp compact"
                      value={r.profile_id ?? ""}
                      onChange={(e) => bridge(r.id, e.target.value)}
                      disabled={busy === r.id}
                      style={{
                        borderColor: r.profile_id ? undefined : "#C8102E",
                        minWidth: 220,
                      }}
                    >
                      <option value="">— no login —</option>
                      {players.map((pl) => (
                        <option key={pl.id} value={pl.id}>
                          {label(pl)}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
