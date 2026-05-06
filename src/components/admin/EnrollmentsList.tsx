"use client";

import { useEffect, useState, useCallback, Fragment } from "react";
import { createClient } from "@/lib/supabase/client";

type Status = "pending" | "contacted" | "approved" | "rejected";

interface Enrollment {
  id:               string;
  child_first_name: string;
  child_last_name:  string;
  child_dob:        string | null;
  nationality:      string | null;
  school:           string | null;
  chess_level:      string | null;
  program:          string | null;
  mother_name:      string | null;
  father_name:      string | null;
  guardian_email:   string;
  guardian_phone:   string | null;
  notes:            string | null;
  status:           Status;
  created_at:       string;
}

const STATUS_FILTERS: { key: Status | "all"; ar: string; en: string }[] = [
  { key: "all",       ar: "الكل",        en: "All"       },
  { key: "pending",   ar: "معلّق",       en: "Pending"   },
  { key: "contacted", ar: "تمّ التواصل", en: "Contacted" },
  { key: "approved",  ar: "مقبول",       en: "Approved"  },
  { key: "rejected",  ar: "مرفوض",       en: "Rejected"  },
];

const STATUS_BADGE: Record<Status, { ar: string; en: string; cls: string }> = {
  pending:   { ar: "معلّق",       en: "Pending",   cls: "badge-gold"  },
  contacted: { ar: "تمّ التواصل", en: "Contacted", cls: "badge-ink"   },
  approved:  { ar: "مقبول",       en: "Approved",  cls: "badge-green" },
  rejected:  { ar: "مرفوض",       en: "Rejected",  cls: "badge-red"   },
};

const PROGRAM_LABEL: Record<string, { ar: string; en: string }> = {
  "little-queens": { ar: "الملكات الصغيرات", en: "Little Queens" },
  "rising-stars":  { ar: "النجوم الصاعدات",  en: "Rising Stars" },
  "competitive":   { ar: "الجيل التنافسي",   en: "Competitive" },
  "elite":         { ar: "فريق النخبة",      en: "Elite" },
};

