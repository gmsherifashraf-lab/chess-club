"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Play, Calendar as CalendarIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface ClassRow {
  id: string;
  title: string;
  primary_coach_id: string | null;
  branch_name: string | null;
}
interface CoachRow {
  id: string;
  full_name: string;
}

interface Props {
  /** When the coach role is using this, scope to their classes. */
  coachRowId?: string | null;
  /** Label override. Default "New classroom". */
  label?: string;
  /** "primary" filled royal, "ghost" outlined navy. */
  variant?: "primary" | "ghost";
}

export function NewClassroomButton({
  coachRowId,
  label = "New classroom",
  variant = "primary",
}: Props) {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [coaches, setCoaches] = useState<CoachRow[]>([]);
  const [classId, setClassId] = useState<string>("");
  const [coachId, setCoachId] = useState<string>("");
  const [duration, setDuration] = useState<number>(60);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState<"start" | "schedule" | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    (async () => {
      let q = supabase
        .from("classes")
        .select("id,title,primary_coach_id,branches(name)")
        .eq("is_active", true)
        .order("title", { ascending: true });

      const { data: clsData } = await q;
      if (cancelled) return;

      let classRows: ClassRow[] = (clsData ?? []).map((c) => ({
        id: c.id as string,
        title: (c.title as string) ?? "Class",
        primary_coach_id: (c.primary_coach_id as string | null) ?? null,
        branch_name: ((c.branches as { name?: string } | null)?.name) ?? null,
      }));

      // If a coach is using this, filter to classes they're either primary
      // on or assigned to. Admin sees all.
      if (coachRowId) {
        const { data: assignments } = await supabase
          .from("coach_assignments")
          .select("class_id")
          .eq("coach_id", coachRowId);
        const assignedIds = new Set(
          (assignments ?? []).map((a) => a.class_id as string),
        );
        classRows = classRows.filter(
          (c) => c.primary_coach_id === coachRowId || assignedIds.has(c.id),
        );
      }

      const { data: coachData } = await supabase
        .from("coaches")
        .select("id,profiles(full_name)")
        .order("id");

      if (cancelled) return;
      setClasses(classRows);
      setCoaches(
        (coachData ?? []).map((c) => ({
          id: c.id as string,
          full_name:
            ((c.profiles as { full_name?: string } | null)?.full_name
              ?.split("—")[0]
              ?.trim()) ?? "Coach",
        })),
      );

      // Default selection: first class. Auto-pick coach from its primary.
      if (classRows.length > 0 && !classId) {
        setClassId(classRows[0].id);
        setCoachId(classRows[0].primary_coach_id ?? "");
      }
      setLoaded(true);
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, supabase, coachRowId]);

  // When the chosen class changes, auto-set the coach to its primary.
  useEffect(() => {
    if (!classId) return;
    const c = classes.find((x) => x.id === classId);
    if (c?.primary_coach_id) setCoachId(c.primary_coach_id);
  }, [classId, classes]);

  async function submit(startNow: boolean) {
    if (!classId) {
      setError("Pick a class first.");
      return;
    }
    setBusy(startNow ? "start" : "schedule");
    setError(null);
    try {
      const res = await fetch("/api/classroom/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classId,
          coachId: coachId || undefined,
          durationMinutes: duration,
          startNow,
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? `Create failed (${res.status})`);

      if (startNow && body.session?.id) {
        router.push(`/classroom/${body.session.id}`);
      } else {
        setOpen(false);
        setBusy(null);
        // Light refresh so any live/scheduled lists pick up the new row.
        router.refresh();
      }
    } catch (e) {
      setError((e as Error).message);
      setBusy(null);
    }
  }

  const trigger = (
    <button
      type="button"
      onClick={() => setOpen(true)}
      style={
        variant === "primary"
          ? {
              display: "inline-flex",
              alignItems: "center",
              gap: ".4rem",
              background: "var(--c-royal)",
              color: "#fff",
              border: "1px solid var(--c-royal)",
              padding: ".5rem 1rem",
              borderRadius: 5,
              fontSize: ".84rem",
              fontWeight: 500,
              cursor: "pointer",
            }
          : {
              display: "inline-flex",
              alignItems: "center",
              gap: ".4rem",
              background: "transparent",
              color: "var(--c-navy-ink)",
              border: "1px solid var(--c-line)",
              padding: ".5rem 1rem",
              borderRadius: 5,
              fontSize: ".82rem",
              cursor: "pointer",
            }
      }
    >
      <Plus size={14} />
      {label}
    </button>
  );

  if (!open) return trigger;

  const selectedClass = classes.find((c) => c.id === classId);

  return (
    <>
      {trigger}

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ncb-title"
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(11, 24, 48, 0.72)",
          display: "grid",
          placeItems: "center",
          padding: "1rem",
          zIndex: 60,
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
      >
        <div
          style={{
            width: "min(480px, 100%)",
            background: "var(--c-paper)",
            border: "1px solid var(--c-periwinkle)",
            borderRadius: 8,
            padding: "1.25rem 1.4rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            maxHeight: "90vh",
            overflowY: "auto",
            boxShadow: "0 30px 70px -30px rgba(0,0,0,.55)",
          }}
        >
          <header
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: ".75rem",
            }}
          >
            <div>
              <span
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: ".66rem",
                  color: "var(--c-royal)",
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                }}
              >
                New classroom
              </span>
              <h2
                id="ncb-title"
                style={{
                  fontFamily: "var(--font-display), 'Bodoni Moda', serif",
                  fontSize: "1.3rem",
                  margin: ".1rem 0 0",
                  color: "var(--c-navy-ink)",
                  fontWeight: 500,
                }}
              >
                Open a session
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              style={{
                background: "none",
                border: "none",
                color: "var(--c-muted)",
                cursor: "pointer",
                padding: 4,
              }}
            >
              <X size={18} />
            </button>
          </header>

          {!loaded ? (
            <div
              style={{
                height: 80,
                background:
                  "linear-gradient(90deg, var(--c-mist) 0%, var(--c-periwinkle) 50%, var(--c-mist) 100%)",
                backgroundSize: "200% 100%",
                animation: "ncb-shimmer 1.4s ease-in-out infinite",
                borderRadius: 5,
              }}
            />
          ) : classes.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: ".6rem" }}>
              <p style={{ fontSize: ".88rem", color: "var(--c-muted)", lineHeight: 1.5, margin: 0 }}>
                No active classes yet. Create one first, then come back here to open a classroom for it.
              </p>
              <p style={{ fontSize: ".82rem", color: "var(--c-muted)", lineHeight: 1.5, margin: 0 }}>
                You will need at least one <strong>Branch</strong> and one <strong>Coach</strong> first.
                Find both under the admin sidebar.
              </p>
              <div style={{ display: "flex", gap: ".5rem", marginTop: ".25rem" }}>
                <a
                  href="/dashboard/admin?tab=branches"
                  style={{
                    background: "var(--c-mist)",
                    border: "1px solid var(--c-periwinkle)",
                    color: "var(--c-navy-ink)",
                    padding: ".4rem .8rem",
                    borderRadius: 5,
                    fontSize: ".8rem",
                    textDecoration: "none",
                  }}
                >
                  Manage branches
                </a>
                <a
                  href="/dashboard/admin?tab=classes"
                  style={{
                    background: "var(--c-royal)",
                    border: "1px solid var(--c-royal)",
                    color: "#fff",
                    padding: ".4rem .8rem",
                    borderRadius: 5,
                    fontSize: ".8rem",
                    textDecoration: "none",
                    fontWeight: 500,
                  }}
                >
                  Create a class
                </a>
              </div>
            </div>
          ) : (
            <>
              <Field label="Class">
                <select
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  style={inputStyle}
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                      {c.branch_name ? ` · ${c.branch_name}` : ""}
                    </option>
                  ))}
                </select>
              </Field>

              {!coachRowId && (
                <Field label="Coach">
                  <select
                    value={coachId}
                    onChange={(e) => setCoachId(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="">No coach assigned</option>
                    {coaches.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.full_name}
                        {c.id === selectedClass?.primary_coach_id ? " (primary)" : ""}
                      </option>
                    ))}
                  </select>
                </Field>
              )}

              <Field label="Duration">
                <div
                  role="radiogroup"
                  aria-label="Duration"
                  style={{
                    display: "inline-flex",
                    border: "1px solid var(--c-line)",
                    borderRadius: 5,
                    overflow: "hidden",
                  }}
                >
                  {[30, 45, 60, 90].map((m) => (
                    <button
                      key={m}
                      type="button"
                      role="radio"
                      aria-checked={duration === m}
                      onClick={() => setDuration(m)}
                      style={{
                        padding: ".4rem .7rem",
                        background: duration === m ? "var(--c-royal)" : "transparent",
                        color: duration === m ? "#fff" : "var(--c-navy-ink)",
                        border: "none",
                        fontSize: ".82rem",
                        cursor: "pointer",
                      }}
                    >
                      {m} min
                    </button>
                  ))}
                </div>
              </Field>
            </>
          )}

          {error && (
            <p
              role="alert"
              style={{
                color: "#C03333",
                fontSize: ".82rem",
                margin: 0,
                padding: ".5rem .65rem",
                background: "rgba(192, 51, 51, 0.08)",
                border: "1px solid rgba(192, 51, 51, 0.3)",
                borderRadius: 4,
              }}
            >
              {error}
            </p>
          )}

          <footer
            style={{
              display: "flex",
              gap: ".5rem",
              justifyContent: "flex-end",
              borderTop: "1px solid var(--c-line)",
              paddingTop: "1rem",
              marginTop: ".25rem",
            }}
          >
            <button
              type="button"
              onClick={() => submit(false)}
              disabled={!classId || busy !== null}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: ".4rem",
                background: "var(--c-mist)",
                color: "var(--c-navy-ink)",
                border: "1px solid var(--c-periwinkle)",
                padding: ".55rem 1rem",
                borderRadius: 5,
                fontSize: ".84rem",
                cursor: busy ? "wait" : "pointer",
                opacity: busy === "schedule" ? 0.7 : 1,
              }}
            >
              <CalendarIcon size={14} />
              {busy === "schedule" ? "Saving" : "Schedule"}
            </button>
            <button
              type="button"
              onClick={() => submit(true)}
              disabled={!classId || busy !== null}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: ".4rem",
                background: "var(--c-royal)",
                color: "#fff",
                border: "1px solid var(--c-royal)",
                padding: ".55rem 1.1rem",
                borderRadius: 5,
                fontSize: ".86rem",
                fontWeight: 500,
                cursor: busy ? "wait" : "pointer",
                opacity: busy === "start" ? 0.85 : 1,
              }}
            >
              <Play size={14} />
              {busy === "start" ? "Starting" : "Start now"}
            </button>
          </footer>
        </div>
      </div>

      <style>{`
        @keyframes ncb-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: ".3rem" }}>
      <span
        style={{
          fontSize: ".68rem",
          textTransform: "uppercase",
          letterSpacing: ".06em",
          color: "var(--c-muted)",
          fontFamily: "var(--font-mono), monospace",
        }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "var(--c-paper)",
  border: "1px solid var(--c-line)",
  borderRadius: 5,
  padding: ".55rem .65rem",
  fontSize: ".88rem",
  color: "var(--c-navy-ink)",
  fontFamily: "inherit",
};
