"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import FileUpload from "@/components/ui/FileUpload";

interface PlayerOption {
  id:        string;          // auth.users.id
  full_name: string | null;
  email:     string | null;
}

export interface TaskRow {
  id?:             string;
  title:           string;
  description:     string | null;
  due_date:        string | null;
  attachment_url:  string | null;
  assigned_to:     string | null;     // auth.users.id of player
  status:          "open" | "in_progress" | "submitted" | "reviewed" | "closed";
}

interface Props {
  initial?:   TaskRow | null;
  onClose:    () => void;
  onSaved:    () => void;
}

const EMPTY: TaskRow = {
  title:          "",
  description:    "",
  due_date:       "",
  attachment_url: "",
  assigned_to:    "",
  status:         "open",
};

export default function TaskFormModal({ initial, onClose, onSaved }: Props) {
  const supabase = createClient();
  const [form, setForm] = useState<TaskRow>(() => initial ? { ...EMPTY, ...initial } : EMPTY);
  const [players, setPlayers] = useState<PlayerOption[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .eq("role", "player")
        .order("full_name");
      if (error) { setError(error.message); return; }
      setPlayers((data ?? []) as PlayerOption[]);
    })();
  }, [supabase]);

  function update<K extends keyof TaskRow>(key: K, value: TaskRow[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);

    if (!form.title.trim()) {
      setError("Title is required");
      setSaving(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("Not signed in");
      setSaving(false);
      return;
    }

    const payload = {
      title:           form.title.trim(),
      description:     form.description?.trim() || null,
      due_date:        form.due_date || null,
      attachment_url:  form.attachment_url?.trim() || null,
      assigned_to:     form.assigned_to || null,
      status:          form.status,
      ...(initial?.id ? {} : { created_by: user.id }),
    };

    const q = initial?.id
      ? supabase.from("tasks").update(payload).eq("id", initial.id)
      : supabase.from("tasks").insert(payload);

    const { error } = await q;
    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }
    setSaving(false);
    onSaved();
    onClose();
  }

  return (
    <div className="mdal-bd" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="mdal-pn">
        <div style={{ padding: "1.5rem 1.75rem", borderBottom: "1px solid #E5DFD2" }}>
          <h3 className="panel-ttl">
            <span className="ar">{initial?.id ? "تعديل المهمة" : "مهمة جديدة"}</span>
            <span className="en">{initial?.id ? "Edit Task" : "New Task"}</span>
          </h3>
        </div>

        <div style={{ padding: "1.5rem 1.75rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          {error && (
            <div style={{ background: "rgba(212,43,60,.08)", border: "1px solid rgba(212,43,60,.25)", padding: ".7rem 1rem", fontSize: ".82rem", color: "#B02030" }}>
              {error}
            </div>
          )}

          <div>
            <label className="form-lbl">
              <span className="ar">العنوان *</span>
              <span className="en">Title *</span>
            </label>
            <input className="form-inp" value={form.title} onChange={(e) => update("title", e.target.value)} disabled={saving} />
          </div>

          <div>
            <label className="form-lbl">
              <span className="ar">الوصف</span>
              <span className="en">Description</span>
            </label>
            <textarea className="form-inp" rows={4} value={form.description ?? ""} onChange={(e) => update("description", e.target.value)} disabled={saving} />
          </div>

          <div className="g2" style={{ gap: "1rem" }}>
            <div>
              <label className="form-lbl">
                <span className="ar">اللاعب</span>
                <span className="en">Assign to Player</span>
              </label>
              <select className="form-inp" value={form.assigned_to ?? ""} onChange={(e) => update("assigned_to", e.target.value)} disabled={saving}>
                <option value="">— unassigned —</option>
                {players.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.full_name ?? p.email ?? p.id.slice(0, 8)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-lbl">
                <span className="ar">تاريخ التسليم</span>
                <span className="en">Due Date</span>
              </label>
              <input className="form-inp" type="date" value={form.due_date ?? ""} onChange={(e) => update("due_date", e.target.value)} disabled={saving} />
            </div>
          </div>

          <div className="g2" style={{ gap: "1rem" }}>
            <div>
              <label className="form-lbl">
                <span className="ar">مرفق (اختياري)</span>
                <span className="en">Attachment (optional)</span>
              </label>
              <FileUpload bucket="training-material" value={form.attachment_url} onChange={(u) => update("attachment_url", u)} disabled={saving} />
            </div>

            <div>
              <label className="form-lbl">
                <span className="ar">الحالة</span>
                <span className="en">Status</span>
              </label>
              <select className="form-inp" value={form.status} onChange={(e) => update("status", e.target.value as TaskRow["status"])} disabled={saving}>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="submitted">Submitted</option>
                <option value="reviewed">Reviewed</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{ padding: "1rem 1.75rem", borderTop: "1px solid #E5DFD2", display: "flex", gap: ".75rem", justifyContent: "flex-end" }}>
          <button className="btn btn-secondary btn-sm" onClick={onClose} disabled={saving}>
            <span className="ar">إلغاء</span>
            <span className="en">Cancel</span>
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving} style={{ opacity: saving ? .7 : 1 }}>
            <span className="ar">{saving ? "جاري الحفظ…" : "حفظ"}</span>
            <span className="en">{saving ? "Saving…"      : "Save"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
