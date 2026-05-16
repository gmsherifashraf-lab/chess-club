"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { ROLE_LABEL, ALL_ROLES, type UserRole } from "@/lib/auth";

interface ProfileRow {
  id: string;
  email: string | null;
  full_name: string | null;
  role: UserRole;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
}

interface Opt {
  id: string;
  full_name: string | null;
  email: string | null;
}

export default function UsersManager() {
  const supabase = createClient();
  const [rows, setRows] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<UserRole | "all">("all");
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, full_name, role, avatar_url, bio, created_at")
      .order("created_at", { ascending: false });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    setRows((data ?? []) as ProfileRow[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  async function changeRole(id: string, role: UserRole) {
    setSavingId(id);
    const { error } = await supabase
      .from("profiles")
      .update({ role })
      .eq("id", id);
    setSavingId(null);
    if (error) {
      alert(error.message);
      return;
    }
    load();
  }

  async function updateName(id: string, name: string) {
    setSavingId(id);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: name })
      .eq("id", id);
    setSavingId(null);
    if (error) {
      alert(error.message);
      return;
    }
    load();
  }

  async function deleteUser(id: string) {
    if (
      !confirm(
        "Delete this profile? Their auth account stays but they lose role and progress.",
      )
    )
      return;
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (error) {
      alert(error.message);
      return;
    }
    load();
  }

  const parents: Opt[] = rows
    .filter((r) => r.role === "parent")
    .map((r) => ({ id: r.id, full_name: r.full_name, email: r.email }));
  const coaches: Opt[] = rows
    .filter((r) => r.role === "coach")
    .map((r) => ({ id: r.id, full_name: r.full_name, email: r.email }));

  const filtered = rows.filter((r) => {
    if (filter !== "all" && r.role !== filter) return false;
    if (search) {
      const s = search.toLowerCase();
      return (
        (r.full_name ?? "").toLowerCase().includes(s) ||
        (r.email ?? "").toLowerCase().includes(s)
      );
    }
    return true;
  });

  const counts: Record<string, number> = { all: rows.length };
  for (const r of rows) counts[r.role] = (counts[r.role] ?? 0) + 1;

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
              {counts.all} total · {counts.admin ?? 0} admin ·{" "}
              {counts.editor ?? 0} editor · {counts.coach ?? 0} coach ·{" "}
              {counts.player ?? 0} player · {counts.parent ?? 0} parent
            </div>
          </div>
          <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
            <input
              className="form-inp compact"
              placeholder="Search name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ minWidth: 200 }}
            />
            <select
              className="form-inp compact"
              value={filter}
              onChange={(e) => setFilter(e.target.value as UserRole | "all")}
            >
              <option value="all">All roles</option>
              {ALL_ROLES.map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABEL[r].en}
                </option>
              ))}
            </select>
            <button
              className="btn btn-sm btn-primary"
              onClick={() => setShowCreate(true)}
            >
              <span className="ar">+ حساب جديد</span>
              <span className="en">+ New Account</span>
            </button>
          </div>
        </div>
      </div>

      {error && (
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
          {error}
        </div>
      )}

      <div className="panel" style={{ overflow: "auto" }}>
        <table className="dtable">
          <thead>
            <tr>
              <th>
                <span className="ar">المستخدم</span>
                <span className="en">User</span>
              </th>
              <th>
                <span className="ar">البريد</span>
                <span className="en">Email</span>
              </th>
              <th style={{ width: 160 }}>
                <span className="ar">الدور</span>
                <span className="en">Role</span>
              </th>
              <th style={{ width: 130 }}>
                <span className="ar">منذ</span>
                <span className="en">Joined</span>
              </th>
              <th style={{ width: 110 }}>
                <span className="ar">إجراء</span>
                <span className="en">Action</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={5}
                  style={{ padding: "1.5rem", textAlign: "center", color: "#999" }}
                >
                  …
                </td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    padding: "1.5rem",
                    textAlign: "center",
                    color: "#999",
                    fontSize: ".85rem",
                  }}
                >
                  <span className="ar">لا يوجد مستخدمون مطابقون</span>
                  <span className="en">No matching users</span>
                </td>
              </tr>
            )}
            {!loading &&
              filtered.map((r) => {
                const initial = (r.full_name ?? r.email ?? "?")
                  .trim()
                  .charAt(0)
                  .toUpperCase();
                return (
                  <tr key={r.id}>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          gap: ".75rem",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            background: "#0A5234",
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 600,
                            borderRadius: 4,
                          }}
                        >
                          {initial}
                        </div>
                        <input
                          className="form-inp compact"
                          defaultValue={r.full_name ?? ""}
                          placeholder="(name)"
                          onBlur={(e) => {
                            if (e.target.value !== (r.full_name ?? ""))
                              updateName(r.id, e.target.value);
                          }}
                          disabled={savingId === r.id}
                          style={{ minWidth: 160 }}
                        />
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: ".82rem", color: "#444" }}>
                        {r.email ?? "—"}
                      </span>
                    </td>
                    <td>
                      <select
                        className="form-inp compact"
                        value={r.role}
                        onChange={(e) =>
                          changeRole(r.id, e.target.value as UserRole)
                        }
                        disabled={savingId === r.id}
                      >
                        {ALL_ROLES.map((role) => (
                          <option key={role} value={role}>
                            {ROLE_LABEL[role].en}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <span style={{ opacity: 0.6, fontSize: ".78rem" }}>
                        {new Date(r.created_at).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => deleteUser(r.id)}
                        className="btn btn-sm"
                        style={{
                          background: "rgba(200,16,46,.1)",
                          color: "#A50D26",
                          border: "none",
                        }}
                      >
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

      {showCreate && (
        <CreateAccountModal
          parents={parents}
          coaches={coaches}
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false);
            load();
          }}
        />
      )}
    </div>
  );
}

