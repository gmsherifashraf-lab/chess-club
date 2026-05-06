"use client";

import { useEffect, useState, useCallback, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";

// ─── Types ────────────────────────────────────────────────────────────────────
export type FieldType = "text" | "number" | "date" | "datetime" | "textarea" | "url";

export interface FieldConfig {
  key:        string;
  labelAr:    string;
  labelEn:    string;
  type:       FieldType;
  required?:  boolean;
  placeholder?: string;
}

export interface ColumnConfig<T> {
  headerAr: string;
  headerEn: string;
  render:   (row: T) => ReactNode;
  width?:   string;
}

export interface CrudShellProps<T extends { id: string }> {
  table:         string;                    // Supabase table name
  titleAr:       string;
  titleEn:       string;
  addLabelAr:    string;
  addLabelEn:    string;
  columns:       ColumnConfig<T>[];
  fields:        FieldConfig[];
  orderBy?:      { column: string; ascending: boolean };
  emptyAr?:      string;
  emptyEn?:      string;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function CrudShell<T extends { id: string }>({
  table, titleAr, titleEn, addLabelAr, addLabelEn,
  columns, fields, orderBy = { column: "created_at", ascending: false },
  emptyAr = "لا توجد بيانات بعد", emptyEn = "No data yet.",
}: CrudShellProps<T>) {
  const supabase = createClient();

  const [rows,    setRows]    = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing,   setEditing]   = useState<T | null>(null);   // null = adding
  const [form,      setForm]      = useState<Record<string, string>>({});
  const [saving,    setSaving]    = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // ── Load list ─────────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .order(orderBy.column, { ascending: orderBy.ascending });

    if (error) setError(error.message);
    else       setRows((data ?? []) as T[]);
    setLoading(false);
  }, [supabase, table, orderBy.column, orderBy.ascending]);

  useEffect(() => { load(); }, [load]);

  // ── Modal helpers ─────────────────────────────────────────────────────────
  function openAdd() {
    setEditing(null);
    setForm(Object.fromEntries(fields.map((f) => [f.key, ""])));
    setFormError(null);
    setModalOpen(true);
  }

  function openEdit(row: T) {
    setEditing(row);
    setForm(
      Object.fromEntries(
        fields.map((f) => {
          const raw = (row as Record<string, unknown>)[f.key];
          return [f.key, raw == null ? "" : String(raw)];
        })
      )
    );
    setFormError(null);
    setModalOpen(true);
  }

  function close() {
    setModalOpen(false);
    setEditing(null);
    setFormError(null);
  }

  // ── Save (insert or update) ───────────────────────────────────────────────
  async function handleSave() {
    setSaving(true);
    setFormError(null);

    const payload: Record<string, unknown> = {};
    for (const f of fields) {
      const raw = form[f.key]?.trim() ?? "";
      if (!raw) {
        if (f.required) {
          setFormError(`${f.labelEn} is required`);
          setSaving(false);
          return;
        }
        payload[f.key] = null;
        continue;
      }
      payload[f.key] = f.type === "number" ? Number(raw) : raw;
    }

    const q = editing
      ? supabase.from(table).update(payload).eq("id", editing.id)
      : supabase.from(table).insert(payload);

    const { error } = await q;
    if (error) {
      setFormError(error.message);
      setSaving(false);
      return;
    }

    setSaving(false);
    close();
    load();
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  async function handleDelete(row: T) {
    if (!confirm("Delete this row? This cannot be undone.")) return;
    const { error } = await supabase.from(table).delete().eq("id", row.id);
    if (error) {
      alert(`Delete failed: ${error.message}`);
      return;
    }
    load();
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: ".75rem" }}>
        <h3 className="font-disp" style={{ fontSize: "1.05rem", color: "#141414" }}>
          <span className="ar">{titleAr}</span>
          <span className="en">{titleEn}</span>
        </h3>
        <button onClick={openAdd} className="btn btn-primary btn-sm">
          <span className="ar">{addLabelAr}</span>
          <span className="en">{addLabelEn}</span>
        </button>
      </div>

      {error && (
        <div style={{ background: "rgba(212,43,60,.08)", border: "1px solid rgba(212,43,60,.25)", padding: ".75rem 1rem", marginBottom: "1rem", fontSize: ".82rem", color: "#B02030" }}>
          {error}
        </div>
      )}

      <div style={{ background: "#fff", border: "1px solid #D6D0C4", overflow: "auto" }}>
        <table className="dtable">
          <thead>
            <tr>
              {columns.map((c, i) => (
                <th key={i} style={c.width ? { width: c.width } : undefined}>
                  <span className="ar">{c.headerAr}</span>
                  <span className="en">{c.headerEn}</span>
                </th>
              ))}
              <th style={{ width: 140 }}>
                <span className="ar">إجراء</span>
                <span className="en">Action</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={columns.length + 1} style={{ padding: "1.5rem", textAlign: "center", color: "#999" }}>
                  …
                </td>
              </tr>
            )}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} style={{ padding: "1.5rem", textAlign: "center", color: "#999", fontSize: ".85rem" }}>
                  <span className="ar">{emptyAr}</span>
                  <span className="en">{emptyEn}</span>
                </td>
              </tr>
            )}
            {!loading && rows.map((row) => (
              <tr key={row.id}>
                {columns.map((c, i) => <td key={i}>{c.render(row)}</td>)}
                <td>
                  <div style={{ display: "flex", gap: ".4rem" }}>
                    <button onClick={() => openEdit(row)} className="btn btn-secondary btn-sm">
                      <span className="ar">تعديل</span>
                      <span className="en">Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(row)}
                      className="btn btn-sm"
                      style={{ background: "rgba(212,43,60,.1)", color: "#B02030", border: "none" }}
                    >
                      <span className="ar">حذف</span>
                      <span className="en">Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <FormModal
          titleAr={editing ? "تعديل" : addLabelAr}
          titleEn={editing ? "Edit" : addLabelEn}
          fields={fields}
          form={form}
          setForm={setForm}
          onCancel={close}
          onSave={handleSave}
          saving={saving}
          error={formError}
        />
      )}
    </div>
  );
}

