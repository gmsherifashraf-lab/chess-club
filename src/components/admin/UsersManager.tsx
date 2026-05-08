"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { ROLE_LABEL, type UserRole } from "@/lib/auth";

interface ProfileRow {
  id:         string;
  email:      string | null;
  full_name:  string | null;
  role:       UserRole;
  avatar_url: string | null;
  bio:        string | null;
  created_at: string;
}

const ROLES: UserRole[] = ["admin", "coach", "player"];

export default function UsersManager() {
  const supabase = createClient();
  const [rows, setRows] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<UserRole | "all">("all");
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, full_name, role, avatar_url, bio, created_at")
      .order("created_at", { ascending: false });
    if (error) { setError(error.message); setLoading(false); return; }
    setRows((data ?? []) as ProfileRow[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  async function changeRole(id: string, role: UserRole) {
    setSavingId(id);
    const { error } = await supabase.from("profiles").update({ role }).eq("id", id);
    setSavingId(null);
    if (error) { alert(error.message); return; }
    load();
  }

  async function updateName(id: string, name: string) {
    setSavingId(id);
    const { error } = await supabase.from("profiles").update({ full_name: name }).eq("id", id);
    setSavingId(null);
    if (error) { alert(error.message); return; }
    load();
  }

  async function deleteUser(id: string) {
    if (!confirm("Delete this profile? Their auth account stays but they will lose role and progress.")) return;
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (error) { alert(error.message); return; }
    load();
  }

  const filtered = rows.filter((r) => {
    if (filter !== "all" && r.role !== filter) return false;
    if (search) {
      const s = search.toLowerCase();
      return (
        (r.full_name ?? "").toLowerCase().includes(s) ||
        (r.email     ?? "").toLowerCase().includes(s)
      );
    }
    return true;
  });

  const counts = { all: rows.length, admin: 0, coach: 0, player: 0 };
  for (const r of rows) counts[r.role]++;

  return (
    <div>
      <div className="panel" style={{ marginBottom: "1.25rem" }}>
        <div className="panel-hd">
          <div>
            <div className="panel-ttl">
              <span className="ar">إدارة المستخدمين</span>
              <span className="en">User Management</span>
            </div>
            <div className="dash-sub" style={{ marginBottom: 0 }}>
              {counts.all} total · {counts.admin} admin · {counts.coach} coach · {counts.player} player
            </div>
          </div>
          <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
            <input className="form-inp compact" placeholder="Search name or email…" value={search} onChange={(e) => setSearch(e.target.value)} style={{ minWidth: 220 }} />
            <select className="form-inp compact" value={filter} onChange={(e) => setFilter(e.target.value as UserRole | "all")}>
              <option value="all">All roles</option>
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div style={{ background: "rgba(212,43,60,.08)", border: "1px solid rgba(212,43,60,.25)", padding: ".7rem 1rem", marginBottom: "1rem", fontSize: ".82rem", color: "#B02030" }}>
          {error}
        </div>
      )}

      <div className="panel" style={{ overflow: "auto" }}>
        <table className="dtable">
          <thead>
            <tr>
              <th><span className="ar">المستخدم</span><span className="en">User</span></th>
              <th><span className="ar">البريد</span><span className="en">Email</span></th>
              <th style={{ width: 160 }}><span className="ar">الدور</span><span className="en">Role</span></th>
              <th style={{ width: 130 }}><span className="ar">منذ</span><span className="en">Joined</span></th>
              <th style={{ width: 120 }}><span className="ar">إجراء</span><span className="en">Action</span></th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={5} style={{ padding: "1.5rem", textAlign: "center", color: "#999" }}>…</td></tr>}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={5} style={{ padding: "1.5rem", textAlign: "center", color: "#999", fontSize: ".85rem" }}>
                <span className="ar">لا يوجد مستخدمون مطابقون</span>
                <span className="en">No matching users</span>
              </td></tr>
            )}
            {!loading && filtered.map((r) => {
              const initial = (r.full_name ?? r.email ?? "?").trim().charAt(0).toUpperCase();
              return (
                <tr key={r.id}>
                  <td>
                    <div style={{ display: "flex", gap: ".75rem", alignItems: "center" }}>
                      <div style={{ width: 36, height: 36, background: "#141414", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, borderRadius: 4 }}>{initial}</div>
                      <input className="form-inp compact" defaultValue={r.full_name ?? ""} placeholder="(name)" onBlur={(e) => { if (e.target.value !== (r.full_name ?? "")) updateName(r.id, e.target.value); }} disabled={savingId === r.id} style={{ minWidth: 160 }} />
                    </div>
                  </td>
                  <td><span style={{ fontSize: ".82rem", color: "#444" }}>{r.email ?? "—"}</span></td>
                  <td>
                    <select className="form-inp compact" value={r.role} onChange={(e) => changeRole(r.id, e.target.value as UserRole)} disabled={savingId === r.id}>
                      {ROLES.map((role) => (
                        <option key={role} value={role}>
                          {ROLE_LABEL[role].en}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td><span style={{ opacity: .6, fontSize: ".78rem" }}>{new Date(r.created_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}</span></td>
                  <td>
                    <button onClick={() => deleteUser(r.id)} className="btn btn-sm" style={{ background: "rgba(212,43,60,.1)", color: "#B02030", border: "none" }}>
                      <span className="ar">حذف</span>
                      <span className="en">Delete</span>
                    </button>
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