function CreateAccountModal({
  parents,
  coaches,
  onClose,
  onCreated,
}: {
  parents: Opt[];
  coaches: Opt[];
  onClose: () => void;
  onCreated: () => void;
}) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("player");
  const [parentId, setParentId] = useState("");
  const [coachId, setCoachId] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const label = (o: Opt) => o.full_name || o.email || o.id.slice(0, 8);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!fullName || !email || !password) {
      setErr("Name, email and password are required");
      return;
    }
    if (role === "player" && !parentId) {
      setErr("A player must be linked to a parent");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          password,
          role,
          parentId: role === "player" ? parentId : undefined,
          coachId: role === "player" && coachId ? coachId : undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setErr(json.error ?? "Could not create account");
        setBusy(false);
        return;
      }
      onCreated();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Network error");
      setBusy(false);
    }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 80,
        background: "rgba(7,11,9,.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="panel"
        style={{
          width: "100%",
          maxWidth: 460,
          background: "#fff",
          padding: 0,
        }}
      >
        <div
          className="panel-hd"
          style={{ borderBottom: "1px solid #E6E6E2" }}
        >
          <div className="panel-ttl">
            <span className="ar">إنشاء حساب</span>
            <span className="en">Create Account</span>
          </div>
        </div>
        <div
          style={{
            padding: "1.25rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: ".85rem",
          }}
        >
          {err && (
            <div
              style={{
                background: "rgba(200,16,46,.08)",
                border: "1px solid rgba(200,16,46,.25)",
                padding: ".6rem .85rem",
                fontSize: ".82rem",
                color: "#A50D26",
              }}
            >
              {err}
            </div>
          )}
          <Field label="Full name">
            <input
              className="form-inp compact"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={busy}
            />
          </Field>
          <Field label="Email">
            <input
              className="form-inp compact"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={busy}
            />
          </Field>
          <Field label="Temporary password">
            <input
              className="form-inp compact"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={busy}
            />
          </Field>
          <Field label="Role">
            <select
              className="form-inp compact"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              disabled={busy}
            >
              {ALL_ROLES.map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABEL[r].en}
                </option>
              ))}
            </select>
          </Field>
          {role === "player" && (
            <>
              <Field label="Parent (required)">
                <select
                  className="form-inp compact"
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  disabled={busy}
                >
                  <option value="">— select parent —</option>
                  {parents.map((p) => (
                    <option key={p.id} value={p.id}>
                      {label(p)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Coach (optional)">
                <select
                  className="form-inp compact"
                  value={coachId}
                  onChange={(e) => setCoachId(e.target.value)}
                  disabled={busy}
                >
                  <option value="">— none —</option>
                  {coaches.map((c) => (
                    <option key={c.id} value={c.id}>
                      {label(c)}
                    </option>
                  ))}
                </select>
              </Field>
              {parents.length === 0 && (
                <p style={{ fontSize: ".78rem", color: "#A50D26" }}>
                  Create a parent account first, then the player.
                </p>
              )}
            </>
          )}
          <div
            style={{
              display: "flex",
              gap: ".6rem",
              marginTop: ".4rem",
            }}
          >
            <button
              type="submit"
              className="btn btn-sm btn-primary"
              disabled={busy}
              style={{ flex: 1, justifyContent: "center" }}
            >
              {busy ? "Creating…" : "Create account"}
            </button>
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={onClose}
              disabled={busy}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: ".68rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: ".14em",
          color: "#5E5E5E",
          marginBottom: ".35rem",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}