// ─── Form Modal ───────────────────────────────────────────────────────────────
interface FormModalProps {
  titleAr: string;
  titleEn: string;
  fields:  FieldConfig[];
  form:    Record<string, string>;
  setForm: (next: Record<string, string>) => void;
  onCancel: () => void;
  onSave:   () => void;
  saving:   boolean;
  error:    string | null;
}

function FormModal({
  titleAr, titleEn, fields, form, setForm, onCancel, onSave, saving, error,
}: FormModalProps) {
  function update(key: string, value: string) {
    setForm({ ...form, [key]: value });
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
      style={{
        position: "fixed", inset: 0, background: "rgba(20,20,20,.55)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1.5rem", zIndex: 100,
      }}
    >
      <div
        style={{
          background: "#fff", border: "1px solid #D6D0C4",
          maxWidth: 540, width: "100%", maxHeight: "90vh", overflow: "auto",
          padding: "1.75rem",
        }}
      >
        <h3 className="font-disp" style={{ fontSize: "1.1rem", color: "#141414", marginBottom: "1.25rem" }}>
          <span className="ar">{titleAr}</span>
          <span className="en">{titleEn}</span>
        </h3>

        {error && (
          <div style={{ background: "rgba(212,43,60,.08)", border: "1px solid rgba(212,43,60,.25)", padding: ".7rem 1rem", marginBottom: "1rem", fontSize: ".82rem", color: "#B02030" }}>
            {error}
          </div>
        )}

        <form
          onSubmit={(e) => { e.preventDefault(); onSave(); }}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {fields.map((f) => (
            <div key={f.key}>
              <label className="form-lbl">
                <span className="ar">{f.labelAr}</span>
                <span className="en">{f.labelEn}{f.required ? " *" : ""}</span>
              </label>
              {f.type === "textarea" ? (
                <textarea
                  className="form-inp"
                  rows={4}
                  value={form[f.key] ?? ""}
                  onChange={(e) => update(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  required={f.required}
                  disabled={saving}
                />
              ) : (
                <input
                  className="form-inp"
                  type={
                    f.type === "number"   ? "number" :
                    f.type === "date"     ? "date"   :
                    f.type === "datetime" ? "datetime-local" :
                    f.type === "url"      ? "url"    :
                    "text"
                  }
                  value={form[f.key] ?? ""}
                  onChange={(e) => update(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  required={f.required}
                  disabled={saving}
                />
              )}
            </div>
          ))}

          <div style={{ display: "flex", gap: ".75rem", justifyContent: "flex-end", marginTop: ".5rem" }}>
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="btn btn-secondary btn-sm"
            >
              <span className="ar">إلغاء</span>
              <span className="en">Cancel</span>
            </button>
            <button
              type="submit"
              disabled={saving}
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
        </form>
      </div>
    </div>
  );
}