function formatDate(s: string | null) {
  if (!s) return "—";
  const d = new Date(s);
  if (isNaN(d.getTime())) return s;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function EnrollmentsList() {
  const supabase = createClient();

  const [rows,   setRows]   = useState<Enrollment[]>([]);
  const [filter, setFilter] = useState<Status | "all">("pending");
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);  // row id being mutated
  const [expanded, setExpanded] = useState<string | null>(null);  // row id whose details are shown

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    let q = supabase.from("enrollments").select("*").order("created_at", { ascending: false });
    if (filter !== "all") q = q.eq("status", filter);

    const { data, error } = await q;
    if (error) setError(error.message);
    else       setRows((data ?? []) as Enrollment[]);
    setLoading(false);
  }, [supabase, filter]);

  useEffect(() => { load(); }, [load]);

  async function setStatus(id: string, status: Status) {
    setUpdating(id);
    const { error } = await supabase.from("enrollments").update({ status }).eq("id", id);
    setUpdating(null);
    if (error) {
      alert(`Update failed: ${error.message}`);
      return;
    }
    load();
  }

  // Quick counts per status (independent of filter)
  const [counts, setCounts] = useState<Record<Status | "all", number>>({ all: 0, pending: 0, contacted: 0, approved: 0, rejected: 0 });
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("enrollments").select("status");
      const c: Record<Status | "all", number> = { all: 0, pending: 0, contacted: 0, approved: 0, rejected: 0 };
      for (const r of (data ?? []) as { status: Status }[]) {
        c.all++;
        c[r.status]++;
      }
      setCounts(c);
    })();
  }, [supabase, rows]);  // refresh counts after rows change

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem" }}>
        <h3 className="font-disp" style={{ fontSize: "1.05rem", color: "#141414" }}>
          <span className="ar">طلبات الانضمام</span>
          <span className="en">Enrollment Applications</span>
        </h3>

        <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap" }}>
          {STATUS_FILTERS.map((s) => {
            const active = filter === s.key;
            return (
              <button
                key={s.key}
                onClick={() => setFilter(s.key)}
                disabled={loading}
                style={{
                  padding: ".4rem .9rem", fontSize: ".75rem",
                  fontWeight: active ? 600 : 400,
                  background: active ? "#141414" : "transparent",
                  color: active ? "#fff" : "#555",
                  border: active ? "1px solid #141414" : "1px solid #D6D0C4",
                  cursor: loading ? "default" : "pointer",
                  fontFamily: "'Noto Sans Arabic','DM Sans',sans-serif",
                }}
              >
                <span className="ar">{s.ar}</span>
                <span className="en">{s.en}</span>
                {" "}
                <span style={{ opacity: .6 }}>({counts[s.key] ?? 0})</span>
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <div style={{ background: "rgba(212,43,60,.08)", border: "1px solid rgba(212,43,60,.25)", padding: ".7rem 1rem", marginBottom: "1rem", fontSize: ".82rem", color: "#B02030" }}>
          {error}
        </div>
      )}

      <div style={{ background: "#fff", border: "1px solid #D6D0C4", overflow: "auto" }}>
        <table className="dtable">
          <thead>
            <tr>
              <th style={{ width: 130 }}><span className="ar">التاريخ</span><span className="en">Submitted</span></th>
              <th><span className="ar">الطفلة</span><span className="en">Child</span></th>
              <th><span className="ar">البرنامج</span><span className="en">Program</span></th>
              <th><span className="ar">ولي الأمر</span><span className="en">Guardian</span></th>
              <th style={{ width: 110 }}><span className="ar">الحالة</span><span className="en">Status</span></th>
              <th style={{ width: 320 }}><span className="ar">إجراء</span><span className="en">Action</span></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={6} style={{ padding: "1.5rem", textAlign: "center", color: "#999" }}>…</td></tr>
            )}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: "1.5rem", textAlign: "center", color: "#999", fontSize: ".85rem" }}>
                  <span className="ar">لا توجد طلبات في هذه الفئة</span>
                  <span className="en">No applications in this filter</span>
                </td>
              </tr>
            )}
            {!loading && rows.map((r) => {
              const program = r.program ? PROGRAM_LABEL[r.program] ?? { ar: r.program, en: r.program } : null;
              const badge   = STATUS_BADGE[r.status];
              const isOpen  = expanded === r.id;
              const isBusy  = updating === r.id;

              return (
                <Fragment key={r.id}>
                  <tr>
                    <td><span style={{ opacity: .6 }}>{formatDate(r.created_at)}</span></td>
                    <td>
                      <button
                        onClick={() => setExpanded(isOpen ? null : r.id)}
                        style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "#141414", fontFamily: "inherit" }}
                      >
                        <b>{r.child_first_name} {r.child_last_name}</b>
                        <span style={{ marginLeft: 6, opacity: .4, fontSize: ".7rem" }}>{isOpen ? "▾" : "▸"}</span>
                      </button>
                    </td>
                    <td>
                      {program
                        ? <><span className="ar">{program.ar}</span><span className="en">{program.en}</span></>
                        : <span style={{ opacity: .3 }}>—</span>}
                    </td>
                    <td>
                      <div style={{ fontSize: ".82rem" }}>{r.guardian_email}</div>
                      {r.guardian_phone && <div style={{ fontSize: ".75rem", opacity: .6 }}>{r.guardian_phone}</div>}
                    </td>
                    <td>
                      <span className={`badge ${badge.cls}`}>
                        <span className="ar">{badge.ar}</span>
                        <span className="en">{badge.en}</span>
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap" }}>
                        <button
                          onClick={() => setStatus(r.id, "approved")}
                          disabled={isBusy || r.status === "approved"}
                          className="btn btn-green btn-sm"
                          style={{ opacity: r.status === "approved" ? .4 : 1 }}
                        >
                          <span className="ar">قبول</span>
                          <span className="en">Approve</span>
                        </button>
                        <button
                          onClick={() => setStatus(r.id, "contacted")}
                          disabled={isBusy || r.status === "contacted"}
                          className="btn btn-secondary btn-sm"
                          style={{ opacity: r.status === "contacted" ? .4 : 1 }}
                        >
                          <span className="ar">تواصلت</span>
                          <span className="en">Contacted</span>
                        </button>
                        <button
                          onClick={() => setStatus(r.id, "rejected")}
                          disabled={isBusy || r.status === "rejected"}
                          className="btn btn-sm"
                          style={{ background: "rgba(212,43,60,.1)", color: "#B02030", border: "none", opacity: r.status === "rejected" ? .4 : 1 }}
                        >
                          <span className="ar">رفض</span>
                          <span className="en">Reject</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                  {isOpen && (
                    <tr>
                      <td colSpan={6} style={{ background: "#FAF7F2", padding: "1rem 1.5rem" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", fontSize: ".82rem" }}>
                          <DetailField label={{ ar: "تاريخ الميلاد", en: "Date of Birth" }}>{formatDate(r.child_dob)}</DetailField>
                          <DetailField label={{ ar: "الجنسية", en: "Nationality" }}>{r.nationality ?? "—"}</DetailField>
                          <DetailField label={{ ar: "المدرسة", en: "School" }}>{r.school ?? "—"}</DetailField>
                          <DetailField label={{ ar: "مستوى الشطرنج", en: "Chess Level" }}>{r.chess_level ?? "—"}</DetailField>
                          <DetailField label={{ ar: "اسم الأم", en: "Mother" }}>{r.mother_name ?? "—"}</DetailField>
                          <DetailField label={{ ar: "اسم الأب", en: "Father" }}>{r.father_name ?? "—"}</DetailField>
                        </div>
                        {r.notes && (
                          <div style={{ marginTop: ".75rem" }}>
                            <DetailField label={{ ar: "ملاحظات", en: "Notes" }}>
                              <span style={{ whiteSpace: "pre-wrap" }}>{r.notes}</span>
                            </DetailField>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DetailField({ label, children }: { label: { ar: string; en: string }; children: React.ReactNode }) {
  return (
    <div>
      <div className="label-xs" style={{ marginBottom: 4 }}>
        <span className="ar">{label.ar}</span>
        <span className="en">{label.en}</span>
      </div>
      <div style={{ color: "#141414" }}>{children}</div>
    </div>
  );
}
