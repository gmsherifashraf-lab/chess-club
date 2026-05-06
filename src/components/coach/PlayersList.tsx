"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Player {
  id:     string;
  name:   string;
  rating: number | null;
  age:    number | null;
}

interface Attendance {
  player_id: string;
  status:    "present" | "absent" | "late" | "excused";
}

export default function PlayersList() {
  const supabase = createClient();

  const [players, setPlayers] = useState<Player[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [{ data: pRows, error: pErr }, { data: aRows, error: aErr }] = await Promise.all([
        supabase.from("players").select("id, name, rating, age").order("rating", { ascending: false, nullsFirst: false }),
        supabase.from("attendance").select("player_id, status"),
      ]);

      if (pErr || aErr) {
        setError(pErr?.message ?? aErr?.message ?? "Load failed");
        setLoading(false);
        return;
      }

      setPlayers((pRows ?? []) as Player[]);
      setAttendance((aRows ?? []) as Attendance[]);
      setLoading(false);
    })();
  }, [supabase]);

  // Aggregate attendance per player
  const attByPlayer = new Map<string, { attended: number; missed: number }>();
  for (const a of attendance) {
    const cur = attByPlayer.get(a.player_id) ?? { attended: 0, missed: 0 };
    if (a.status === "present" || a.status === "late") cur.attended++;
    else if (a.status === "absent")                    cur.missed++;
    // 'excused' doesn't count either way
    attByPlayer.set(a.player_id, cur);
  }

  function attPct(playerId: string): number | null {
    const row = attByPlayer.get(playerId);
    if (!row) return null;
    const total = row.attended + row.missed;
    if (total === 0) return null;
    return Math.round((row.attended / total) * 100);
  }

  return (
    <div>
      <h3 className="font-disp" style={{ fontSize: "1.05rem", color: "#141414", marginBottom: "1.25rem" }}>
        <span className="ar">اللاعبات ({players.length})</span>
        <span className="en">Players ({players.length})</span>
      </h3>

      {error && (
        <div style={{ background: "rgba(212,43,60,.08)", border: "1px solid rgba(212,43,60,.25)", padding: ".7rem 1rem", marginBottom: "1rem", fontSize: ".82rem", color: "#B02030" }}>
          {error}
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
              <th style={{ width: 90 }}>
                <span className="ar">العمر</span>
                <span className="en">Age</span>
              </th>
              <th style={{ width: 110 }}>
                <span className="ar">التصنيف</span>
                <span className="en">Rating</span>
              </th>
              <th style={{ width: 130 }}>
                <span className="ar">الحضور</span>
                <span className="en">Attendance</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={4} style={{ padding: "1.5rem", textAlign: "center", color: "#999" }}>…</td></tr>
            )}
            {!loading && players.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: "1.5rem", textAlign: "center", color: "#999", fontSize: ".85rem" }}>
                  <span className="ar">لا توجد لاعبات بعد</span>
                  <span className="en">No players yet — add some from the admin page.</span>
                </td>
              </tr>
            )}
            {!loading && players.map((p) => {
              const pct   = attPct(p.id);
              const att   = attByPlayer.get(p.id);
              const total = (att?.attended ?? 0) + (att?.missed ?? 0);
              const color = pct == null ? "#999" : pct < 70 ? "#A07820" : pct < 85 ? "#141414" : "#007A38";

              return (
                <tr key={p.id}>
                  <td><b>{p.name}</b></td>
                  <td>{p.age ?? <span style={{ opacity: .3 }}>—</span>}</td>
                  <td>
                    {p.rating
                      ? <b style={{ color: p.rating >= 1700 ? "#D42B3C" : "#141414" }}>{p.rating}</b>
                      : <span style={{ opacity: .3 }}>—</span>}
                  </td>
                  <td>
                    {pct == null
                      ? <span style={{ opacity: .3 }}>—</span>
                      : <span style={{ color, fontWeight: 600 }}>
                          {pct}%
                          <span style={{ opacity: .5, fontWeight: 400, marginLeft: 6, fontSize: ".75rem" }}>
                            ({att!.attended}/{total})
                          </span>
                        </span>}
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
